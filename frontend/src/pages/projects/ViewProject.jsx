import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { projects as projectsApi, handleApiError } from '../../utils/api';

function InfoRow({ label, value }) {
  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} sm={3}>
        <Typography color="text.secondary" fontWeight={500}>
          {label}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={9}>
        <Typography>{value || '-'}</Typography>
      </Grid>
    </Grid>
  );
}

InfoRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

InfoRow.defaultProps = {
  value: '',
};

export default function ViewProject() {
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

  const handleEdit = () => {
    navigate(`/projects/${projectCode}/edit`);
  };

  const handleBack = () => {
    navigate('/projects');
  };

  if (loading) {
    return <LoadingSpinner message="Loading project details..." />;
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
        title="Project Details"
        subtitle={`View details for project ${project.project_code}`}
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Projects', path: '/projects' },
          { label: 'View Project' },
        ]}
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" component="h2">
              {project.project_name}
            </Typography>
            <Chip
              label={project.archived ? 'Archived' : 'Active'}
              color={project.archived ? 'error' : 'success'}
              size="small"
              sx={{ ml: 2 }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
            >
              Back to Projects
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
            >
              Edit Project
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box>
          <InfoRow label="Project Code" value={project.project_code} />
          <InfoRow label="Project Name" value={project.project_name} />
          <InfoRow label="Description" value={project.description} />
          <InfoRow
            label="Status"
            value={project.archived ? 'Archived' : 'Active'}
          />
          <InfoRow
            label="Created At"
            value={new Date(project.created_at).toLocaleString()}
          />
          <InfoRow
            label="Last Updated"
            value={new Date(project.updated_at).toLocaleString()}
          />
        </Box>
      </Paper>

      {/* Additional sections for related data can be added here */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Related Information
        </Typography>
        <Typography color="text.secondary">
          Additional project information and related data will be displayed here.
        </Typography>
      </Paper>
    </Box>
  );
}