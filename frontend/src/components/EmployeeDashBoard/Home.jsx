import React from 'react';
import {
  Box, Typography, Paper, Grid, Card, CardContent,
  Avatar, Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  Badge as BadgeIcon,
  Email as EmailIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';

const Home = () => {

  console.log("hi");
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  const InfoCard = ({ icon, title, value, color = '#1976d2' }) => (
    <Card sx={{ 
      height: '100%',
      boxShadow: 2,
      '&:hover': {
        boxShadow: 4,
        transform: 'translateY(-2px)',
        transition: 'all 0.3s ease-in-out'
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ 
            bgcolor: color, 
            mr: 2, 
            width: 48, 
            height: 48 
          }}>
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      p: { xs: 1, sm: 2, md: 3 }
    }}>
      {/* Welcome Header */}
      <Paper sx={{
        p: 4,
        mb: 4,
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        color: 'white',
        borderRadius: 2,
        boxShadow: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{
            width: 64,
            height: 64,
            bgcolor: 'rgba(255,255,255,0.2)',
            mr: 3,
            fontSize: '1.5rem'
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Welcome back, {user?.name || 'User'}!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {user?.role === 'admin' ? 'Administrator' : 'Employee'} Dashboard
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* User Information Cards */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Your Profile Information
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            icon={<PersonIcon />}
            title="Full Name"
            value={user?.name || 'N/A'}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            icon={<EmailIcon />}
            title="Email Address"
            value={user.userId|| 'N/A'}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            icon={<BadgeIcon />}
            title="Position"
            value={user?.role|| 'N/A'}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            icon={<AccountIcon />}
            title="User ID"
            value={user?._id?.slice(-8) || 'N/A'}
            color="#f44336"
          />
        </Grid>
      </Grid>

      {/* Quick Actions or Stats */}
      <Paper sx={{ p: 3, boxShadow: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Quick Overview
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Account Status
              </Typography>
              <Typography variant="h6" color="success.main">
                Active
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Last Login
              </Typography>
              <Typography variant="h6">
                {new Date().toLocaleDateString()}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {user?.position === 'admin' && (
          <Box sx={{ mt: 3, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
            <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
              Administrator Access
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You have full access to manage employees and approve leave requests.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Home;