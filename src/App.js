import React, { useState, useEffect } from 'react';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import axios from 'axios';

import { Container, Typography, Box } from '@mui/material';

const App = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

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
      })
      .catch(error => {
        console.error('There was an error deleting the user!', error);
      });
  };

  const handleSave = () => {
    setEditingUser(null);
    fetchUsers();
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
    </Container>
  );
};

export default App;
