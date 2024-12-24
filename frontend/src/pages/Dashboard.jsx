import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  Description as ProjectIcon,
  Assignment as ApplicationIcon,
  Task as TaskIcon,
  Person as ConsultantIcon
} from '@mui/icons-material';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PageHeader from '../components/common/PageHeader';
import { projects, applications, tasks, consultants, handleApiError } from '../utils/api';

function StatCard({ title, value, icon, isLoading }) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" component="div" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        {isLoading ? (
          <LoadingSpinner size={20} />
        ) : (
          <Typography variant="h4" component="div">
            {value}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    applications: 0,
    tasks: 0,
    consultants: 0
  });

  const [loading, setLoading] = useState({
    projects: true,
    applications: true,
    tasks: true,
    consultants: true
  });

  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch projects count
        const projectsData = await projects.getAll();
        setStats(prev => ({ ...prev, projects: projectsData.length }));
        setLoading(prev => ({ ...prev, projects: false }));

        // Fetch applications count
        const applicationsData = await applications.getAll();
        setStats(prev => ({ ...prev, applications: applicationsData.length }));
        setLoading(prev => ({ ...prev, applications: false }));

        // Fetch tasks count
        const tasksData = await tasks.getAll();
        setStats(prev => ({ ...prev, tasks: tasksData.length }));
        setLoading(prev => ({ ...prev, tasks: false }));

        // Fetch consultants count
        const consultantsData = await consultants.getAll();
        setStats(prev => ({ ...prev, consultants: consultantsData.length }));
        setLoading(prev => ({ ...prev, consultants: false }));

      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        const errorResult = handleApiError(err);
        setError(errorResult.message);
      }
    };

    fetchStats();
  }, []);

  if (error) {
    return (
      <Typography color="error" sx={{ mt: 2 }}>
        Error loading dashboard: {error}
      </Typography>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your project management system"
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Projects"
            value={stats.projects}
            icon={<ProjectIcon color="primary" />}
            isLoading={loading.projects}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Applications"
            value={stats.applications}
            icon={<ApplicationIcon color="primary" />}
            isLoading={loading.applications}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tasks"
            value={stats.tasks}
            icon={<TaskIcon color="primary" />}
            isLoading={loading.tasks}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Consultants"
            value={stats.consultants}
            icon={<ConsultantIcon color="primary" />}
            isLoading={loading.consultants}
          />
        </Grid>
      </Grid>
    </div>
  );
}