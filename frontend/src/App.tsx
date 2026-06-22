import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './lib/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import GeneratePage from './pages/GeneratePage';
import DraftsPage from './pages/DraftsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="app-canvas">
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Navigate to="/profile" replace />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/generate" element={<GeneratePage />} />
                    <Route path="/drafts" element={<DraftsPage />} />
                  </Routes>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: '12px',
              fontSize: '14px',
              background: '#0f1729',
              color: '#eaf0fb',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
