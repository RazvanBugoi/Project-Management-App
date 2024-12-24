import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { useField } from 'formik';

export default function FormTextField({ name, ...props }) {
  const [field, meta] = useField(name);

  return (
    <TextField
      {...field}
      {...props}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
      fullWidth
      margin="normal"
    />
  );
}

FormTextField.propTypes = {
  name: PropTypes.string.isRequired,
};