import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Toast from '../components/common/Toast';
import { topicAreas as topicAreasApi, handleApiError } from '../utils/api';

const columns = [
  {
    field: 'topic_area_id',
    headerName: 'ID',
    width: 100,
  },
  {
    field: 'topic_area',
    headerName: 'Topic Area',
    width: 300,
    flex: 1,
  },
  {
    field: 'created_at',
    headerName: 'Created',
    width: 200,
    valueGetter: (params) => {
      return new Date(params.row.created_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    },
  },
  {
    field: 'updated_at',
    headerName: 'Last Updated',
    width: 200,
    valueGetter: (params) => {
      return new Date(params.row.updated_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    },
  },
];

export default function TopicAreas() {
  const [topicAreas, setTopicAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTopicArea, setSelectedTopicArea] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const location = useLocation();

  const fetchTopicAreas = async () => {
    try {
      console.log('Fetching topic areas...');
      const data = await topicAreasApi.getAll();
      console.log('Topic Areas API response:', data);
      
      // Ensure data is an array
      const topicAreasArray = Array.isArray(data) ? data : [];
      console.log('Topic Areas array:', topicAreasArray);
      
      setTopicAreas(topicAreasArray);
      setError('');
    } catch (err) {
      console.error('Error fetching topic areas:', err);
      const errorResult = handleApiError(err);
      setError(errorResult.message);
      setToast({
        open: true,
        message: `Failed to load topic areas: ${errorResult.message}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopicAreas();
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
    navigate('/topic-areas/new');
  };

  const handleEdit = (topicArea) => {
    console.log('Edit clicked for topic area:', topicArea);
    navigate(`/topic-areas/${topicArea.topic_area_id}/edit`);
  };

  const handleView = (topicArea) => {
    console.log('View clicked for topic area:', topicArea);
    navigate(`/topic-areas/${topicArea.topic_area_id}`);
  };

  const handleDelete = (topicArea) => {
    console.log('Delete clicked for topic area:', topicArea);
    setSelectedTopicArea(topicArea);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await topicAreasApi.delete(selectedTopicArea.topic_area_id);
      await fetchTopicAreas();
      setDeleteDialogOpen(false);
      setSelectedTopicArea(null);
      setToast({
        open: true,
        message: 'Topic Area deleted successfully',
        severity: 'success',
      });
    } catch (err) {
      const errorResult = handleApiError(err);
      setToast({
        open: true,
        message: `Failed to delete topic area: ${errorResult.message}`,
        severity: 'error',
      });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading topic areas..." />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" gutterBottom>
          Error loading topic areas:
        </Typography>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Topic Areas"
        subtitle="Manage your topic areas"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Topic Areas' },
        ]}
        action
        actionText="Add Topic Area"
        onActionClick={handleAddNew}
      />

      <DataTable
        rows={topicAreas}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        getRowId={(row) => row.topic_area_id}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Topic Area"
        message={`Are you sure you want to delete topic area "${selectedTopicArea?.topic_area}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedTopicArea(null);
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