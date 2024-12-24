import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, render, fireEvent, waitFor } from '../../utils/test-utils';
import ViewProject from './ViewProject';
import { mockApi, mockNavigate } from '../../utils/test-utils';

describe('ViewProject Component', () => {
  const mockProject = {
    project_code: 'TEST',
    project_name: 'Test Project',
    description: 'Test Description',
    archived: false,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockApi.projects.getById.mockResolvedValue({ data: mockProject });
  });

  it('renders loading state initially', () => {
    render(<ViewProject />);
    expect(screen.getByText('Loading project details...')).toBeInTheDocument();
  });

  it('renders project details after loading', async () => {
    render(<ViewProject />);
    
    await waitFor(() => {
      expect(screen.getByText(mockProject.project_name)).toBeInTheDocument();
    });

    expect(screen.getByText(mockProject.project_code)).toBeInTheDocument();
    expect(screen.getByText(mockProject.description)).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders archived status correctly', async () => {
    const archivedProject = { ...mockProject, archived: true };
    mockApi.projects.getById.mockResolvedValue({ data: archivedProject });

    render(<ViewProject />);
    
    await waitFor(() => {
      expect(screen.getByText('Archived')).toBeInTheDocument();
    });
  });

  it('navigates to edit page when edit button is clicked', async () => {
    render(<ViewProject />);
    
    await waitFor(() => {
      expect(screen.getByText(mockProject.project_name)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /edit project/i }));
    expect(mockNavigate).toHaveBeenCalledWith(`/projects/${mockProject.project_code}/edit`);
  });

  it('navigates back to projects list when back button is clicked', async () => {
    render(<ViewProject />);
    
    await waitFor(() => {
      expect(screen.getByText(mockProject.project_name)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /back to projects/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/projects');
  });

  it('shows error message when project fails to load', async () => {
    const errorMessage = 'Failed to load project';
    mockApi.projects.getById.mockRejectedValue(new Error(errorMessage));

    render(<ViewProject />);
    
    await waitFor(() => {
      expect(screen.getByText(`Error loading project:`)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('shows not found message when project does not exist', async () => {
    mockApi.projects.getById.mockResolvedValue({ data: null });

    render(<ViewProject />);
    
    await waitFor(() => {
      expect(screen.getByText('Project not found.')).toBeInTheDocument();
    });
  });

  it('displays formatted dates correctly', async () => {
    render(<ViewProject />);
    
    await waitFor(() => {
      expect(screen.getByText(mockProject.project_name)).toBeInTheDocument();
    });

    const createdDate = new Date(mockProject.created_at).toLocaleString();
    const updatedDate = new Date(mockProject.updated_at).toLocaleString();

    expect(screen.getByText(createdDate)).toBeInTheDocument();
    expect(screen.getByText(updatedDate)).toBeInTheDocument();
  });

  it('renders correct breadcrumb navigation', async () => {
    render(<ViewProject />);
    
    await waitFor(() => {
      expect(screen.getByText(mockProject.project_name)).toBeInTheDocument();
    });

    const breadcrumbs = screen.getAllByRole('link');
    expect(breadcrumbs[0]).toHaveTextContent('Dashboard');
    expect(breadcrumbs[1]).toHaveTextContent('Projects');
  });
});