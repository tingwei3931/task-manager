// src/components/Alert.js
import { Alert as MuiAlert, Snackbar } from '@mui/material';
import React from 'react';

const Alert = ({ open, message, severity, onClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <MuiAlert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default Alert;