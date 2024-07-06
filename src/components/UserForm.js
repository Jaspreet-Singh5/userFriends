import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Box, TextField, Button, Typography, Container } from '@mui/material';

const UserForm = ({ user, onSave }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    } else {
      setUsername('');
      setEmail('');
    }
  }, [user]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const userData = { username, email };

    if (user) {
      axios.put(`http://192.168.1.3:8000/api/users/${user.id}/`, userData)
        .then(response => {
          onSave();
        })
        .catch(error => {
          console.error('There was an error updating the user!', error);
        });
    } else {
      axios.post('http://192.168.1.3:8000/api/users/', userData)
        .then(response => {
          onSave();
        })
        .catch(error => {
          console.error('There was an error creating the user!', error);
        });
    }
  };

  const handleReset = () => {
    setUsername('');
    setEmail('');
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {user ? 'Edit User' : 'Add User'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Save
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 1, mb: 2 }}
            onClick={handleReset}
          >
            Reset
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UserForm;
