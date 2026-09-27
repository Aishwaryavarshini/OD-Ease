import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ODProvider } from './context/ODContext';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import StudentPortal from './pages/StudentPortal';
import ApplyOD from './pages/ApplyOD';
import StaffPortal from './pages/StaffPortal';
import ODInchargePortal from './pages/ODInchargePortal';
import PrincipalPortal from './pages/PrincipalPortal';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (!allowedRoles.includes(user.role)) {
    // Redirect to their respective portal if unauthorized
    if (user.role === 'Student') return <Navigate to="/student" />;
    if (user.role === 'Staff') return <Navigate to="/staff" />;
    if (user.role === 'ODIncharge') return <Navigate to="/od-incharge" />;
    if (user.role === 'Principal') return <Navigate to="/principal" />;
  }
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  const getTargetRoute = (role: string) => {
    if (role === 'ODIncharge') return 'od-incharge';
    if (role === 'Principal') return 'principal';
    return role.toLowerCase();
  };

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={`/${getTargetRoute(user.role)}`} /> : <Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/student" element={<ProtectedRoute allowedRoles={['Student']}><StudentPortal /></ProtectedRoute>} />
      <Route path="/student/apply" element={<ProtectedRoute allowedRoles={['Student']}><ApplyOD /></ProtectedRoute>} />
      <Route path="/staff" element={<ProtectedRoute allowedRoles={['Staff']}><StaffPortal /></ProtectedRoute>} />
      <Route path="/od-incharge" element={<ProtectedRoute allowedRoles={['ODIncharge']}><ODInchargePortal /></ProtectedRoute>} />
      <Route path="/principal" element={<ProtectedRoute allowedRoles={['Principal']}><PrincipalPortal /></ProtectedRoute>} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ODProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ODProvider>
    </AuthProvider>
  );
};

export default App;
