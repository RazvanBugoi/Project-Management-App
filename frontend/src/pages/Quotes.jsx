import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Toast from '../components/common/Toast';
import { quotes as quotesApi, handleApiError } from '../utils/api';

const columns = [
  {
    field: 'quote_id',
    headerName: 'ID',
    width: 70,
  },
  {
    field: 'application_id',
    headerName: 'Application ID',
    width: 120,
  },
  {
    field: 'consultant_name',
    headerName: 'Consultant',
    width: 200,
    flex: 1,
  },
  {
    field: 'quote_status',
    headerName: 'Status',
    width: 120,
  },
  {
    field: 'date_quoted',
    headerName: 'Date Quoted',
    width: 120,
    valueGetter: (params) => {
      return params.row.date_quoted
        ? new Date(params.row.date_quoted).toLocaleDateString('en-GB')
        : '';
    },
  },
  {
    field: 'quote_reference',
    headerName: 'Reference',
    width: 150,
  },
  {
    field: 'fee_ex_vat',
    headerName: 'Fee (ex VAT)',
    width: 130,
    valueGetter: (params) => {
      return params.row.fee_ex_vat
        ? `£${parseFloat(params.row.fee_ex_vat).toFixed(2)}`
        : '';
    },
  },
  {
    field: 'created_at',
    headerName: 'Created',
    width: 120,
    valueGetter: (params) => {
      return new Date(params.row.created_at).toLocaleDateString('en-GB');
    },
  },
];

export default function Quotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const location = useLocation();

  const fetchQuotes = async () => {
    try {
      const data = await quotesApi.getAll();
      setQuotes(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Error fetching quotes:', err);
      const errorResult = handleApiError(err);
      setError(errorResult.message);
      setToast({
        open: true,
        message: `Failed to load quotes: ${errorResult.message}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      setToast({
        open: true,
        message: location.state.message,
        severity: 'success',
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleAddNew = () => {
    navigate('/quotes/new');
  };

  const handleEdit = (quote) => {
    navigate(`/quotes/${quote.quote_id}/edit`);
  };

  const handleView = (quote) => {
    navigate(`/quotes/${quote.quote_id}`);
  };

  const handleDelete = (quote) => {
    setSelectedQuote(quote);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await quotesApi.delete(selectedQuote.quote_id);
      await fetchQuotes();
      setDeleteDialogOpen(false);
      setSelectedQuote(null);
      setToast({
        open: true,
        message: 'Quote deleted successfully',
        severity: 'success',
      });
    } catch (err) {
      const errorResult = handleApiError(err);
      setToast({
        open: true,
        message: `Failed to delete quote: ${errorResult.message}`,
        severity: 'error',
      });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading quotes..." />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" gutterBottom>
          Error loading quotes:
        </Typography>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Quotes"
        subtitle="Manage your quotes"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Quotes' },
        ]}
        action
        actionText="Add Quote"
        onActionClick={handleAddNew}
      />

      <DataTable
        rows={quotes}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        getRowId={(row) => row.quote_id}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Quote"
        message={`Are you sure you want to delete quote #${selectedQuote?.quote_id}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedQuote(null);
        }}
        confirmColor="error"
      />

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
}