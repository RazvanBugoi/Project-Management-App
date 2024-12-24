import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Chip } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Toast from '../components/common/Toast';
import { tasks as tasksApi, handleApiError } from '../utils/api';

const columns = [
  {
    field: 'task_id',
    headerName: 'ID',
    width: 100,
  },
  {
    field: 'title',
    headerName: 'Title',
    width: 250,
    flex: 1,
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 300,
    flex: 1,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 150,
    renderCell: (params) => {
      const statusColors = {
        'pending': 'warning',
        'in_progress': 'info',
        'completed': 'success',
        'not_started': 'default'
      };
      const statusLabels = {
        'pending': 'Pending',
        'in_progress': 'In Progress',
        'completed': 'Completed',
        'not_started': 'Not Started'
      };
      return (
        <Chip
          label={statusLabels[params.value] || params.value}
          color={statusColors[params.value] || 'default'}
          size="small"
        />
      );
    },
  },
  {
    field: 'priority',
    headerName: 'Priority',
    width: 120,
    renderCell: (params) => {
      const priorityColors = {
        'high': 'error',
        'medium': 'warning',
        'low': 'success'
      };
      return (
        <Chip
          label={params.value.charAt(0).toUpperCase() + params.value.slice(1)}
          color={priorityColors[params.value] || 'default'}
          size="small"
        />
      );
    },
  },
  {
    field: 'due_date',
    headerName: 'Due Date',
    width: 150,
    valueGetter: (params) => {
      return params.row.due_date
        ? new Date(params.row.due_date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        : '';
    },
  },
  {
    field: 'assigned_to_name',
    headerName: 'Assigned To',
    width: 200,
    valueGetter: (params) => params.row.assigned_to_name || 'Unassigned',
  },
  {
    field: 'project_code',
    headerName: 'Project',
    width: 150,
    valueGetter: (params) => params.row.project_code || 'N/A',
  },
  {
    field: 'application_id',
    headerName: 'Application',
    width: 150,
    valueGetter: (params) => params.row.application_id ? `APP-${params.row.application_id}` : 'N/A',
  },
];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const location = useLocation();

  const fetchTasks = async () => {
    try {
      console.log('Fetching tasks...');
      const data = await tasksApi.getAll();
      console.log('Tasks API response:', data);
      
      // Ensure data is an array
      const tasksArray = Array.isArray(data) ? data : [];
      console.log('Tasks array:', tasksArray);
      
      setTasks(tasksArray);
      setError('');
    } catch (err) {
      console.error('Error fetching tasks:', err);
      const errorResult = handleApiError(err);
      setError(errorResult.message);
      setToast({
        open: true,
        message: `Failed to load tasks: ${errorResult.message}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
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
    navigate('/tasks/new');
  };

  const handleEdit = (task) => {
    console.log('Edit clicked for task:', task);
    navigate(`/tasks/${task.task_id}/edit`);
  };

  const handleView = (task) => {
    console.log('View clicked for task:', task);
    navigate(`/tasks/${task.task_id}`);
  };

  const handleDelete = (task) => {
    console.log('Delete clicked for task:', task);
    setSelectedTask(task);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await tasksApi.delete(selectedTask.task_id);
      await fetchTasks();
      setDeleteDialogOpen(false);
      setSelectedTask(null);
      setToast({
        open: true,
        message: 'Task deleted successfully',
        severity: 'success',
      });
    } catch (err) {
      const errorResult = handleApiError(err);
      setToast({
        open: true,
        message: `Failed to delete task: ${errorResult.message}`,
        severity: 'error',
      });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading tasks..." />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" gutterBottom>
          Error loading tasks:
        </Typography>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Tasks"
        subtitle="Manage your tasks"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Tasks' },
        ]}
        action
        actionText="Add Task"
        onActionClick={handleAddNew}
      />

      <DataTable
        rows={tasks}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        getRowId={(row) => row.task_id}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Task"
        message={`Are you sure you want to delete task "${selectedTask?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedTask(null);
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