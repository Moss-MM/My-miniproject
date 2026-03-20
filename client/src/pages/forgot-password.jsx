import React, { useState } from 'react';
import axios from 'axios';
// 👇 1. นำเข้า Link และ useNavigate จาก react-router-dom
import { Link, useNavigate } from 'react-router-dom'; 

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 👈 2. เรียกใช้งาน navigate

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return alert("รหัสผ่านไม่ตรงกันครับ!");
    }

    setLoading(true);
    try {
      const res = await axios.put('https://mygram-backend-yiba.onrender.com/api/auth/reset-password', {
        email,
        newPassword
      });
      alert(res.data.message);
      // 👇 3. ใช้ navigate แทน window.location.href เพื่อเปลี่ยนหน้าแบบไม่รีเฟรช
      navigate('/login'); 
    } catch (err) {
      alert(err.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', 
      minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Kanit' 
    }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', width: '100%', maxWidth: '350px', textAlign: 'center' }}>
        <h2 style={{ color: '#1c1e21', marginBottom: '10px' }}>ลืมรหัสผ่าน?</h2>
        <p style={{ color: '#65676b', fontSize: '14px', marginBottom: '25px' }}>กรอกอีเมลเพื่อตั้งรหัสผ่านใหม่</p>

        <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" placeholder="อีเมลของคุณ" required value={email} onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
          />
          <input 
            type="password" placeholder="รหัสผ่านใหม่" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
          />
          <input 
            type="password" placeholder="ยืนยันรหัสผ่านใหม่" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
          />
          
          <button 
            type="submit" disabled={loading}
            style={{ background: '#0095f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}
          >
            {loading ? "กำลังบันทึก..." : "รีเซ็ตรหัสผ่าน"}
          </button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '14px' }}>
          {/* 👇 4. เปลี่ยนจาก <a> เป็น <Link> */}
          <Link to="/login" style={{ color: '#0095f6', textDecoration: 'none', fontWeight: 'bold' }}>
            ← กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;