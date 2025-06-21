import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginForm';
import AdminDashboard from './components/AdminDashBoard/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import PrivateRoute from './components/PrivateRoute';
import ErrorPage from './components/ErrorPage';
import NotAuthorized from './components/NotAuthorized';

function App() {
  const user = JSON.parse(localStorage.getItem('user') || "null");
  const token = localStorage.getItem('token');
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
      
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Route */}
        <Route path="/" element={
          <PrivateRoute>
            {user?.role === 'admin'
              ? <Navigate to="/admin-dashboard" />
              : <Navigate to={`/employee-dashboard/${user?.userId}`} />}
          </PrivateRoute>
        } />

      
        <Route path="/admin-dashboard/*" element={
          <PrivateRoute allowedRole='admin'>
            <AdminDashboard />
          </PrivateRoute>
        } />

       
        <Route path="/employee-dashboard/:id" element={
          <PrivateRoute allowedRole='employee' >
            <EmployeeDashboard />
          </PrivateRoute>
        } />
        <Route path="*" element={<ErrorPage/>}/>
        <Route path="/not-authorized" element={<NotAuthorized/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
