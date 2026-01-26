import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/creativity';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/creativity/home" element={<Home />} />
          <Route path="/" element={<Navigate to="/creativity/home" replace />} />
          <Route path="*" element={<Navigate to="/creativity/home" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
