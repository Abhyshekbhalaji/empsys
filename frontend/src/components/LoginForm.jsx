import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Container,
  InputAdornment,
  IconButton,
  ToggleButtonGroup,
  ToggleButton
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Business as BusinessIcon,
  Person as PersonIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import { useToast } from "./ToasterContext";

const LoginPage = () => {
  const [mode, setMode] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();

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
      try {
        const endpoint = mode === 'admin'
          ? `${API_BASE_URL}/api/auth/login`
          : `${API_BASE_URL}/api/auth/employee-login`;

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!res.ok) throw new Error("Invalid credentials");
        const data = await res.json();

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        showToast("Login Successful", "success");

        if (data.user.role === 'admin') {
          navigate("/admin-dashboard");
        } else {
          navigate(`/employee-dashboard/${data.user._id}`);
        }
      } catch (err) {
        showToast("Invalid credentials", "error");
        showToast("Login failed", "error");
      }

      formik.resetForm();
    }
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(_, val) => val && setMode(val)}
            size="small"
          >
            <ToggleButton value="admin"><BusinessIcon sx={{ mr: 1 }} />Admin</ToggleButton>
            <ToggleButton value="employee"><PersonIcon sx={{ mr: 1 }} />Employee</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            id="email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 3, textTransform: "none" }}
          >
            Sign In as {mode}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;
