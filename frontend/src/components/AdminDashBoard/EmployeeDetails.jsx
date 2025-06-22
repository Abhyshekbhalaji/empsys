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
} from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '../../config'

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <CircularProgress sx={{ margin: 4 }} />;
  }

  return (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h6" gutterBottom>
        Employee Details
      </Typography>
      {employees.length === 0 ? (
        <Typography>No employees found.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email </TableCell>
              <TableCell>Role</TableCell>
              <TableCell>ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp._id}>
                <TableCell>{emp.name}</TableCell>
                <TableCell>{emp.user_id}</TableCell>
                <TableCell>{emp.role}</TableCell>
                <TableCell>{emp._id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
};

export default EmployeeDetails;
