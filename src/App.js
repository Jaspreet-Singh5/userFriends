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
  const [loading, setLoading] = useState(false); // New loading state

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true); // Start loading
    axios.get('http://192.168.1.3/api/users/')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the users!', error);
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleDelete = (userId) => {
    setLoading(true); // Start loading
    axios.delete(`http://192.168.1.3/api/users/${userId}/`)
      .then(response => {
        fetchUsers();
        setSnackbarMessage('User deleted successfully');
        setSnackbarOpen(true);
      })
      .catch(error => {
        console.error('There was an error deleting the user!', error);
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  };

  const handleSave = (user) => {
    setLoading(true); // Start loading
    
    setEditingUser(null);
    fetchUsers();
    setSnackbarMessage('User saved successfully');
    setSnackbarOpen(true);
    setLoading(false); // Stop loading
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
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default App;
