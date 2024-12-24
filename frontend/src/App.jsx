import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import PropTypes from 'prop-types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import MainLayout from './components/layout/MainLayout';
import ErrorBoundary from './components/common/ErrorBoundary';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import CreateProject from './pages/projects/CreateProject';
import EditProject from './pages/projects/EditProject';
import ViewProject from './pages/projects/ViewProject';
import Applications from './pages/Applications';
import ViewApplication from './pages/applications/ViewApplication';
import EditApplication from './pages/applications/EditApplication';
import NotFound from './pages/NotFound';
import Reports from './pages/Reports';
import Consultants from './pages/Consultants';
import TopicAreas from './pages/TopicAreas';
import Tasks from './pages/Tasks';
import Quotes from './pages/Quotes';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <MainLayout>{children}</MainLayout>;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return children;
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Project Routes */}
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/new"
        element={
          <ProtectedRoute>
            <CreateProject />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectCode"
        element={
          <ProtectedRoute>
            <ViewProject />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectCode/edit"
        element={
          <ProtectedRoute>
            <EditProject />
          </ProtectedRoute>
        }
      />

      {/* Application Routes */}
      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <Applications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications/new"
        element={
          <ProtectedRoute>
            <div>Create Application (Coming Soon)</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications/:id"
        element={
          <ProtectedRoute>
            <ViewApplication />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications/:id/edit"
        element={
          <ProtectedRoute>
            <EditApplication />
          </ProtectedRoute>
        }
      />

      {/* Quote Routes */}
      <Route
        path="/quotes"
        element={
          <ProtectedRoute>
            <Quotes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quotes/new"
        element={
          <ProtectedRoute>
            <div>Create Quote (Coming Soon)</div>
          </ProtectedRoute>
        }
      />

      {/* Consultant Routes */}
      <Route
        path="/consultants"
        element={
          <ProtectedRoute>
            <Consultants />
          </ProtectedRoute>
        }
      />
      <Route
        path="/consultants/new"
        element={
          <ProtectedRoute>
            <div>Create Consultant (Coming Soon)</div>
          </ProtectedRoute>
        }
      />

      {/* Topic Area Routes */}
      <Route
        path="/topic-areas"
        element={
          <ProtectedRoute>
            <TopicAreas />
          </ProtectedRoute>
        }
      />
      <Route
        path="/topic-areas/new"
        element={
          <ProtectedRoute>
            <div>Create Topic Area (Coming Soon)</div>
          </ProtectedRoute>
        }
      />

      {/* Task Routes */}
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/new"
        element={
          <ProtectedRoute>
            <div>Create Task (Coming Soon)</div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <Router>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
