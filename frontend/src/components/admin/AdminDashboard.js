import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useDropzone } from 'react-dropzone';
import * as api from '../../services/api';

const AdminDashboard = () => {
  const [apps, setApps] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newApp, setNewApp] = useState({
    name: '',
    package_name: '',
    description: '',
    points: '',
  });
  const [icon, setIcon] = useState(null);

  const onDrop = (acceptedFiles) => {
    setIcon(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
  });

  const loadApps = async () => {
    try {
      const response = await api.adminGetApps();
      setApps(response.data || []);
      setError(null);
    } catch (error) {
      console.error('Error loading apps:', error);
      setError('Failed to load apps. Please try again later.');
      setApps([]);
    }
  };

  const loadTasks = async () => {
    try {
      const response = await api.adminGetTasks();
      setTasks(response.data || []);
      setError(null);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setError('Failed to load tasks. Please try again later.');
      setTasks([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([loadApps(), loadTasks()]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCreateApp = async () => {
    try {
      // Validate required fields
      if (!newApp.name || !newApp.package_name || !newApp.points || !icon) {
        setError('Please fill in all required fields and upload an app icon');
        return;
      }

      const formData = new FormData();
      formData.append('name', newApp.name);
      formData.append('package_name', newApp.package_name);
      formData.append('description', newApp.description || '');
      formData.append('points', parseInt(newApp.points));
      formData.append('icon', icon);

      await api.adminCreateApp(formData);
      
      // Reset form and close dialog
      setOpenDialog(false);
      setNewApp({
        name: '',
        package_name: '',
        description: '',
        points: '',
      });
      setIcon(null);
      setError(null);
      
      // Reload apps list
      await loadApps();
    } catch (error) {
      console.error('Error creating app:', error);
      setError(error.response?.data?.detail || 'Failed to create app. Please try again.');
    }
  };

  const handleReviewTask = async (taskId, status) => {
    try {
      await api.adminReviewTask(taskId, status);
      loadTasks();
    } catch (error) {
      console.error('Error reviewing task:', error);
      setError('Failed to review task. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          size="large"
        >
          Add New App
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Apps Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Manage Android Apps
            </Typography>
            <Grid container spacing={3}>
              {apps.length === 0 ? (
                <Grid item xs={12}>
                  <Typography variant="body1" color="text.secondary" align="center">
                    No apps available. Add your first app using the button above.
                  </Typography>
                </Grid>
              ) : (
                apps.map((app) => (
                  <Grid item xs={12} sm={6} md={4} key={app.id}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="140"
                        image={app.icon}
                        alt={app.name}
                        sx={{ objectFit: 'contain', bgcolor: 'grey.100', p: 1 }}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          {app.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Package: {app.package_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {app.description}
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {app.points} Points
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Tasks Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Review Task Submissions
            </Typography>
            <Grid container spacing={3}>
              {tasks.length === 0 ? (
                <Grid item xs={12}>
                  <Typography variant="body1" color="text.secondary" align="center">
                    No tasks submitted for review yet.
                  </Typography>
                </Grid>
              ) : (
                tasks.map((task) => (
                  <Grid item xs={12} sm={6} md={4} key={task.id}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="200"
                        image={task.screenshot}
                        alt={task.app_name}
                        sx={{ objectFit: 'contain' }}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          {task.app_name}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Submitted by: {task.username}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Points: {task.points}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color={
                            task.status === 'approved'
                              ? 'success.main'
                              : task.status === 'rejected'
                              ? 'error.main'
                              : 'warning.main'
                          }
                          gutterBottom
                        >
                          Status: {task.status}
                        </Typography>
                        {task.status === 'pending' && (
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Button
                              variant="contained"
                              color="success"
                              startIcon={<CheckIcon />}
                              onClick={() => handleReviewTask(task.id, 'approved')}
                              fullWidth
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              startIcon={<CloseIcon />}
                              onClick={() => handleReviewTask(task.id, 'rejected')}
                              fullWidth
                            >
                              Reject
                            </Button>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Add New App Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Android App</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            label="App Name"
            fullWidth
            margin="normal"
            value={newApp.name}
            onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
            required
            error={!newApp.name}
            helperText={!newApp.name ? "App name is required" : ""}
          />
          <TextField
            label="Package Name"
            fullWidth
            margin="normal"
            value={newApp.package_name}
            onChange={(e) => setNewApp({ ...newApp, package_name: e.target.value })}
            required
            error={!newApp.package_name}
            helperText={!newApp.package_name ? "Package name is required" : "e.g., com.example.app"}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={newApp.description}
            onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
          />
          <TextField
            label="Points"
            fullWidth
            margin="normal"
            type="number"
            value={newApp.points}
            onChange={(e) => setNewApp({ ...newApp, points: e.target.value })}
            required
            error={!newApp.points}
            helperText={!newApp.points ? "Points value is required" : ""}
            InputProps={{ inputProps: { min: 1 } }}
          />
          <Box
            {...getRootProps()}
            sx={{
              mt: 2,
              p: 2,
              border: `2px dashed ${!icon ? '#ff0000' : '#ccc'}`,
              borderRadius: 1,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: 'grey.50',
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
          >
            <input {...getInputProps()} />
            <Typography color={!icon ? 'error' : 'inherit'}>
              {icon ? `Selected: ${icon.name}` : 'App icon is required (drag & drop or click to select)'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenDialog(false);
            setError(null);
            setNewApp({
              name: '',
              package_name: '',
              description: '',
              points: '',
            });
            setIcon(null);
          }}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateApp}
            variant="contained"
            color="primary"
            disabled={!newApp.name || !newApp.package_name || !newApp.points || !icon}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
