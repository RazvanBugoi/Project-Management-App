import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import ProjectForm from '../../components/projects/ProjectForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { projects as projectsApi, handleApiError } from '../../utils/api';

export default function CreateProject() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setLoading(true);
    try {
      await projectsApi.create(values);
      navigate('/projects', {
        state: { message: 'Project created successfully' },
      });
    } catch (err) {
      const errorResult = handleApiError(err);
      if (err.response?.status === 400) {
        // Handle validation errors
        setErrors(err.response.data.errors || {});
      } else {
        // Handle other errors
        setErrors({ submit: errorResult.message });
      }
      setSubmitting(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/projects');
  };

  if (loading) {
    return <LoadingSpinner message="Creating project..." />;
  }

  return (
    <Box>
      <PageHeader
        title="Create Project"
        subtitle="Add a new project to the system"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Projects', path: '/projects' },
          { label: 'Create Project' },
        ]}
      />
      <Box sx={{ mt: 4, maxWidth: 800, mx: 'auto' }}>
        <ProjectForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </Box>
    </Box>
  );
}