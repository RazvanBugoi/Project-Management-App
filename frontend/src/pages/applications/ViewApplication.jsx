import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';
import { applications as applicationsApi, handleApiError } from '../../utils/api';

export default function ViewApplication() {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        console.log('Fetching application:', id);
        const data = await applicationsApi.getOne(id);
        console.log('Application data:', data);
        setApplication(data);
      } catch (err) {
        console.error('Error fetching application:', err);
        const errorResult = handleApiError(err);
        setToast({
          open: true,
          message: `Failed to load application: ${errorResult.message}`,
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleBack = () => {
    navigate('/applications');
  };

  const handleEdit = () => {
    navigate(`/applications/${id}/edit`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!application) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Application not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="View Application"
        subtitle={`Application ${application.application_id}`}
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Applications', path: '/applications' },
          { label: `Application ${application.application_id}` },
        ]}
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back to Applications
          </Button>
          <Button
            variant="contained"
            onClick={handleEdit}
          >
            Edit Application
          </Button>
        </Box>

        <Typography variant="h6" gutterBottom>
          Details
        </Typography>

        <Box sx={{ display: 'grid', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Project Code
            </Typography>
            <Typography>{application.project_code}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Project Name
            </Typography>
            <Typography>{application.project_name}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <Typography>{application.status}</Typography>
          </Box>

          {application.status === 'Withdrawn' && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Reason Withdrawn
              </Typography>
              <Typography>{application.reason_withdrawn || 'N/A'}</Typography>
            </Box>
          )}

          {application.status === 'Determined' && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Outcome
              </Typography>
              <Typography>{application.outcome || 'N/A'}</Typography>
            </Box>
          )}

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Created At
            </Typography>
            <Typography>
              {new Date(application.created_at).toLocaleString()}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Updated At
            </Typography>
            <Typography>
              {new Date(application.updated_at).toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
}