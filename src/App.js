import React, { useState, useEffect } from 'react';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import axios from 'axios';
import { Container, Typography, Box, Snackbar, Alert } from '@mui/material';

const App = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('http://192.168.1.3/api/users/')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the users!', error);
      });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleDelete = (userId) => {
    axios.delete(`http://192.168.1.3/api/users/${userId}/`)
      .then(response => {
        fetchUsers();
        // Show success message
        setSnackbarMessage('User deleted successfully');
        setSnackbarOpen(true);
      })
      .catch(error => {
        console.error('There was an error deleting the user!', error);
      });
  };

  const handleSave = () => {
    setEditingUser(null);
    fetchUsers();

    // Show success message
    setSnackbarMessage('User saved successfully');
    setSnackbarOpen(true);
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
      <Box sx={{ mb: 5 }}>
        <UserForm user={editingUser} onSave={handleSave} />
      </Box>
      <Box>
        <UserList users={users} onEdit={handleEdit} onDelete={handleDelete} />
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default App;
