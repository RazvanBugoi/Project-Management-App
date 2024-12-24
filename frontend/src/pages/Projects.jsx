import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Toast from '../components/common/Toast';
import { projects as projectsApi, handleApiError } from '../utils/api';

const columns = [
  {
    field: 'project_code',
    headerName: 'Project Code',
    width: 150,
  },
  {
    field: 'project_name',
    headerName: 'Project Name',
    width: 300,
    flex: 1,
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 400,
    flex: 1,
  },
  {
    field: 'archived',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => (
      <Box
        sx={{
          backgroundColor: params.value ? 'error.light' : 'success.light',
          color: params.value ? 'error.dark' : 'success.dark',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.875rem',
        }}
      >
        {params.value ? 'Archived' : 'Active'}
      </Box>
    ),
  },
];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProjects = async () => {
    try {
      console.log('Fetching projects...');
      const data = await projectsApi.getAll();
      console.log('Projects API response:', data);
      
      // Ensure data is an array
      const projectsArray = Array.isArray(data) ? data : [];
      console.log('Projects array:', projectsArray);
      
      setProjects(projectsArray);
      setError('');
    } catch (err) {
      console.error('Error fetching projects:', err);
      const errorResult = handleApiError(err);
      setError(errorResult.message);
      setToast({
        open: true,
        message: `Failed to load projects: ${errorResult.message}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    // Show success message if navigated from create/edit
    if (location.state?.message) {
      setToast({
        open: true,
        message: location.state.message,
        severity: 'success',
      });
      // Clear the message from location state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleAddNew = () => {
    navigate('/projects/new');
  };

  const handleEdit = (project) => {
    console.log('Edit clicked for project:', project);
    navigate(`/projects/${project.project_code}/edit`);
  };

  const handleView = (project) => {
    console.log('View clicked for project:', project);
    navigate(`/projects/${project.project_code}`);
  };

  const handleDelete = (project) => {
    console.log('Delete clicked for project:', project);
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await projectsApi.delete(selectedProject.project_code);
      await fetchProjects();
      setDeleteDialogOpen(false);
      setSelectedProject(null);
      setToast({
        open: true,
        message: 'Project deleted successfully',
        severity: 'success',
      });
    } catch (err) {
      const errorResult = handleApiError(err);
      setToast({
        open: true,
        message: `Failed to delete project: ${errorResult.message}`,
        severity: 'error',
      });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading projects..." />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" gutterBottom>
          Error loading projects:
        </Typography>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Projects"
        subtitle="Manage your projects"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Projects' },
        ]}
        action
        actionText="Add Project"
        onActionClick={handleAddNew}
      />

      <DataTable
        rows={projects}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        getRowId={(row) => row.project_code}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Project"
        message={`Are you sure you want to delete project ${selectedProject?.project_code}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedProject(null);
        }}
        confirmColor="error"
      />

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
}