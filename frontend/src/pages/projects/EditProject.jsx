import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import ProjectForm from '../../components/projects/ProjectForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { projects as projectsApi, handleApiError } from '../../utils/api';

export default function EditProject() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { projectCode } = useParams();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        console.log('Fetching project:', projectCode);
        const data = await projectsApi.getOne(projectCode);
        console.log('Project data:', data);
        setProject(data);
        setError('');
      } catch (err) {
        console.error('Error fetching project:', err);
        const errorResult = handleApiError(err);
        setError(errorResult.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectCode]);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setLoading(true);
    try {
      console.log('Updating project:', projectCode, values);
      await projectsApi.update(projectCode, values);
      navigate('/projects', {
        state: { message: 'Project updated successfully' },
      });
    } catch (err) {
      console.error('Error updating project:', err);
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
    return <LoadingSpinner message="Loading project..." />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" gutterBottom>
          Error loading project:
        </Typography>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Project not found.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Edit Project"
        subtitle={`Edit project ${project.project_code}`}
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Projects', path: '/projects' },
          { label: 'Edit Project' },
        ]}
      />
      <Box sx={{ mt: 4, maxWidth: 800, mx: 'auto' }}>
        <ProjectForm
          initialValues={project}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEdit
          loading={loading}
        />
      </Box>
    </Box>
  );
}