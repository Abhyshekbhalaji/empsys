import React from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { TextField, Button, Box, ToggleButtonGroup, ToggleButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Simple config - change this URL when deploying
const API_BASE_URL = 'http://localhost:3001'; // Change to your deployed backend URL

const LoginPage = () => {
  const [mode, setMode] = useState('admin');
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      console.log('Submitting login values:', values);
      try {
        const endpoint = mode === 'admin' 
          ? `${API_BASE_URL}/api/auth/login` 
          : `${API_BASE_URL}/api/auth/employee-login`;
          
        console.log(endpoint);
        
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
            password: values.password
          }),
        });
        
        if (!res.ok) throw new Error("Invalid credentials");
        
        const data = await res.json();
        console.log("data received from backend: ", data);
        
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        const { _id } = data.user;
        console.log(data.user);
        
        alert("Login Successful");
        
        if (data.user.role === 'admin') {
          navigate("/admin-dashboard");
        } else {
          console.log(data.user);
          navigate(`/employee-dashboard/${_id}`);
        }
      } catch (err) {
        alert(err.message);
      }
      
      // Reset form
      formik.resetForm();
    }
  });

  return (
    <Box 
      component="form" 
      onSubmit={formik.handleSubmit} 
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2
      }}
    >
      <ToggleButtonGroup 
        value={mode} 
        exclusive 
        onChange={(_, val) => val && setMode(val)}
      >
        <ToggleButton value="admin">Admin Login</ToggleButton>
        <ToggleButton value="employee">Employee Login</ToggleButton>
      </ToggleButtonGroup>

      <Typography variant="h5" align="center">
        {mode === 'admin' ? 'Admin Login' : 'Employee Login'}
      </Typography>

      <TextField 
        id='email' 
        name='email'
        label='Email' 
        value={formik.values.email} 
        onChange={formik.handleChange} 
        onBlur={formik.handleBlur} 
        error={formik.touched.email && Boolean(formik.errors.email)} 
        helperText={formik.touched.email && formik.errors.email}
      />

      <TextField
        id="password"
        name="password"
        label="Password"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
      />

      <Button variant="contained" color="primary" type="submit">
        Login
      </Button>
    </Box>
  );
};

export default LoginPage;