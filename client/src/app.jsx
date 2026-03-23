import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/home';
import Chat from './pages/chat';
import Group from './pages/group';
import Login from './pages/login';
import Page from './pages/pages';
import Profile from './pages/profile';
import Register from './pages/register';
import ForgotPassword from './pages/forgot-password';

function App() {
  // ดึงข้อมูลว่าล็อกอินหรือยัง
  const user = localStorage.getItem("user");

  return (
    <BrowserRouter>
      <Routes>
        {/* =========================================
            🔒 โซนหวงห้าม (ต้องล็อกอินก่อนถึงจะเข้าได้)
            ถ้าไม่มี user ให้เตะกลับไปหน้า /login
            ========================================= */}
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" replace />} />
        <Route path="/group" element={user ? <Group /> : <Navigate to="/login" replace />} />
        <Route path="/pages" element={user ? <Page /> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
        
        {/* =========================================
            🔓 โซนสาธารณะ (คนล็อกอินแล้วไม่ต้องเข้ามาอีก)
            ถ้ามี user อยู่แล้ว ให้เตะกลับไปหน้า Home
            ========================================= */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
        <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;