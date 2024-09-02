import { ArrowDownward, ArrowUpward, CheckCircle, Delete, Edit } from '@mui/icons-material';
import { Button, ButtonGroup, IconButton, List, ListItem, ListItemText, Tooltip, Typography } from '@mui/material';
import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { completeTask, deleteTask } from '../api';

const TaskList = ({tasks, onTaskDeleted, onTaskCompleteToggled}) => {
    const navigate = useNavigate();
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortCriteria, setSortCriteria] = useState('title');


    const toggleSortOrder = () => {
        setSortOrder(prevOrder => (prevOrder === "asc" ? "desc" : "asc"));
    }

    const setCriteria = (criteria) => {
        setSortCriteria(criteria);
    }

    const sortedTasks = [...tasks].sort((a, b) => {
        if (sortCriteria === "title") {
            return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        } else if (sortCriteria === "description") {
            return sortOrder === "asc" ? a.description.localeCompare(b.description) : b.description.localeCompare(a.description);
        } else if (sortCriteria === "done") {
            return sortOrder === "asc" ? a.done - b.done : b.done - a.done;
        }
        return 0;
    });

    const handleDelete = async (id) => {
        try {
            await deleteTask(id);
            onTaskDeleted(id);
        } catch (error) {
            console.error("Error deleting task", error);
        }
    };

    const handleToggleComplete = async (id) => {
        try {
            const task = tasks.find(task => task.id === id);
            if (task) {
                await completeTask(id, !task.done);
                onTaskCompleteToggled(id);    
            }
        } catch (error) {
            console.error("Error completing task", error);
        }
    };

    const handleItemClick = (id) => {
        navigate(`/tasks/${id}`);
    }

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Task List
            </Typography>
            <Typography variant="h6" gutterBottom>
                Sort Tasks By
            </Typography>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button onClick={() => setCriteria('title')}
                        color={sortCriteria === 'title' ? 'primary' : 'default'}
                >
                    Title
                </Button>
                <Button onClick={() => setCriteria('description')}
                        color={sortCriteria === 'description' ? 'primary' : 'default'}
                >
                    Description
                </Button>
                <Button onClick={() => setCriteria('done')}
                        color={sortCriteria === 'done' ? 'primary' : 'default'}
                >
                    Done
                </Button>
                <Tooltip title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}>
                    <Button onClick={toggleSortOrder}>
                        {sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
                    </Button>
                </Tooltip>
            </ButtonGroup>
            {sortedTasks.length === 0 ? (
                <Typography variant="body1" color="textSecondary">
                    No task added yet!
                </Typography>
            ) : (
                <List>
                    {sortedTasks.map(task => 
                        <ListItem key={task.id} secondaryAction={
                            <>
                            <IconButton edge="end" aria-label="complete" onClick={() => handleToggleComplete(task.id)}>
                                <CheckCircle color={task.done ? "primary" : "disabled"} />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(task.id)}>
                                <Delete />
                            </IconButton>
                            <IconButton edge="end" aria-label="edit" onClick={() => handleItemClick(task.id)}>
                                <Edit />
                            </IconButton>
                            </>
                        } 
                        sx={{
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                            },
                        }}>
                        <ListItemText primary={task.title} secondary={task.done ? "Completed" : "Pending"} />
                        </ListItem>
                    )}
                </List>
            )}
        </>
    );
}

export default TaskList;