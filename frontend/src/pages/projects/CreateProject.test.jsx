import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, render, fireEvent, waitFor } from '../../utils/test-utils';
import CreateProject from './CreateProject';
import { mockApi, mockNavigate } from '../../utils/test-utils';

describe('CreateProject Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const fillForm = async (values) => {
    if (values.project_code) {
      fireEvent.change(screen.getByLabelText(/project code/i), {
        target: { value: values.project_code },
      });
    }
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
  };

  it('renders create project form', () => {
    render(<CreateProject />);
    
    expect(screen.getByText('Create Project')).toBeInTheDocument();
    expect(screen.getByText('Add a new project to the system')).toBeInTheDocument();
    expect(screen.getByLabelText(/project code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('navigates back to projects list when cancel is clicked', () => {
    render(<CreateProject />);
    
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/projects');
  });

  it('creates project successfully', async () => {
    const newProject = {
      project_code: 'TEST',
      project_name: 'Test Project',
      description: 'Test Description',
    };

    mockApi.projects.create.mockResolvedValue({ data: newProject });

    render(<CreateProject />);
    await fillForm(newProject);
    
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));

    await waitFor(() => {
      expect(mockApi.projects.create).toHaveBeenCalledWith(newProject);
      expect(mockNavigate).toHaveBeenCalledWith('/projects', {
        state: { message: 'Project created successfully' },
      });
    });
  });

  it('displays validation errors', async () => {
    render(<CreateProject />);
    
    // Submit without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));

    await waitFor(() => {
      expect(screen.getByText(/project code is required/i)).toBeInTheDocument();
      expect(screen.getByText(/project name is required/i)).toBeInTheDocument();
    });
  });

  it('handles API errors correctly', async () => {
    const errorMessage = 'Project code already exists';
    mockApi.projects.create.mockRejectedValue({
      response: {
        status: 400,
        data: {
          errors: {
            project_code: errorMessage,
          },
        },
      },
    });

    render(<CreateProject />);
    await fillForm({
      project_code: 'TEST',
      project_name: 'Test Project',
    });
    
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('handles unexpected errors correctly', async () => {
    const errorMessage = 'Server error';
    mockApi.projects.create.mockRejectedValue(new Error(errorMessage));

    render(<CreateProject />);
    await fillForm({
      project_code: 'TEST',
      project_name: 'Test Project',
    });
    
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('shows loading state while submitting', async () => {
    mockApi.projects.create.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<CreateProject />);
    await fillForm({
      project_code: 'TEST',
      project_name: 'Test Project',
    });
    
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create project/i })).toBeDisabled();
    });
  });

  it('renders correct breadcrumb navigation', () => {
    render(<CreateProject />);

    const breadcrumbs = screen.getAllByRole('link');
    expect(breadcrumbs[0]).toHaveTextContent('Dashboard');
    expect(breadcrumbs[1]).toHaveTextContent('Projects');
  });
});