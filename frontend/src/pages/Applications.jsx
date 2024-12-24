import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Toast from '../components/common/Toast';
import { applications as applicationsApi, handleApiError } from '../utils/api';

const columns = [
  {
    field: 'application_id',
    headerName: 'ID',
    width: 70,
  },
  {
    field: 'project_code',
    headerName: 'Project Code',
    width: 130,
  },
  {
    field: 'project_name',
    headerName: 'Project Name',
    width: 200,
    flex: 1,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
  },
  {
    field: 'outcome',
    headerName: 'Outcome',
    width: 130,
    valueGetter: (params) => params.row.outcome || 'N/A',
  }
];

export default function Applications() {
  const [applicationList, setApplicationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const location = useLocation();

  const fetchApplications = async () => {
    try {
      console.log('Fetching applications...');
      const data = await applicationsApi.getAll();
      console.log('Applications API response:', data);
      
      // Ensure data is an array
      const applicationsArray = Array.isArray(data) ? data : [];
      console.log('Applications array:', applicationsArray);
      
      setApplicationList(applicationsArray);
      setError('');
    } catch (err) {
      console.error('Error fetching applications:', err);
      const errorResult = handleApiError(err);
      setError(errorResult.message);
      setToast({
        open: true,
        message: `Failed to load applications: ${errorResult.message}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
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
    navigate('/applications/new');
  };

  const handleEdit = (application) => {
    console.log('Edit clicked for application:', application);
    navigate(`/applications/${application.application_id}/edit`);
  };

  const handleView = (application) => {
    console.log('View clicked for application:', application);
    navigate(`/applications/${application.application_id}`);
  };

  const handleDelete = (application) => {
    console.log('Delete clicked for application:', application);
    setSelectedApplication(application);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await applicationsApi.delete(selectedApplication.application_id);
      await fetchApplications();
      setDeleteDialogOpen(false);
      setSelectedApplication(null);
      setToast({
        open: true,
        message: 'Application deleted successfully',
        severity: 'success',
      });
    } catch (err) {
      const errorResult = handleApiError(err);
      setToast({
        open: true,
        message: `Failed to delete application: ${errorResult.message}`,
        severity: 'error',
      });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading applications..." />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" gutterBottom>
          Error loading applications:
        </Typography>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Applications"
        subtitle="Manage your applications"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Applications' },
        ]}
        action
        actionText="Add Application"
        onActionClick={handleAddNew}
      />

      <DataTable
        rows={applicationList}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        getRowId={(row) => row.application_id}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Application"
        message={`Are you sure you want to delete application ${selectedApplication?.application_id}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedApplication(null);
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