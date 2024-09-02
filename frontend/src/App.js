import { React, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { getTasks } from './api';
import './App.css';
import Alert from './components/Alert';
import HomePage from './pages/HomePage';
import TaskPage from './pages/TaskPage';


const App = () => {
  const [tasks, setTasks] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const [initialFetchCompleted, setInitialFetchCompleted] = useState(false);
  const prevTasksRef = useRef([]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
      setInitialFetchCompleted(true);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    // Cleanup function to reset the ref when the component unmounts
    return () => {
      prevTasksRef.current = [];
    };
  }, []);

  useLayoutEffect(() => {
    if (!initialFetchCompleted) return;

    const prevTasks = prevTasksRef.current;
    if (prevTasks.length < tasks.length) {
      showSuccess("Task created successfully!");
    } else if (prevTasks.length > tasks.length) {
      showSuccess("Task deleted successfully!");
    } else {
      const prevTaskIds = prevTasks.map(task => task.id);
      for (let i = 0; i < tasks.length; i++) {
        if (prevTaskIds.includes(tasks[i].id) && tasks[i].completed && !prevTasks[i].completed) {
          showSuccess("Task marked as complete!");
          break;
        }
      }
    }
    prevTasksRef.current = tasks;
  }, [tasks, initialFetchCompleted]);

  const onTaskCreated = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const onTaskDeleted = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  }

  const onTaskCompleteToggled = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return { ...task, done: !task.done };
      }
      return task;
    }));
  }

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  }

  const onTaskEditComplete = (updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id 
        ? { ...task, title: updatedTask.title, description: updatedTask.description } 
        : task
    ));
  }
  
  const showError = (message, error) => {
    console.error(message, error);
    setAlert({ open: true, message: message, severity: "error" });
  }

  const showSuccess = (message) => {
    setAlert({ open: true, message: message, severity: "success" });
  }


  return (
    <Router>
      <Routes>
        <Route path="/tasks/:id" element={<TaskPage onTaskEditComplete={onTaskEditComplete}
                                                    showError={showError}
                                                    showSuccess={showSuccess}/>} />
        <Route path="/" element={<HomePage 
                                  tasks={tasks} 
                                  fetchTasks={fetchTasks}
                                  onTaskCreated={onTaskCreated} 
                                  onTaskDeleted={onTaskDeleted}
                                  onTaskCompleteToggled={onTaskCompleteToggled}
                                  showError={showError}/>} />
      </Routes>
      <Alert open={alert.open} message={alert.message} severity={alert.severity} onClose={handleCloseAlert} />
    </Router>
  );
}

export default App;
