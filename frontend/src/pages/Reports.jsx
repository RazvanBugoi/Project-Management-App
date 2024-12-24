import { useState } from 'react';
import { Button, Grid, Typography, Card, CardContent, CardActions } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import { reports as reportsApi, handleApiError } from '../utils/api';

const Reports = () => {
  const [loading, setLoading] = useState({
    applications: false,
    consultants: false,
    tasks: false
  });

  const [error, setError] = useState({
    applications: '',
    consultants: '',
    tasks: ''
  });

  const handleDownload = async (reportType) => {
    setLoading(prev => ({ ...prev, [reportType]: true }));
    setError(prev => ({ ...prev, [reportType]: '' }));

    try {
      let data;
      switch (reportType) {
        case 'applications':
          data = await reportsApi.getApplications();
          break;
        case 'consultants':
          data = await reportsApi.getConsultants();
          break;
        case 'tasks':
          data = await reportsApi.getTasks();
          break;
        default:
          throw new Error('Invalid report type');
      }

      // Convert data to CSV
      const csvContent = convertToCSV(data);
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${reportType}_report.csv`;
      link.click();
    } catch (err) {
      console.error(`Error downloading ${reportType} report:`, err);
      const errorResult = handleApiError(err);
      setError(prev => ({
        ...prev,
        [reportType]: errorResult.message
      }));
    } finally {
      setLoading(prev => ({ ...prev, [reportType]: false }));
    }
  };

  const convertToCSV = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return '';
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        // Handle null, undefined, and quotes in strings
        if (value == null) return '';
        if (typeof value === 'string') {
          // Escape quotes and wrap in quotes
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  };

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Download reports and analytics"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Reports' },
        ]}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Applications Report
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Download a report of all applications and their current status.
              </Typography>
              {error.applications && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error.applications}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => handleDownload('applications')}
                disabled={loading.applications}
              >
                {loading.applications ? 'Downloading...' : 'Download'}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Consultants Report
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Download a report of all consultants and their assignments.
              </Typography>
              {error.consultants && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error.consultants}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => handleDownload('consultants')}
                disabled={loading.consultants}
              >
                {loading.consultants ? 'Downloading...' : 'Download'}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tasks Report
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Download a report of all tasks and their completion status.
              </Typography>
              {error.tasks && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error.tasks}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => handleDownload('tasks')}
                disabled={loading.tasks}
              >
                {loading.tasks ? 'Downloading...' : 'Download'}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Reports;