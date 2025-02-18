import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import * as api from '../../services/api';

const UserDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [apps, setApps] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    onDrop: (acceptedFiles) => {
      setScreenshot(acceptedFiles[0]);
    },
  });

  useEffect(() => {
    loadDashboardData();
    loadApps();
    loadTasks();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await api.getUserDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const loadApps = async () => {
    try {
      const data = await api.getApps();
      setApps(data);
    } catch (error) {
      console.error('Error loading apps:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const data = await api.getUserTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleSubmitTask = async () => {
    try {
      await api.submitTaskCompletion(selectedApp.id, screenshot);
      setOpenDialog(false);
      setScreenshot(null);
      setSelectedApp(null);
      loadTasks();
      loadDashboardData();
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {dashboardData && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
              }}
            >
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Total Points
              </Typography>
              <Typography component="p" variant="h4">
                {dashboardData.total_points}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
              }}
            >
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Completed Tasks
              </Typography>
              <Typography component="p" variant="h4">
                {dashboardData.completed_tasks}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
              }}
            >
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Pending Tasks
              </Typography>
              <Typography component="p" variant="h4">
                {dashboardData.pending_tasks}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Available Apps
      </Typography>
      <Grid container spacing={3}>
        {apps.map((app) => (
          <Grid item xs={12} sm={6} md={4} key={app.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={app.icon}
                alt={app.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {app.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {app.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  {app.points} Points
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => {
                    setSelectedApp(app);
                    setOpenDialog(true);
                  }}
                >
                  Submit Task
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Your Tasks
      </Typography>
      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={task.screenshot}
                alt={task.app_name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {task.app_name}
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
                >
                  Status: {task.status}
                </Typography>
                {task.review_notes && (
                  <Typography variant="body2" color="text.secondary">
                    Notes: {task.review_notes}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Submit Task Completion</DialogTitle>
        <DialogContent>
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              mt: 2,
            }}
          >
            <input {...getInputProps()} />
            {screenshot ? (
              <Typography>Selected: {screenshot.name}</Typography>
            ) : (
              <Typography>
                Drag and drop a screenshot here, or click to select one
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitTask}
            disabled={!screenshot}
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserDashboard;
