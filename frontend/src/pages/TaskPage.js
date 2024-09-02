import React from 'react';
import TaskDetails from '../components/TaskDetails';

const TaskPage = ({ onTaskEditComplete, showError, showSuccess }) => {
    return (
        <TaskDetails onTaskEditComplete={onTaskEditComplete}
                     showError={showError}
                     showSuccess={showSuccess}/>
    );
};

export default TaskPage;