import React, { useState, useEffect } from 'react';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import axios from 'axios';
import { Container, Typography, Box, Snackbar, Alert, CircularProgress } from '@mui/material';

const App = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // New state for snackbar severity
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axios.get('http://localhost/api/users/')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the users!', error);
        setSnackbarMessage('Failed to fetch users');
        setSnackbarSeverity('error'); // Set severity to error
        setSnackbarOpen(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleDelete = (userId) => {
    setLoading(true);
    axios.delete(`http://localhost/api/users/${userId}/`)
      .then(response => {
        fetchUsers();
        setSnackbarMessage('User deleted successfully');
        setSnackbarSeverity('success'); // Set severity to success
        setSnackbarOpen(true);
      })
      .catch(error => {
        console.error('There was an error deleting the user!', error);
        setSnackbarMessage('Failed to delete user');
        setSnackbarSeverity('error'); // Set severity to error
        setSnackbarOpen(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSave = (user) => {
    setLoading(true);
    
    setEditingUser(null);
    fetchUsers();
    setSnackbarMessage('User saved successfully');
    setSnackbarSeverity('success'); // Set severity to success
    setSnackbarOpen(true);
    setLoading(false);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        User Management
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 5 }}>
            <UserForm user={editingUser} onSave={handleSave} />
          </Box>
          <Box>
            <UserList users={users} onEdit={handleEdit} onDelete={handleDelete} />
          </Box>
        </>
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default App;
