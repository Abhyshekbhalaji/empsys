import React from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField, Button, Box, FormControl, MenuItem, Select, 
  InputLabel, FormHelperText, Typography, Paper
} from '@mui/material';

const EmployeeForm = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      position: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      position: Yup.string().required('Position is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        console.log(values);
        const res = await fetch('http://localhost:3001/api/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });
        
        if (!res.ok) throw new Error('Failed to save');
        
        alert(`${values.position} has been added successfully!`);
        
        // Reset form after successful submission
        formik.resetForm();
      } catch (err) {
        console.log("Error in the employee form: " + err.message);
        alert('Error adding employee. Please try again.');
      }
    }
  });

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      p: { xs: 1, sm: 2, md: 3 }
    }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Add New Employee
      </Typography>

      <Paper sx={{ 
        p: 3,
        maxWidth: 500,
        mx: 'auto',
        boxShadow: 2
      }}>
        <Box 
          component='form'
          onSubmit={formik.handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5
          }}
        >
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Full Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            variant="outlined"
          />

          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            variant="outlined"
          />

          <FormControl
            fullWidth
            error={formik.touched.position && Boolean(formik.errors.position)}
            variant="outlined"
          >
            <InputLabel id="position-label">Position</InputLabel>
            <Select
              labelId="position-label"
              id="position"
              name="position"
              value={formik.values.position}
              label="Position"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
            {formik.touched.position && formik.errors.position && (
              <FormHelperText>{formik.errors.position}</FormHelperText>
            )}
          </FormControl>

          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            variant="outlined"
          />

          <Button 
            color="primary" 
            variant="contained" 
            type="submit"
            size="large"
            disabled={formik.isSubmitting}
            sx={{
              mt: 1,
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#1976d2'
              }
            }}
          >
            {formik.isSubmitting ? 'Adding Employee...' : 'Add Employee'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EmployeeForm;