
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

export default function PrivateRoute({ children,allowedRole }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  if (!token || !user || token === "undefined" || user === "undefined") {
    return <Navigate to="/login" replace />;
  } 

  

 
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/not-authorized" />;
    
 
  return children;
}
