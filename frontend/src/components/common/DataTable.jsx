import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

export default function DataTable({
  rows,
  columns,
  title,
  loading,
  onEdit,
  onDelete,
  onView,
  disableActions,
  getRowId
}) {
  const [pageSize, setPageSize] = useState(10);

  const baseColumns = [...columns];

  if (!disableActions) {
    baseColumns.push({
      field: 'actions',
      headerName: 'Actions',
      width: 300,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        return (
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            {onView && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<ViewIcon />}
                onClick={() => onView(params.row)}
              >
                View
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => onEdit(params.row)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => onDelete(params.row)}
              >
                Delete
              </Button>
            )}
          </Box>
        );
      }
    });
  }

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      {title && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
      )}
      <DataGrid
        rows={rows}
        columns={baseColumns}
        pageSize={pageSize}
        getRowId={getRowId}
        onPageSizeChange={setPageSize}
        rowsPerPageOptions={[5, 10, 25, 50]}
        autoHeight
        loading={loading}
        disableSelectionOnClick
        disableColumnMenu
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        disableMultipleSelection
        hideFooterSelectedRowCount
        components={{}}
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'action.hover'
          },
          '& .MuiDataGrid-cell:focus': {
            outline: 'none'
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'action.hover'
          }
        }}
      />
    </Paper>
  );
}

DataTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
      width: PropTypes.number,
      flex: PropTypes.number,
      renderCell: PropTypes.func
    })
  ).isRequired,
  title: PropTypes.string,
  loading: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
  disableActions: PropTypes.bool,
  getRowId: PropTypes.func
};

DataTable.defaultProps = {
  title: '',
  loading: false,
  onEdit: null,
  onDelete: null,
  onView: null,
  disableActions: false,
  getRowId: (row) => row.id
};