import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import TripDetails from './pages/TripDetails';
import EmergencyPage from './pages/EmergencyPage';
import EmergencyDirectoryPage from './pages/EmergencyDirectoryPage';
import SharedTripPage from './pages/SharedTripPage';
import PrivateRoute from './components/PrivateRoute';
import AppLayout from './components/AppLayout';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#0f172a' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#0f172a' } },
        }}
      />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Shared Trip - Public (no auth, no layout) */}
          <Route path="/shared/:token" element={<SharedTripPage />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/trip/:id"
            element={
              <PrivateRoute>
                <AppLayout>
                  <TripDetails />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/emergency"
            element={
              <PrivateRoute>
                <AppLayout>
                  <EmergencyPage />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/emergency-directory"
            element={
              <PrivateRoute>
                <AppLayout>
                  <EmergencyDirectoryPage />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
