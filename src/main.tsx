import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import PublicProfile from './PublicProfile.tsx';
import LandingPage from './LandingPage.tsx';
import Auth from './Auth.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Auth type="login" />} />
        <Route path="/register" element={<Auth type="register" />} />
        <Route path="/forgot-password" element={<Auth type="forgot" />} />
        <Route path="/dashboard" element={<App />} />
        <Route path="/profiles/:username" element={<PublicProfile />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
