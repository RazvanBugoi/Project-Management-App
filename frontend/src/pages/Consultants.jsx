import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Toast from '../components/common/Toast';
import { consultants as consultantsApi, handleApiError } from '../utils/api';

const columns = [
  {
    field: 'consultant_id',
    headerName: 'ID',
    width: 100,
  },
  {
    field: 'consultant_name',
    headerName: 'Name',
    width: 200,
    flex: 1,
  },
  {
    field: 'email_1',
    headerName: 'Primary Email',
    width: 250,
  },
  {
    field: 'mobile_1',
    headerName: 'Primary Mobile',
    width: 150,
  },
  {
    field: 'website',
    headerName: 'Website',
    width: 200,
  },
  {
    field: 'consultancy_name',
    headerName: 'Consultancy',
    width: 200,
    valueGetter: (params) => params.row.consultancy?.consultancy_name || '',
  },
];

export default function Consultants() {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const location = useLocation();

  const fetchConsultants = async () => {
    try {
      console.log('Fetching consultants...');
      const data = await consultantsApi.getAll();
      console.log('Consultants API response:', data);
      
      // Ensure data is an array
      const consultantsArray = Array.isArray(data) ? data : [];
      console.log('Consultants array:', consultantsArray);
      
      setConsultants(consultantsArray);
      setError('');
    } catch (err) {
      console.error('Error fetching consultants:', err);
      const errorResult = handleApiError(err);
      setError(errorResult.message);
      setToast({
        open: true,
        message: `Failed to load consultants: ${errorResult.message}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultants();
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
    navigate('/consultants/new');
  };

  const handleEdit = (consultant) => {
    console.log('Edit clicked for consultant:', consultant);
    navigate(`/consultants/${consultant.consultant_id}/edit`);
  };

  const handleView = (consultant) => {
    console.log('View clicked for consultant:', consultant);
    navigate(`/consultants/${consultant.consultant_id}`);
  };

  const handleDelete = (consultant) => {
    console.log('Delete clicked for consultant:', consultant);
    setSelectedConsultant(consultant);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await consultantsApi.delete(selectedConsultant.consultant_id);
      await fetchConsultants();
      setDeleteDialogOpen(false);
      setSelectedConsultant(null);
      setToast({
        open: true,
        message: 'Consultant deleted successfully',
        severity: 'success',
      });
    } catch (err) {
      const errorResult = handleApiError(err);
      setToast({
        open: true,
        message: `Failed to delete consultant: ${errorResult.message}`,
        severity: 'error',
      });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading consultants..." />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" gutterBottom>
          Error loading consultants:
        </Typography>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Consultants"
        subtitle="Manage your consultants"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Consultants' },
        ]}
        action
        actionText="Add Consultant"
        onActionClick={handleAddNew}
      />

      <DataTable
        rows={consultants}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        getRowId={(row) => row.consultant_id}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Consultant"
        message={`Are you sure you want to delete consultant ${selectedConsultant?.consultant_name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedConsultant(null);
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