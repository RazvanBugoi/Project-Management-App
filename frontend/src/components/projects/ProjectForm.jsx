import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Grid,
  FormControlLabel,
  Switch,
} from '@mui/material';
import FormTextField from '../common/FormTextField';

const validationSchema = Yup.object({
  project_code: Yup.string()
    .required('Project code is required')
    .matches(/^[A-Z0-9]{4}$/, 'Project code must be 4 uppercase letters or numbers'),
  project_name: Yup.string()
    .required('Project name is required')
    .min(3, 'Project name must be at least 3 characters')
    .max(100, 'Project name must be at most 100 characters'),
  description: Yup.string()
    .max(500, 'Description must be at most 500 characters'),
  archived: Yup.boolean(),
});

export default function ProjectForm({
  initialValues,
  onSubmit,
  onCancel,
  isEdit,
  loading,
}) {
  const defaultValues = {
    project_code: '',
    project_name: '',
    description: '',
    archived: false,
    ...initialValues,
  };

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormTextField
                name="project_code"
                label="Project Code"
                disabled={isEdit}
                helperText={
                  !isEdit
                    ? 'Enter 4 uppercase letters or numbers'
                    : 'Project code cannot be changed'
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormTextField
                name="project_name"
                label="Project Name"
                helperText="Enter a unique project name"
              />
            </Grid>
            <Grid item xs={12}>
              <FormTextField
                name="description"
                label="Description"
                multiline
                rows={4}
                helperText="Optional: Provide a brief description of the project"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={values.archived}
                    onChange={(e) => setFieldValue('archived', e.target.checked)}
                    color="primary"
                  />
                }
                label="Archive Project"
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={onCancel}
                  disabled={isSubmitting || loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || loading}
                >
                  {isEdit ? 'Update Project' : 'Create Project'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}

ProjectForm.propTypes = {
  initialValues: PropTypes.shape({
    project_code: PropTypes.string,
    project_name: PropTypes.string,
    description: PropTypes.string,
    archived: PropTypes.bool,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  loading: PropTypes.bool,
};

ProjectForm.defaultProps = {
  initialValues: null,
  isEdit: false,
  loading: false,
};