import { describe, it, expect, vi } from 'vitest';
import { screen, render, fireEvent, waitFor } from '../../utils/test-utils';
import ProjectForm from './ProjectForm';

describe('ProjectForm Component', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    loading: false,
  };

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

  it('renders all form fields', () => {
    render(<ProjectForm {...defaultProps} />);
    
    expect(screen.getByLabelText(/project code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/archive project/i)).toBeInTheDocument();
  });

  it('disables project code field in edit mode', () => {
    render(<ProjectForm {...defaultProps} isEdit />);
    expect(screen.getByLabelText(/project code/i)).toBeDisabled();
  });

  it('shows validation errors for required fields', async () => {
    render(<ProjectForm {...defaultProps} />);
    
    // Submit without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));

    await waitFor(() => {
      expect(screen.getByText(/project code is required/i)).toBeInTheDocument();
      expect(screen.getByText(/project name is required/i)).toBeInTheDocument();
    });
  });

  it('validates project code format', async () => {
    render(<ProjectForm {...defaultProps} />);
    
    await fillForm({ project_code: 'invalid' });
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));

    await waitFor(() => {
      expect(screen.getByText(/project code must be 4 uppercase letters or numbers/i)).toBeInTheDocument();
    });
  });

  it('validates project name length', async () => {
    render(<ProjectForm {...defaultProps} />);
    
    await fillForm({ project_name: 'ab' }); // Too short
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));

    await waitFor(() => {
      expect(screen.getByText(/project name must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<ProjectForm {...defaultProps} />);
    
    const validData = {
      project_code: 'TEST',
      project_name: 'Test Project',
      description: 'Test Description',
    };

    await fillForm(validData);
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining(validData),
        expect.any(Object)
      );
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<ProjectForm {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('disables submit button when loading', () => {
    render(<ProjectForm {...defaultProps} loading />);
    expect(screen.getByRole('button', { name: /create project/i })).toBeDisabled();
  });

  it('initializes form with provided values', () => {
    const initialValues = {
      project_code: 'TEST',
      project_name: 'Test Project',
      description: 'Test Description',
      archived: true,
    };

    render(<ProjectForm {...defaultProps} initialValues={initialValues} />);
    
    expect(screen.getByLabelText(/project code/i)).toHaveValue(initialValues.project_code);
    expect(screen.getByLabelText(/project name/i)).toHaveValue(initialValues.project_name);
    expect(screen.getByLabelText(/description/i)).toHaveValue(initialValues.description);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('shows different button text in edit mode', () => {
    render(<ProjectForm {...defaultProps} isEdit />);
    expect(screen.getByRole('button', { name: /update project/i })).toBeInTheDocument();
  });
});