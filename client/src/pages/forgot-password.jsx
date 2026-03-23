import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  // 👇 1. เพิ่มตัวแปรเช็คความแข็งแกร่งของรหัสผ่าน
  const isLengthValid = newPassword.length >= 6;
  const hasLetterAndNumber = /[A-Za-z]/.test(newPassword) && /[0-9]/.test(newPassword);
  const isPasswordStrong = isLengthValid && hasLetterAndNumber;

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

          {/* 👇 2. กล่องแสดงสถานะความปลอดภัย (จะโชว์เมื่อเริ่มพิมพ์รหัสใหม่) */}
          {newPassword.length > 0 && (
            <div style={{ fontSize: '12px', textAlign: 'left', marginTop: '-5px', marginBottom: '5px', background: '#f8f9fa', padding: '10px', borderRadius: '6px', border: '1px solid #efefef' }}>
              <div style={{ color: '#262626', fontWeight: 'bold', marginBottom: '5px' }}>รหัสผ่านใหม่ของคุณต้องมี:</div>
              <div style={{ color: isLengthValid ? '#28a745' : '#ed4956', transition: '0.3s' }}>
                {isLengthValid ? '✅' : '❌'} ความยาวอย่างน้อย 6 ตัวอักษร
              </div>
              <div style={{ color: hasLetterAndNumber ? '#28a745' : '#ed4956', transition: '0.3s' }}>
                {hasLetterAndNumber ? '✅' : '❌'} มีตัวอักษรภาษาอังกฤษและตัวเลข
              </div>
            </div>
          )}

          <input 
            type="password" placeholder="ยืนยันรหัสผ่านใหม่" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
          />
          
          {/* 👇 3. ล็อกปุ่ม "รีเซ็ตรหัสผ่าน" ถ้าข้อมูลยังไม่ปลอดภัย */}
          <button 
            type="submit" disabled={loading || !isPasswordStrong}
            style={{ 
              background: (loading || !isPasswordStrong) ? '#b2dffc' : '#0095f6', 
              color: '#fff', 
              border: 'none', 
              padding: '12px', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              cursor: (loading || !isPasswordStrong) ? 'not-allowed' : 'pointer', 
              transition: '0.3s' 
            }}
          >
            {loading ? "กำลังบันทึก..." : "รีเซ็ตรหัสผ่าน"}
          </button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '14px' }}>
          <Link to="/login" style={{ color: '#0095f6', textDecoration: 'none', fontWeight: 'bold' }}>
            ← กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;