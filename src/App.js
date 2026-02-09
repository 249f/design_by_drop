import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home, Settings } from './pages/creativity';
import LandingPage from './pages/LandingPage';
import DesktopOnly from './components/DesktopOnly';
import { Analytics } from '@vercel/analytics/react';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import ProtectedRoute from './components/ProtectedRoute';
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProjectProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/creativity/home" element={
                <ProtectedRoute>
                  <DesktopOnly>
                    <Home />
                  </DesktopOnly>
                </ProtectedRoute>
              } />
              <Route path="/creativity/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Analytics />
          </div>
        </ProjectProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
