import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/creativity';
import LandingPage from './pages/LandingPage';
import DesktopOnly from './components/DesktopOnly';
import { Analytics } from '@vercel/analytics/react';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/creativity/home" element={
            <DesktopOnly>
              <Home />
            </DesktopOnly>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Analytics />
      </div>
    </Router>
  );
}

export default App;
