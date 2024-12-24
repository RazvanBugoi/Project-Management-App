import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Toast from '../../components/common/Toast';
import { quotes as quotesApi, handleApiError } from '../../utils/api';

const QUOTE_STATUSES = ['Requested', 'Received', 'Instructed'];

export default function EditQuote() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const { id } = useParams();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    quote_status: '',
    date_quoted: '',
    quote_reference: '',
    fee_ex_vat: '',
  });

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const data = await quotesApi.getOne(id);
        setQuote(data);
        setFormData({
          quote_status: data.quote_status || '',
          date_quoted: data.date_quoted ? data.date_quoted.split('T')[0] : '',
          quote_reference: data.quote_reference || '',
          fee_ex_vat: data.fee_ex_vat ? data.fee_ex_vat.toString() : '',
        });
        setError('');
      } catch (err) {
        console.error('Error fetching quote:', err);
        const errorResult = handleApiError(err);
        setError(errorResult.message);
        setToast({
          open: true,
          message: `Failed to load quote: ${errorResult.message}`,
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const updatedData = {
        ...formData,
        fee_ex_vat: formData.fee_ex_vat ? parseFloat(formData.fee_ex_vat) : null,
      };

      await quotesApi.update(id, updatedData);
      setToast({
        open: true,
        message: 'Quote updated successfully',
        severity: 'success',
      });
      navigate('/quotes', { state: { message: 'Quote updated successfully' } });
    } catch (err) {
      console.error('Error updating quote:', err);
      const errorResult = handleApiError(err);
      setToast({
        open: true,
        message: `Failed to update quote: ${errorResult.message}`,
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/quotes');
  };

  if (loading) {
    return <LoadingSpinner message="Loading quote..." />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" gutterBottom>
          Error loading quote:
        </Typography>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  if (!quote) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Quote not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title={`Edit Quote #${quote.quote_id}`}
        subtitle="Update quote details"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Quotes', path: '/quotes' },
          { label: `Edit Quote #${quote.quote_id}` },
        ]}
      />

      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="quote_status"
                value={formData.quote_status}
                onChange={handleInputChange}
                label="Status"
                required
              >
                {QUOTE_STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date Quoted"
              type="date"
              name="date_quoted"
              value={formData.date_quoted}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Quote Reference"
              name="quote_reference"
              value={formData.quote_reference}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fee (ex VAT)"
              name="fee_ex_vat"
              type="number"
              value={formData.fee_ex_vat}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: '£',
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleBack}
          >
            Back to Quotes
          </Button>
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