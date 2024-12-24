import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, render, fireEvent, waitFor } from '../utils/test-utils';
import Projects from './Projects';
import { mockApi, mockNavigate } from '../utils/test-utils';

describe('Projects Component', () => {
  const mockProjects = [
    {
      project_code: 'TEST',
      project_name: 'Test Project',
      description: 'Test Description',
      archived: false,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    mockApi.projects.getAll.mockResolvedValue({ data: mockProjects });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<Projects />);
    expect(screen.getByText('Loading projects...')).toBeInTheDocument();
  });

  it('renders projects after loading', async () => {
    render(<Projects />);
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });
  });

  it('navigates to create project page when Add Project is clicked', async () => {
    render(<Projects />);
    await waitFor(() => {
      expect(screen.getByText('Add Project')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Add Project'));
    expect(mockNavigate).toHaveBeenCalledWith('/projects/new');
  });

  it('navigates to edit project page when edit button is clicked', async () => {
    render(<Projects />);
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    // Wait for loading to finish and grid to be fully rendered with data
    await waitFor(() => {
      expect(screen.queryByText('Loading projects...')).not.toBeInTheDocument();
      expect(screen.getByText('Test Project')).toBeInTheDocument();
      const cells = screen.getAllByRole('cell');
      expect(cells.some(cell => cell.textContent === 'TEST')).toBe(true);
    });

    // Find and click the edit button
    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);
    expect(mockNavigate).toHaveBeenCalledWith('/projects/TEST/edit');
  });

  it('shows delete confirmation dialog when delete button is clicked', async () => {
    render(<Projects />);
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    // Find and click the delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i, hidden: true });
    fireEvent.click(deleteButton);

    expect(screen.getByText('Delete Project')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete project TEST/)).toBeInTheDocument();
  });

  it('deletes project when confirmed in dialog', async () => {
    mockApi.projects.delete.mockResolvedValue({});
    mockApi.projects.getAll.mockResolvedValueOnce({ data: mockProjects })
      .mockResolvedValueOnce({ data: [] }); // After deletion

    render(<Projects />);
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    // Find and click the delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i, hidden: true });
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockApi.projects.delete).toHaveBeenCalledWith('TEST');
    });

    // Verify success message
    expect(screen.getByText('Project deleted successfully')).toBeInTheDocument();
  });

  it('shows error message when project deletion fails', async () => {
    const errorMessage = 'Failed to delete project';
    mockApi.projects.delete.mockRejectedValue(new Error(errorMessage));

    render(<Projects />);
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    // Find and click the delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i, hidden: true });
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText(`Failed to delete project: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  it('shows error message when projects fail to load', async () => {
    const errorMessage = 'Failed to load projects';
    mockApi.projects.getAll.mockRejectedValue(new Error(errorMessage));

    render(<Projects />);
    await waitFor(() => {
      expect(screen.getByText(`Failed to load projects: ${errorMessage}`)).toBeVisible();
    });
  });
});