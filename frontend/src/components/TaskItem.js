import React from 'react';
import { Link } from 'react-router-dom';

const TaskItem = ({ task }) => {
    return (
        <li>
            <Link to={`/tasks/${task.id}`}>{task.title}</Link>
        </li>
    );
}

export default TaskItem;