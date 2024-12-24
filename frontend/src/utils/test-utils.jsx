import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import PropTypes from 'prop-types';
import { vi } from 'vitest';
import { AuthProvider } from '../contexts/AuthContext';

const theme = createTheme();

function AllTheProviders({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>{children}</AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

AllTheProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Mock API functions
const mockApi = {
  projects: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getCount: vi.fn(),
  },
  auth: {
    login: vi.fn(),
    register: vi.fn(),
  },
};

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock API module
vi.mock('../utils/api', () => ({
  projects: mockApi.projects,
  auth: mockApi.auth,
  handleApiError: (error) => ({
    error: true,
    message: error.message || 'An error occurred',
  }),
}));

// Re-export everything
export * from '@testing-library/react';
export { customRender as render, mockApi, mockNavigate };