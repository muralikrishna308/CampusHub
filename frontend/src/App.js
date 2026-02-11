import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import RoleSelection from './components/RoleSelection';
import StudentLogin from './components/StudentLogin';
import StudentRegister from './components/StudentRegister';
import AdminLogin from './components/AdminLogin';
import AdminRegister from './components/AdminRegister';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
    const { user } = useAuth();
    
    if (!user) {
        return <Navigate to="/" />;
    }
    
    if (user.role !== allowedRole) {
        return <Navigate to={`/${user.role}/dashboard`} />;
    }
    
    return children;
};

function AppContent() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/role/:role" element={<RoleSelection />} />
            <Route path="/login/student" element={<StudentLogin />} />
            <Route path="/register/student" element={<StudentRegister />} />
            <Route path="/login/admin" element={<AdminLogin />} />
            <Route path="/register/admin" element={<AdminRegister />} />
            
            {/* Protected Student Routes */}
            <Route 
                path="/student/dashboard" 
                element={
                    <ProtectedRoute allowedRole="student">
                        <StudentDashboard />
                    </ProtectedRoute>
                } 
            />
            
            {/* Protected Admin Routes */}
            <Route 
                path="/admin/dashboard" 
                element={
                    <ProtectedRoute allowedRole="admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                } 
            />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;