/* eslint-disable react/prop-types */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Applications from './Applications';
import { api } from '../utils/api';

// Mock the api module
vi.mock('../utils/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock the components used in Applications
vi.mock('../components/common/DataTable', () => ({
  DataTable: ({ rows, columns }) => (
    <div data-testid="data-table">
      {rows.map((row) => (
        <div key={row.id}>
          {columns.map((column) => (
            <span key={column.field}>
              {column.renderCell ? column.renderCell({ row }) : row[column.field]}
            </span>
          ))}
        </div>
      ))}
    </div>
  ),
}));
/* eslint-enable react/prop-types */

vi.mock('../components/common/PageHeader', () => ({
  PageHeader: () => <div data-testid="page-header">PageHeader</div>,
}));

vi.mock('../components/applications/ApplicationForm', () => ({
  default: () => <div data-testid="application-form">ApplicationForm</div>,
}));

vi.mock('../components/common/ConfirmDialog', () => ({
  default: ({ onConfirm, onClose }) => (
    <div data-testid="confirm-dialog">
      <button onClick={onConfirm}>Confirm</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  ),
}));

vi.mock('../components/common/Toast', () => ({
  default: ({ message }) => <div data-testid="toast">{message}</div>,
}));

describe('Applications Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    api.get.mockResolvedValue({ data: [] });
  });

  it('renders without crashing', async () => {
    render(<Applications />);
    expect(screen.getByTestId('page-header')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId('data-table')).toBeInTheDocument());
  });

  it('fetches applications on mount', async () => {
    render(<Applications />);
    await waitFor(() => expect(api.get).toHaveBeenCalledWith('/applications'));
  });

  it('opens the create application form when the create button is clicked', async () => {
    render(<Applications />);
    const createButton = screen.getByText('Create New Application');
    await userEvent.click(createButton);
    await waitFor(() => expect(screen.getByTestId('application-form')).toBeInTheDocument());
  });

  it('creates a new application when the form is submitted', async () => {
    api.post.mockResolvedValue({ data: { id: 1, projectCode: 'TEST' } });
    render(<Applications />);
    const createButton = screen.getByText('Create New Application');
    await userEvent.click(createButton);
    
    // Simulate form submission
    const submitButton = screen.getByText('Create Application');
    await userEvent.click(submitButton);

    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/applications', expect.any(Object)));
    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(2)); // Initial fetch + after creation
  });

  it('deletes an application when confirmed', async () => {
    api.get.mockResolvedValue({ data: [{ id: 1, projectCode: 'TEST' }] });
    api.delete.mockResolvedValue({});
    render(<Applications />);

    await waitFor(() => expect(screen.getByText('Delete')).toBeInTheDocument());
    await userEvent.click(screen.getByText('Delete'));

    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Confirm'));

    await waitFor(() => expect(api.delete).toHaveBeenCalledWith('/applications/1'));
    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(2)); // Initial fetch + after deletion
  });

  it('shows success toast on successful operations', async () => {
    api.post.mockResolvedValue({ data: { id: 1, projectCode: 'TEST' } });
    render(<Applications />);
    const createButton = screen.getByText('Create New Application');
    await userEvent.click(createButton);
    
    const submitButton = screen.getByText('Create Application');
    await userEvent.click(submitButton);

    await waitFor(() => expect(screen.getByTestId('toast')).toHaveTextContent('Application created successfully'));
  });

  it('shows error toast on failed operations', async () => {
    api.post.mockRejectedValue(new Error('API Error'));
    render(<Applications />);
    const createButton = screen.getByText('Create New Application');
    await userEvent.click(createButton);
    
    const submitButton = screen.getByText('Create Application');
    await userEvent.click(submitButton);

    await waitFor(() => expect(screen.getByTestId('toast')).toHaveTextContent('Failed to create application'));
  });
});