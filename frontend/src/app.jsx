import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/dashboardAdmin";
import AdminParticipants from "./pages/AdminParticipants";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Events from "./pages/Events";
import MyRegistrations from "./pages/MyRegistrations";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />

          <Route
            path="/student"
            element={
              <ProtectedRoute role={"student"}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role={"admin"}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin"
            element={
              <ProtectedRoute role={"super_admin"}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/participants"
            element={
              <ProtectedRoute role={"admin"}>
                <AdminParticipants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/registrations"
            element={
              <ProtectedRoute role={"student"}>
                <MyRegistrations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute role={"student"}>
                <Events />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
