import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import ApplicationForm from '../../components/applications/ApplicationForm';
import Toast from '../../components/common/Toast';
import { applications as applicationsApi, handleApiError } from '../../utils/api';

export default function EditApplication() {
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

  const handleSubmit = async (formData) => {
    try {
      console.log('Submitting application update:', { id, formData });
      const updatedData = {
        ...formData,
        // Only include reason_withdrawn if status is Withdrawn
        reason_withdrawn: formData.status === 'Withdrawn' ? formData.reason_withdrawn : null,
        // Only include outcome if status is Determined
        outcome: formData.status === 'Determined' ? formData.outcome : null
      };
      console.log('Processed update data:', updatedData);
      
      await applicationsApi.update(id, updatedData);
      navigate('/applications', {
        state: { message: 'Application updated successfully' },
      });
    } catch (err) {
      console.error('Error updating application:', err);
      const errorResult = handleApiError(err);
      setToast({
        open: true,
        message: `Failed to update application: ${errorResult.message}`,
        severity: 'error',
      });
    }
  };

  const handleBack = () => {
    navigate('/applications');
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
        title="Edit Application"
        subtitle={`Application ${application.application_id}`}
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Applications', path: '/applications' },
          { label: `Edit Application ${application.application_id}` },
        ]}
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back to Applications
          </Button>
        </Box>

        <ApplicationForm
          application={application}
          onSubmit={handleSubmit}
        />
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