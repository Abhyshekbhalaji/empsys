import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Avatar,
  Chip,
  TableContainer,
  Fade,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  AdminPanelSettings as AdminIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import axios from 'axios';
import API_BASE_URL from '../../config';

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/employees`);
      setEmployees(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    const roleColors = {
      admin: 'error',
      manager: 'primary',
      employee: 'success',
      intern: 'info',
      contractor: 'warning',
    };
    return roleColors[role?.toLowerCase()] || 'default';
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return <AdminIcon fontSize="small" />;
      case 'manager':
        return <WorkIcon fontSize="small" />;
      default:
        return <BadgeIcon fontSize="small" />;
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={48} thickness={4} />
        <Typography variant="body2" color="text.secondary">
          Loading employee data...
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in timeout={600}>
      <Box sx={{ maxWidth: '100%', margin: 'auto' }}>
        {/* Header Section */}
        <Paper 
          elevation={0} 
          sx={{ 
            padding: 3, 
            marginBottom: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            borderRadius: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar 
              sx={{ 
                bgcolor: alpha(theme.palette.common.white, 0.2),
                width: 48,
                height: 48,
              }}
            >
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="600" gutterBottom>
                Employee Directory
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Manage and view all employee information
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Stats Card */}
        <Paper 
          elevation={2} 
          sx={{ 
            padding: 2, 
            marginBottom: 3,
            borderRadius: 2,
            background: alpha(theme.palette.primary.main, 0.04),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Typography variant="h6" color="primary" fontWeight="600">
            Total Employees: {employees.length}
          </Typography>
        </Paper>

        {/* Table Section */}
        <Paper 
          elevation={3} 
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: theme.shadows[8],
          }}
        >
          {employees.length === 0 ? (
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              padding={6}
              textAlign="center"
            >
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: alpha(theme.palette.text.secondary, 0.1),
                  marginBottom: 2,
                }}
              >
                <PersonIcon fontSize="large" />
              </Avatar>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No employees found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Employee data will appear here once available
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow 
                    sx={{ 
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      '& .MuiTableCell-head': {
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        color: theme.palette.primary.main,
                        borderBottom: `2px solid ${theme.palette.primary.main}`,
                      }
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <PersonIcon fontSize="small" />
                        Employee
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <EmailIcon fontSize="small" />
                        Email
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <WorkIcon fontSize="small" />
                        Role
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <BadgeIcon fontSize="small" />
                        Employee ID
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((emp, index) => (
                    <TableRow 
                      key={emp._id}
                      sx={{
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.04),
                          transform: 'scale(1.001)',
                          transition: 'all 0.2s ease-in-out',
                        },
                        '&:nth-of-type(even)': {
                          backgroundColor: alpha(theme.palette.grey[500], 0.02),
                        },
                        cursor: 'pointer',
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar 
                            sx={{ 
                              bgcolor: theme.palette.primary.main,
                              width: 40,
                              height: 40,
                              fontSize: '0.9rem',
                              fontWeight: '600',
                            }}
                          >
                            {getInitials(emp.name)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="500">
                              {emp.name || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            fontFamily: 'monospace',
                            backgroundColor: alpha(theme.palette.grey[500], 0.1),
                            padding: '4px 8px',
                            borderRadius: 1,
                            display: 'inline-block',
                          }}
                        >
                          {emp.user_id || emp.email || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getRoleIcon(emp.role)}
                          label={emp.role || 'Employee'}
                          color={getRoleColor(emp.role)}
                          variant="outlined"
                          size="small"
                          sx={{
                            fontWeight: '500',
                            textTransform: 'capitalize',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'monospace',
                            color: theme.palette.text.secondary,
                            backgroundColor: alpha(theme.palette.grey[500], 0.08),
                            padding: '4px 8px',
                            borderRadius: 1,
                            display: 'inline-block',
                            fontSize: '0.8rem',
                          }}
                        >
                          {emp._id}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </Fade>
  );
};

export default EmployeeDetails;