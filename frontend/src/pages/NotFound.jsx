import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Error as ErrorIcon } from '@mui/icons-material';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        p: 3,
      }}
    >
      <ErrorIcon
        sx={{
          fontSize: 100,
          color: 'error.main',
          mb: 2,
        }}
      />
      <Typography variant="h2" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        Page Not Found
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{ minWidth: 120 }}
        >
          Go Home
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{ minWidth: 120 }}
        >
          Go Back
        </Button>
      </Box>
    </Box>
  );
}