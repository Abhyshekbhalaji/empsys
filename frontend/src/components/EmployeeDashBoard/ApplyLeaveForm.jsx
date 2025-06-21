import React from 'react';
import {
  Paper, Typography, TextField, Button, Stack, Box, Alert
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const validationSchema = Yup.object().shape({
  fromDate: Yup.date()
    .nullable()
    .required('From date is required')
    .min(new Date(), "From date can't be in the past"),
  
  toDate: Yup.date()
    .nullable()
    .required('To date is required')
    .test(
      'is-after-or-equal',
      'To date must be same or after From date',
      function (value) {
        const { fromDate } = this.parent;
        return !fromDate || !value || value >= fromDate;
      }
    ),
  
  reason: Yup.string()
    .required('Reason is required')
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason must be less than 500 characters'),
});

const ApplyLeaveForm = () => {
  const [submitStatus, setSubmitStatus] = React.useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const formik = useFormik({
    initialValues: {
      fromDate: null,
      toDate: null,
      reason: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setSubmitStatus(null);
        
        const leaveData = {
          ...values,
          employeeId: user._id,
          appliedAt: new Date().toISOString(),
          status: 'Pending'
        };

        const response = await axios.post('http://localhost:3001/api/leaves', leaveData);
        
        if (response.status === 200 || response.status === 201) {
          setSubmitStatus({
            type: 'success',
            message: 'Leave request submitted successfully! You will be notified once it\'s reviewed.'
          });
          resetForm();
        }
      } catch (error) {
        console.error('Error submitting leave request:', error);
        setSubmitStatus({
          type: 'error',
          message: 'Failed to submit leave request. Please try again.'
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const calculateDays = () => {
    if (formik.values.fromDate && formik.values.toDate) {
      const diffTime = Math.abs(formik.values.toDate - formik.values.fromDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      p: { xs: 1, sm: 2, md: 3 }
    }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Apply for Leave
      </Typography>

      <Paper sx={{
        p: 4,
        maxWidth: 600,
        mx: 'auto',
        boxShadow: 2
      }}>
        {submitStatus && (
          <Alert 
            severity={submitStatus.type} 
            sx={{ mb: 3 }}
            onClose={() => setSubmitStatus(null)}
          >
            {submitStatus.message}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <DatePicker
                label="From Date"
                value={formik.values.fromDate}
                onChange={(value) => formik.setFieldValue('fromDate', value)}
                minDate={new Date()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    error: !!(formik.errors.fromDate && formik.touched.fromDate),
                    helperText: formik.touched.fromDate && formik.errors.fromDate,
                  }
                }}
              />

              <DatePicker
                label="To Date"
                value={formik.values.toDate}
                onChange={(value) => formik.setFieldValue('toDate', value)}
                minDate={formik.values.fromDate || new Date()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    error: !!(formik.errors.toDate && formik.touched.toDate),
                    helperText: formik.touched.toDate && formik.errors.toDate,
                  }
                }}
              />
            </Stack>
          </LocalizationProvider>

          {/* Duration Display */}
          {calculateDays() > 0 && (
            <Box sx={{
              mt: 2,
              p: 2,
              bgcolor: '#e3f2fd',
              borderRadius: 1,
              border: '1px solid #bbdefb'
            }}>
              <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                Leave Duration: {calculateDays()} day{calculateDays() > 1 ? 's' : ''}
              </Typography>
            </Box>
          )}

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Reason for Leave"
            name="reason"
            value={formik.values.reason}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.reason && Boolean(formik.errors.reason)}
            helperText={
              formik.touched.reason && formik.errors.reason
                ? formik.errors.reason
                : `${formik.values.reason.length}/500 characters`
            }
            variant="outlined"
            sx={{ mt: 3 }}
            placeholder="Please provide a detailed reason for your leave request..."
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={formik.isSubmitting || !formik.isValid}
            sx={{
              mt: 3,
              width: '100%',
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#1976d2'
              }
            }}
          >
            {formik.isSubmitting ? 'Submitting Request...' : 'Submit Leave Request'}
          </Button>

          {/* Form Summary */}
          <Box sx={{
            mt: 3,
            p: 2,
            bgcolor: '#f5f5f5',
            borderRadius: 1
          }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Note:</strong> Your leave request will be reviewed by the admin team. 
              You will receive notification once your request is approved or rejected.
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ApplyLeaveForm;