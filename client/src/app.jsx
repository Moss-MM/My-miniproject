import React from 'react';
// 👇 อย่าลืม import Navigate เข้ามาด้วยครับ
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ตรวจสอบชื่อไฟล์ตัวเล็กตัวใหญ่ให้ตรงกับในเครื่องคุณ
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
  // ดึงข้อมูลว่าล็อกอินหรือยัง
  const user = localStorage.getItem("user");

  return (
    <BrowserRouter>
      <Routes>
        {/* 👇 พระเอกของเราอยู่บรรทัดนี้ครับ: ถ้าไม่มี user ให้เด้งไปหน้า login */}
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" replace />} />
        
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