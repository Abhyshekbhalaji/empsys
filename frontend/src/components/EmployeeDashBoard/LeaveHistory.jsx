import React from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Typography, CircularProgress, Box, TableContainer
} from '@mui/material';
import axios from 'axios';
import { useState, useEffect } from 'react';

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/leaves/${user._id}`);
        setLeaves(res.data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }
    if (user?._id) {
      fetchLeaves();
    }
  }, [user]);

  const getStatusBadge = (status) => {
    let backgroundColor;
    switch (status) {
      case 'Approved':
        backgroundColor = '#4caf50';
        break;
      case 'Rejected':
        backgroundColor = '#f44336';
        break;
      case 'Pending':
        backgroundColor = '#ff9800';
        break;
      default:
        backgroundColor = '#9e9e9e';
    }

    return (
      <Box
        sx={{
          display: 'inline-block',
          px: 2,
          py: 0.5,
          borderRadius: 2,
          color: 'white',
          fontSize: '0.875rem',
          fontWeight: 600,
          backgroundColor,
        }}
      >
        {status}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      p: { xs: 1, sm: 2, md: 3 }
    }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        My Leave History
      </Typography>

      <Paper sx={{
        width: '100%',
        overflow: 'hidden',
        boxShadow: 2
      }}>
        {leaves.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No leave records found.
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{
            maxHeight: 'calc(100vh - 200px)',
            overflow: 'auto'
          }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>
                    From Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>
                    To Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>
                    Reason
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>
                    Applied At
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaves.map((leave) => (
                  <TableRow key={leave._id} hover>
                    <TableCell>
                      {new Date(leave.fromDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(leave.toDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{
                      maxWidth: 250,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {leave.reason}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(leave.status)}
                    </TableCell>
                    <TableCell>
                      {new Date(leave.appliedAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default LeaveHistory;