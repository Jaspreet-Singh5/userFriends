import React, { useState } from 'react';
import { Typography, List, ListItem, ListItemText, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group'; // Icon for viewing friends
import { ListItemAvatar, Avatar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    padding: theme.spacing(2),
  }));
  
  const StyledList = styled(List)({
    width: '100%',
  });
  
  const StyledListItem = styled(ListItem)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,

    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  }));
  
  const StyledAvatar = styled(Avatar)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
  }));

const UserList = ({ users, onEdit, onDelete }) => {
    const [open, setOpen] = useState(false);
    const [friendsInfo, setFriendsInfo] = useState([]);

    const handleViewFriends = async (userId) => {
        const response = await fetch(`http://192.168.1.3/api/users/${userId}/friends/`);
        const friends = await response.json();
        // Map the friend IDs to user objects
        const friendsDetails = friends.map(friend => users.find(user => user.id === friend.friend)).filter(Boolean);
        setFriendsInfo(friendsDetails);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
          <Typography variant="h4" gutterBottom>
            User List
          </Typography>
          <List>
            {users.map(user => (
              <StyledListItem
                key={user.id}
                secondaryAction={
                  <>
                    <IconButton edge="end" aria-label="edit" onClick={() => onEdit(user)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => onDelete(user.id)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="view-friends" onClick={() => handleViewFriends(user.id)}>
                      <GroupIcon />
                    </IconButton>
                  </>
                }
              >
                
                <ListItemAvatar>
                    <StyledAvatar>
                        <AccountCircleIcon />
                    </StyledAvatar>
                </ListItemAvatar>
                <ListItemText primary={user.username} secondary={user.email} />

                
              </StyledListItem>
            ))}
          </List>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Friends List</DialogTitle>
                <StyledDialogContent>
                    {friendsInfo.length > 0 ? (
                    <StyledList>
                        {friendsInfo.map(friend => (
                        <StyledListItem key={friend.id}>
                            <ListItemAvatar>
                            <StyledAvatar>
                                <AccountCircleIcon />
                            </StyledAvatar>
                            </ListItemAvatar>
                            <ListItemText primary={friend.username} secondary={friend.email} />
                        </StyledListItem>
                        ))}
                    </StyledList>
                    ) : (
                        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" height="100%">
                            <SentimentDissatisfiedIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                            <Typography variant="h6" color="text.secondary">
                            No friends found
                            </Typography>
                        </Box>
                    )}
                </StyledDialogContent>
            </Dialog>
        </div>
    );
};

export default UserList;