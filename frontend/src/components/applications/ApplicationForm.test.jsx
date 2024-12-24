import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ApplicationForm from './ApplicationForm';
import { api } from '../../utils/api';

// Mock the api module
vi.mock('../../utils/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('ApplicationForm Component', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    api.get.mockResolvedValueOnce({ data: [{ projectCode: 'PROJ1', projectName: 'Project 1' }] });
    api.get.mockResolvedValueOnce({ data: [{ id: 1, name: 'Topic Area 1' }] });
  });

  it('renders the form with all fields', async () => {
    render(<ApplicationForm onSubmit={mockOnSubmit} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Project/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Topic Area/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Create Application/i)).toBeInTheDocument();
  });

  it('submits the form with correct data', async () => {
    render(<ApplicationForm onSubmit={mockOnSubmit} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Project/i)).toBeInTheDocument();
    });

    await userEvent.selectOptions(screen.getByLabelText(/Project/i), 'PROJ1');
    await userEvent.selectOptions(screen.getByLabelText(/Topic Area/i), '1');
    await userEvent.selectOptions(screen.getByLabelText(/Status/i), 'Development');

    await userEvent.click(screen.getByText(/Create Application/i));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      projectCode: 'PROJ1',
      topicAreaId: '1',
      status: 'Development',
      reasonWithdrawn: '',
      outcome: '',
    });
  });

  it('displays additional fields based on status', async () => {
    render(<ApplicationForm onSubmit={mockOnSubmit} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    });

    await userEvent.selectOptions(screen.getByLabelText(/Status/i), 'Withdrawn');
    expect(screen.getByLabelText(/Reason Withdrawn/i)).toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText(/Status/i), 'Determined');
    expect(screen.getByLabelText(/Outcome/i)).toBeInTheDocument();
  });

  it('populates form fields when editing an existing application', async () => {
    const existingApplication = {
      projectCode: 'PROJ1',
      topicAreaId: '1',
      status: 'Development',
    };

    render(<ApplicationForm application={existingApplication} onSubmit={mockOnSubmit} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Project/i)).toHaveValue('PROJ1');
      expect(screen.getByLabelText(/Topic Area/i)).toHaveValue('1');
      expect(screen.getByLabelText(/Status/i)).toHaveValue('Development');
    });

    expect(screen.getByText(/Update Application/i)).toBeInTheDocument();
  });

  it('displays error messages for invalid form submission', async () => {
    render(<ApplicationForm onSubmit={mockOnSubmit} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Project/i)).toBeInTheDocument();
    });

    // Submit the form without filling any fields
    await userEvent.click(screen.getByText(/Create Application/i));

    expect(await screen.findByText('Project is required')).toBeInTheDocument();
    expect(await screen.findByText('Topic Area is required')).toBeInTheDocument();

    // Fill in some fields and check if errors are cleared
    await userEvent.selectOptions(screen.getByLabelText(/Project/i), 'PROJ1');
    expect(screen.queryByText('Project is required')).not.toBeInTheDocument();

    // Check for conditional validation
    await userEvent.selectOptions(screen.getByLabelText(/Status/i), 'Withdrawn');
    await userEvent.click(screen.getByText(/Create Application/i));
    expect(await screen.findByText('Reason for withdrawal is required')).toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText(/Status/i), 'Determined');
    await userEvent.click(screen.getByText(/Create Application/i));
    expect(await screen.findByText('Outcome is required')).toBeInTheDocument();
  });

  it('shows loading indicator while fetching data', async () => {
    api.get.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<ApplicationForm onSubmit={mockOnSubmit} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });
});