import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Toast from '../../components/common/Toast';
import { quotes as quotesApi, handleApiError } from '../../utils/api';

export default function ViewQuote() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const data = await quotesApi.getOne(id);
        setQuote(data);
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

  const handleBack = () => {
    navigate('/quotes');
  };

  const handleEdit = () => {
    navigate(`/quotes/${id}/edit`);
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
        title={`Quote #${quote.quote_id}`}
        subtitle="View quote details"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Quotes', path: '/quotes' },
          { label: `Quote #${quote.quote_id}` },
        ]}
        action
        actionText="Edit Quote"
        onActionClick={handleEdit}
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Application ID
            </Typography>
            <Typography variant="body1">{quote.application_id}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <Typography variant="body1">{quote.quote_status}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Consultant
            </Typography>
            <Typography variant="body1">{quote.consultant_name}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Consultancy
            </Typography>
            <Typography variant="body1">{quote.consultancy_name}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Date Quoted
            </Typography>
            <Typography variant="body1">
              {quote.date_quoted
                ? new Date(quote.date_quoted).toLocaleDateString('en-GB')
                : 'Not quoted yet'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Quote Reference
            </Typography>
            <Typography variant="body1">
              {quote.quote_reference || 'Not available'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Fee (ex VAT)
            </Typography>
            <Typography variant="body1">
              {quote.fee_ex_vat
                ? `£${parseFloat(quote.fee_ex_vat).toFixed(2)}`
                : 'Not set'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Created At
            </Typography>
            <Typography variant="body1">
              {new Date(quote.created_at).toLocaleDateString('en-GB')}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Button
        startIcon={<ArrowBack />}
        onClick={handleBack}
        sx={{ mt: 2 }}
      >
        Back to Quotes
      </Button>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
}