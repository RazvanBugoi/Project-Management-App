import { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Box, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';
import { projects as projectsApi } from '../../utils/api';

const VALID_STATUSES = ['Development', 'Determination', 'Withdrawn', 'Determined'];
const VALID_OUTCOMES = ['Permitted', 'Refused'];

const ApplicationForm = ({ application, onSubmit, readOnly }) => {
  const [formData, setFormData] = useState({
    project_code: '',
    status: 'Development',
    reason_withdrawn: '',
    outcome: ''
  });
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (application) {
      console.log('Setting form data from application:', application);
      setFormData({
        project_code: application.project_code || '',
        status: application.status || 'Development',
        reason_withdrawn: application.reason_withdrawn || '',
        outcome: application.outcome || ''
      });
    }
    fetchProjects();
  }, [application]);

  const fetchProjects = async () => {
    try {
      const projectsData = await projectsApi.getAll();
      console.log('Fetched projects:', projectsData);
      setProjectsList(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Form field changed:', { name, value });
    
    setFormData((prevData) => {
      const newData = {
        ...prevData,
        [name]: value
      };

      // Clear reason_withdrawn if status is not Withdrawn
      if (name === 'status' && value !== 'Withdrawn') {
        newData.reason_withdrawn = '';
      }

      // Clear outcome if status is not Determined
      if (name === 'status' && value !== 'Determined') {
        newData.outcome = '';
      }

      console.log('Updated form data:', newData);
      return newData;
    });

    // Clear the error for the field being changed
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.project_code) newErrors.project_code = 'Project is required';
    if (!formData.status) newErrors.status = 'Status is required';
    if (formData.status === 'Withdrawn' && !formData.reason_withdrawn) {
      newErrors.reason_withdrawn = 'Reason for withdrawal is required';
    }
    if (formData.status === 'Determined' && !formData.outcome) {
      newErrors.outcome = 'Outcome is required';
    }

    console.log('Form validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    if (validateForm()) {
      console.log('Form validation passed, calling onSubmit');
      onSubmit(formData);
    } else {
      console.log('Form validation failed');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        select
        fullWidth
        label="Project"
        name="project_code"
        value={formData.project_code}
        onChange={handleChange}
        margin="normal"
        required
        error={!!errors.project_code}
        helperText={errors.project_code}
        disabled={readOnly}
      >
        {projectsList.map((project) => (
          <MenuItem key={project.project_code} value={project.project_code}>
            {project.project_name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        fullWidth
        label="Status"
        name="status"
        value={formData.status}
        onChange={handleChange}
        margin="normal"
        required
        error={!!errors.status}
        helperText={errors.status}
        disabled={readOnly}
      >
        {VALID_STATUSES.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </TextField>

      {formData.status === 'Withdrawn' && (
        <TextField
          fullWidth
          label="Reason Withdrawn"
          name="reason_withdrawn"
          value={formData.reason_withdrawn}
          onChange={handleChange}
          margin="normal"
          required
          error={!!errors.reason_withdrawn}
          helperText={errors.reason_withdrawn}
          disabled={readOnly}
          multiline
          rows={3}
        />
      )}

      {formData.status === 'Determined' && (
        <TextField
          select
          fullWidth
          label="Outcome"
          name="outcome"
          value={formData.outcome}
          onChange={handleChange}
          margin="normal"
          required
          error={!!errors.outcome}
          helperText={errors.outcome}
          disabled={readOnly}
        >
          {VALID_OUTCOMES.map((outcome) => (
            <MenuItem key={outcome} value={outcome}>
              {outcome}
            </MenuItem>
          ))}
        </TextField>
      )}

      {!readOnly && (
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          fullWidth
        >
          {application ? 'Update Application' : 'Create Application'}
        </Button>
      )}
    </Box>
  );
};

ApplicationForm.propTypes = {
  application: PropTypes.shape({
    project_code: PropTypes.string,
    status: PropTypes.string,
    reason_withdrawn: PropTypes.string,
    outcome: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired,
  readOnly: PropTypes.bool
};

ApplicationForm.defaultProps = {
  application: null,
  readOnly: false
};

export default ApplicationForm;