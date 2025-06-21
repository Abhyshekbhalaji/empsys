import React from "react";

import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";

const NotAuthorized = () => {
    const navigate = useNavigate();
  return (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h4" color="error">
        403 - Not Authorized
      </Typography>
      <Typography>
        You do not have permission to view this page.
      </Typography>
      <Button color="primary" variant="contained" onClick={()=> navigate("/")}>
        Go back
      </Button>
    </Box>
  );
};

export default NotAuthorized;