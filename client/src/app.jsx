// src/app.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// ตรวจสอบชื่อไฟล์ตัวเล็ตัวใหญ่ให้ตรงกับในเครื่องคุณ
import Home from './pages/home';
import Admin from './pages/admin';
import Chat from './pages/chat';
import Group from './pages/group';
import Login from './pages/login';
import Page from './pages/pages';
import Profile from './pages/profile';
import Register from './pages/register';
import ForgotPassword from './pages/forgot-password';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/group" element={<Group />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pages" element={<Page />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;