import React, { useState } from 'react';
import { 
  Box, Button, Drawer, List, ListItem, ListItemButton, 
  ListItemText, Typography, useTheme, useMediaQuery 
} from '@mui/material';
import AddEmployee from './AddEmployee';
import ApproveLeave from './ApproveLeave';
import EmployeeDetails from './EmployeeDetails';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('add');
  const theme = useTheme();
  

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const renderSection = () => {
    switch (selected) {
      case 'add':
        return <AddEmployee />;
      case 'approve':
        return <ApproveLeave />;
      case 'details':
        return <EmployeeDetails />;
      default:
        return null;
    }
  };

  const drawerWidth = 240;

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh',
      overflow: 'hidden'
    }}>
      <Drawer
        variant="permanent"
        anchor="left"
        PaperProps={{
          sx: {
            width: drawerWidth,
            backgroundColor: '#1e1e2f',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'fixed',
            height: '100vh',
            zIndex: theme.zIndex.drawer,
          },
        }}
      >
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" align="center" sx={{ mb: 2, px: 2 }}>
            Admin Panel
          </Typography>
          <List sx={{ px: 1 }}>
            <ListItem disablePadding>
              <ListItemButton
                sx={{ 
                  backgroundColor: selected === 'add' ? '#34344e' : 'transparent',
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': {
                    backgroundColor: selected === 'add' ? '#34344e' : 'rgba(255,255,255,0.1)'
                  }
                }}
                onClick={() => setSelected('add')}
              >
                <ListItemText primary="Add Employee" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                sx={{ 
                  backgroundColor: selected === 'approve' ? '#34344e' : 'transparent',
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': {
                    backgroundColor: selected === 'approve' ? '#34344e' : 'rgba(255,255,255,0.1)'
                  }
                }}
                onClick={() => setSelected('approve')}
              >
                <ListItemText primary="Approve Leaves" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                sx={{ 
                  backgroundColor: selected === 'details' ? '#34344e' : 'transparent',
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': {
                    backgroundColor: selected === 'details' ? '#34344e' : 'rgba(255,255,255,0.1)'
                  }
                }}
                onClick={() => setSelected('details')}
              >
                <ListItemText primary="Employee Details" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        <Box sx={{ p: 2 }}>
          <Button 
            fullWidth 
            variant="contained" 
            color="error" 
            onClick={handleLogout}
            sx={{
              '&:hover': {
                backgroundColor: '#d32f2f'
              }
            }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          marginLeft: `${drawerWidth}px`,
          width: `calc(100vw - ${drawerWidth}px)`,
          height: '100vh',
          overflow: 'auto',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Box sx={{ 
          height: '100%',
          width: '100%',
          overflow: 'hidden'
        }}>
          {renderSection()}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;