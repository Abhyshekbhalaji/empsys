import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, TableContainer
} from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { useToast } from '../ToasterContext';

const ApproveLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const showToast = useToast(); // ✅ Toast hook

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/leaves`);
      setLeaves(res.data);
    } catch (err) {
      console.error('Error fetching leaves:', err);
      showToast('Failed to fetch leave requests', 'error'); // optional toast
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleOpen = (leave) => {
    setSelectedLeave(leave);
    setSelectedStatus('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedLeave(null);
    setSelectedStatus('');
  };

  const handleApproveReject = async () => {
    try {
      await axios.patch(`${API_BASE_URL}/api/leaves/${selectedLeave._id}/status`, {
        status: selectedStatus,
      });

      setLeaves(prevLeaves =>
        prevLeaves.map(leave =>
          leave._id === selectedLeave._id
            ? { ...leave, status: selectedStatus }
            : leave
        )
      );

      fetchLeaves();
      handleClose();
      showToast(`Leave ${selectedStatus.toLowerCase()} successfully`, 'success'); // ✅ Success toast
    } catch (err) {
      console.error('Error updating leave status:', err);
      showToast('Error updating leave status. Please try again.', 'error'); // ✅ Error toast
    }
  };

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      p: { xs: 1, sm: 2, md: 3 }
    }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Leave Requests Management
      </Typography>

      <Paper sx={{
        width: '100%',
        overflow: 'hidden',
        boxShadow: 2
      }}>
        <TableContainer sx={{
          maxHeight: 'calc(100vh - 200px)',
          overflow: 'auto'
        }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>
                  Employee Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>
                  From
                </TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>
                  To
                </TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>
                  Reason
                </TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>
                  Status/Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaves.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No leave requests found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                leaves.map((leave) => (
                  <TableRow key={leave._id} hover>
                    <TableCell>{leave.employee?.name || 'N/A'}</TableCell>
                    <TableCell>
                      {new Date(leave.fromDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(leave.toDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{
                      maxWidth: 200,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {leave.reason}
                    </TableCell>
                    <TableCell>
                      {leave.status === 'Pending' ? (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpen(leave)}
                          sx={{ minWidth: 'auto' }}
                        >
                          Take Action
                        </Button>
                      ) : (
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            color: 'white',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            backgroundColor: leave.status === 'Approved' ? '#4caf50' : '#f44336',
                          }}
                        >
                          {leave.status}
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { m: 2 }
        }}
      >
        <DialogTitle>
          Take Action on Leave Request
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedLeave && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Employee: {selectedLeave.employee?.name || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Duration: {new Date(selectedLeave.fromDate).toLocaleDateString()} - {new Date(selectedLeave.toDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reason: {selectedLeave.reason}
              </Typography>
            </Box>
          )}
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              label="Status"
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <MenuItem value="Approved">Approve</MenuItem>
              <MenuItem value="Rejected">Reject</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleApproveReject}
            variant="contained"
            disabled={!selectedStatus}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApproveLeave;
