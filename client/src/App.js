import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import AdminSignup from './pages/AdminSignup';
import Login from './pages/Login';
import MainPagePlayer from './pages/MainPagePlayer';
import MainPageAdmin from './pages/MainPageAdmin';
import LivePage from './pages/LivePage';
import ResultsPageAdmin from './pages/ResultsPageAdmin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<MainPagePlayer />} />
        <Route path="/main-admin" element={<MainPageAdmin />} />
        <Route path="/live" element={<LivePage />} />        
        <Route path="/results" element={<ResultsPageAdmin />} />        
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;