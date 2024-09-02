import { Box, Button, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { createTask } from '../api';

const TaskForm = ({ onTaskCreated, showError }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createTask({ title, description });
            if (response && response.status >= 200 && response.status < 300 && response.data) {
                onTaskCreated(response.data);
                clearForm();
              } else {
                showError('Invalid response from createTask API', response);
              }
        } catch (error) {
            showError('Error creating task', error);
        }
    };

    const clearForm = () => {
        setTitle('');
        setDescription('');
    }

    return (
        <>
        <Typography variant="h4" gutterBottom>
            Add Task
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
                label="Task Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required />
            <TextField
                label="Task Description"
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required />
            <Button type="submit" variant="contained" color="primary">
                Add Task
            </Button>
        </Box>
        </>
    );
};

export default TaskForm;