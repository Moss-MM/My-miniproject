import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('https://mygram-backend-yiba.onrender.com/api/auth/login', {
        email: email,
        password: password
      });

      if (response.status === 200) {
        alert("🎉 " + (response.data.message || "เข้าสู่ระบบสำเร็จ!"));
        
        const userData = response.data.user ? response.data.user : response.data;
        localStorage.setItem('user', JSON.stringify(userData));
        
        window.location.href = '/'; 
      }
    } catch (err) {
      // 👇 แก้ไข: ดักจับคำว่า 'message' ที่ส่งมาจากหลังบ้านให้ถูกต้อง
      // และเพิ่มข้อความบอกผู้ใช้เผื่อ Render กำลังตื่นนอน
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "เซิร์ฟเวอร์กำลังตื่นนอน... รบกวนกดล็อกอินอีกครั้งครับ!";
      alert("❌ " + errorMessage);
    } finally {
      // 👇 ปลดล็อกปุ่มเสมอ ไม่ว่าจะสำเร็จหรือพัง
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'Kanit' }}>
      <div style={{ background: '#fff', border: '1px solid #dbdbdb', padding: '40px', borderRadius: '8px', width: '350px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '30px', fontWeight: 'bold' }}>MyGram</h1>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="email" 
            placeholder="อีเมลที่ใช้สมัคร" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '10px', border: '1px solid #dbdbdb', borderRadius: '4px', backgroundColor: '#fafafa', fontSize: '12px', fontFamily: 'Kanit' }}
          />
          <input 
            type="password" 
            placeholder="รหัสผ่าน" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '10px', border: '1px solid #dbdbdb', borderRadius: '4px', backgroundColor: '#fafafa', fontSize: '12px', fontFamily: 'Kanit' }}
          />
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: loading ? '#b2dffc' : '#0095f6', 
              color: '#fff', 
              border: 'none', 
              padding: '8px', 
              borderRadius: '4px', 
              fontWeight: 'bold', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              marginTop: '10px',
              fontFamily: 'Kanit'
            }}
          >
            {loading ? 'กำลังปลุกเซิร์ฟเวอร์...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px' }}>
          <Link to="/forgot-password" style={{ color: '#0095f6', textDecoration: 'none' }}>ลืมรหัสผ่านใช่หรือไม่?</Link>
        </div>

      </div>

      <div style={{ background: '#fff', border: '1px solid #dbdbdb', padding: '20px', borderRadius: '8px', width: '350px', textAlign: 'center', marginTop: '15px' }}>
        <p style={{ fontSize: '14px', margin: 0 }}>
          ยังไม่มีบัญชีใช่ไหม? <Link to="/register" style={{ color: '#0095f6', textDecoration: 'none', fontWeight: 'bold' }}>สมัครใช้งาน</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;