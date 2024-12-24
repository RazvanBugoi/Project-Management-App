import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Button,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Add as AddIcon } from '@mui/icons-material';

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  action,
  actionText,
  onActionClick
}) {
  return (
    <Box sx={{ mb: 4 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs sx={{ mb: 2 }}>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return isLast ? (
              <Typography color="text.primary" key={crumb.path || index}>
                {crumb.label}
              </Typography>
            ) : (
              <MuiLink
                component={RouterLink}
                to={crumb.path}
                key={crumb.path}
                color="inherit"
                underline="hover"
              >
                {crumb.label}
              </MuiLink>
            );
          })}
        </Breadcrumbs>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="subtitle1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && onActionClick && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onActionClick}
          >
            {actionText || 'Add New'}
          </Button>
        )}
      </Box>
    </Box>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string
    })
  ),
  action: PropTypes.bool,
  actionText: PropTypes.string,
  onActionClick: PropTypes.func
};

PageHeader.defaultProps = {
  subtitle: '',
  breadcrumbs: [],
  action: false,
  actionText: 'Add New',
  onActionClick: null
};