import { Box } from "@mui/material";
import Home from "./EmployeeDashBoard/Home";
import ApplyLeaveForm from "./EmployeeDashBoard/ApplyLeaveForm";
import LeaveHistory from "./EmployeeDashBoard/LeaveHistory";
import React, { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const EmployeeDashBoard = () => {
  const { id } = useParams(); // from the URL
  const user = JSON.parse(localStorage.getItem('user'));
  
  // If user is not logged in or doesn't exist
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user ID doesn't match the URL parameter
  if (user._id !== id) {
    return <Navigate to="/not-authorized" replace />;
  }

  // If user is not an employee
  if (user.role !== 'employee') {
    return <Navigate to="/not-authorized" replace />;
  }

  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  function renderSection() {
    switch (activeTab) {
      case "home":
        return <Home user={user} />;
      case "apply":
        return <ApplyLeaveForm />;
      case "history":
        return <LeaveHistory />;
      default:
        return <Home user={user} />;
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{
        width: "200px",
        background: "#1e1e2f",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}>
        <h3>DashBoard</h3>
        
        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              cursor: "pointer",
              padding: "10px",
              alignSelf: "start",
              background: activeTab === "home" ? "#34344e" : "transparent",
            }}
            onClick={() => setActiveTab("home")}
          >
            Home
          </div>
          
          <div style={{
            cursor: "pointer",
            padding: "10px",
            background: activeTab === "apply" ? "#34344e" : "transparent"
          }}
            onClick={() => setActiveTab("apply")}
          >
            Apply Leave
          </div>
          
          <div
            style={{
              cursor: "pointer",
              padding: "10px",
              background: activeTab === "history" ? "#34344e" : "transparent",
            }}
            onClick={() => setActiveTab("history")}
          >
            Leave History
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#ff4d4d",
            color: "white",
            border: "none",
            padding: "10px",
            cursor: "pointer",
            borderRadius: "4px",
            width: "100%",
            marginTop: "auto", // ensures it stays at the bottom
          }}
        >
          Logout
        </button>
      </div>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {renderSection()}
      </Box>
    </div>
  );
};

export default EmployeeDashBoard;