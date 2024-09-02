import { Button, Card, CardActions, CardContent, Container, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTask, updateTask } from '../api';

const TaskDetails = ({ onTaskEditComplete, showError, showSuccess }) => {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const navigate = useNavigate();

    const fetchTask = async () => {
        try {
            const response = await getTask(id);
            setTask(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTask();
    });

    const handleUpdate = async () => {
        try {
            setTask(id, { title: editTitle, description: editDescription });
            await updateTask(id, { title: editTitle, description: editDescription });
            onTaskEditComplete(task);
            setIsEditOpen(false);
            showSuccess("Task updated successfully!");
        } catch (error){
            showError("Error updating task", error);
            console.error("Error updating task", error);
        }

    };

    const handleEditOpen = () => {
        setEditTitle(task.title);
        setEditDescription(task.description);
        setIsEditOpen(true);
    };

    const handleEditClose = () => {
        setIsEditOpen(false);
    };

    const handleBackToHome = () => {
        navigate("/")
    }

    if (!task) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <>
        <Typography variant="h4" gutterBottom>
            Task Details
        </Typography>
        <Container>
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        {task.title}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                        {task.description}
                    </Typography>
                    <Typography variant="body2" color={task.completed ? "primary" : "textSecondary"}>
                        {task.completed ? "Completed" : "Pending"}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button variant="contained" color="primary" onClick={handleEditOpen}>
                        Edit
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleBackToHome}>
                        Back to Home
                    </Button>
                </CardActions>
            </Card>

            <Dialog open={isEditOpen} onClose={handleEditClose}>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        type="text"
                        fullWidth
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)} />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
        </>
    );
};

export default TaskDetails;