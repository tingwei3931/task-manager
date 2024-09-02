import { Container, Grid, Typography } from '@mui/material';
import { React, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';


const HomePage = ({ tasks, onTaskCreated, onTaskDeleted, onTaskCompleteToggled, showError, fetchTasks }) => {
    const location = useLocation();

    useEffect(() => {
        fetchTasks();
        console.log('Location changed!', location.pathname);
    }, [location, fetchTasks]);

    return (
        <Container>
          <Typography variant="h2" align="center" gutterBottom>
            Task Manager Application
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TaskForm onTaskCreated={onTaskCreated} 
                        showError={showError}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TaskList tasks={tasks} 
                        onTaskDeleted={onTaskDeleted} 
                        onTaskCompleteToggled={onTaskCompleteToggled}
                        showError={showError}/>
            </Grid>
          </Grid>
        </Container>
      );
}

export default HomePage;