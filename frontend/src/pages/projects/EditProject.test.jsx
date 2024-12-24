import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, render, fireEvent, waitFor } from '../../utils/test-utils';
import EditProject from './EditProject';
import { mockApi, mockNavigate } from '../../utils/test-utils';

describe('EditProject Component', () => {
  const mockProject = {
    project_code: 'TEST',
    project_name: 'Test Project',
    description: 'Test Description',
    archived: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockApi.projects.getById.mockResolvedValue({ data: mockProject });
  });

  const fillForm = async (values) => {
    if (values.project_name) {
      fireEvent.change(screen.getByLabelText(/project name/i), {
        target: { value: values.project_name },
      });
    }
    if (values.description) {
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: values.description },
      });
    }
    if (values.archived !== undefined) {
      const checkbox = screen.getByRole('checkbox');
      if (values.archived !== checkbox.checked) {
        fireEvent.click(checkbox);
      }
    }
  };

  it('renders loading state initially', () => {
    render(<EditProject />);
    expect(screen.getByText('Loading project...')).toBeInTheDocument();
  });

  it('loads and displays project data', async () => {
    render(<EditProject />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/project name/i)).toHaveValue(mockProject.project_name);
      expect(screen.getByLabelText(/description/i)).toHaveValue(mockProject.description);
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });
  });

  it('shows error when project fails to load', async () => {
    const errorMessage = 'Failed to load project';
    mockApi.projects.getById.mockRejectedValue(new Error(errorMessage));

    render(<EditProject />);
    
    await waitFor(() => {
      expect(screen.getByText(`Error loading project:`)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('shows not found message when project does not exist', async () => {
    mockApi.projects.getById.mockResolvedValue({ data: null });

    render(<EditProject />);
    
    await waitFor(() => {
      expect(screen.getByText('Project not found.')).toBeInTheDocument();
    });
  });

  it('updates project successfully', async () => {
    const updatedProject = {
      ...mockProject,
      project_name: 'Updated Project',
      description: 'Updated Description',
      archived: true,
    };

    mockApi.projects.update.mockResolvedValue({ data: updatedProject });

    render(<EditProject />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
    });

    await fillForm(updatedProject);
    fireEvent.click(screen.getByRole('button', { name: /update project/i }));

    await waitFor(() => {
      expect(mockApi.projects.update).toHaveBeenCalledWith(
        mockProject.project_code,
        expect.objectContaining({
          project_name: updatedProject.project_name,
          description: updatedProject.description,
          archived: updatedProject.archived,
        })
      );
      expect(mockNavigate).toHaveBeenCalledWith('/projects', {
        state: { message: 'Project updated successfully' },
      });
    });
  });

  it('handles validation errors', async () => {
    render(<EditProject />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
    });

    // Clear required field
    await fillForm({ project_name: '' });
    fireEvent.click(screen.getByRole('button', { name: /update project/i }));

    await waitFor(() => {
      expect(screen.getByText(/project name is required/i)).toBeInTheDocument();
    });
  });

  it('handles API errors correctly', async () => {
    const errorMessage = 'Project name already exists';
    mockApi.projects.update.mockRejectedValue({
      response: {
        status: 400,
        data: {
          errors: {
            project_name: errorMessage,
          },
        },
      },
    });

    render(<EditProject />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
    });

    await fillForm({ project_name: 'Duplicate Name' });
    fireEvent.click(screen.getByRole('button', { name: /update project/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('navigates back to projects list when cancel is clicked', async () => {
    render(<EditProject />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/projects');
  });

  it('renders correct breadcrumb navigation', async () => {
    render(<EditProject />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
    });

    const breadcrumbs = screen.getAllByRole('link');
    expect(breadcrumbs[0]).toHaveTextContent('Dashboard');
    expect(breadcrumbs[1]).toHaveTextContent('Projects');
  });
});