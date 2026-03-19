import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // 1. เพิ่มการ Import axios

const Register = () => {
  const [formData, setFormData] = useState({ 
    email: "", 
    fullName: "", 
    username: "", 
    password: "" 
  });
  const [loading, setLoading] = useState(false); // เพิ่มสถานะการโหลด
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 2. ส่งข้อมูลไปยัง Backend (URL เดียวกับที่ตั้งไว้ใน Server)
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName // ส่งค่า fullName ไปด้วยถ้าใน Model มีรองรับ
      });

      if (response.status === 201) {
        alert("สมัครสมาชิกสำเร็จ! ข้อมูลถูกบันทึกใน MongoDB เรียบร้อย");
        navigate('/login'); // เมื่อสมัครเสร็จให้ไปหน้า Login
      }
    } catch (err) {
      // ดึงข้อความ Error จาก Backend มาโชว์ (เช่น อีเมลซ้ำ)
      const errorMessage = err.response?.data?.error || "เกิดข้อผิดพลาดในการสมัครสมาชิก";
      alert("สมัครไม่สำเร็จ: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ background: '#fff', border: '1px solid #dbdbdb', padding: '40px', borderRadius: '8px', width: '350px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Kanit', fontSize: '32px', marginBottom: '10px', fontWeight: 'bold' }}>MyGram</h1>
        <p style={{ color: '#8e8e8e', fontWeight: 'bold', fontSize: '16px', marginBottom: '20px' }}>
          สมัครใช้งานเพื่อดูรูปภาพและวิดีโอจากเพื่อนของคุณ
        </p>
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="email" placeholder="อีเมล" required
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{ padding: '10px', border: '1px solid #dbdbdb', borderRadius: '4px', backgroundColor: '#fafafa', fontSize: '12px' }}
          />
          <input 
            type="text" placeholder="ชื่อ-นามสกุล" required
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            style={{ padding: '10px', border: '1px solid #dbdbdb', borderRadius: '4px', backgroundColor: '#fafafa', fontSize: '12px' }}
          />
          <input 
            type="text" placeholder="ชื่อผู้ใช้" required
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            style={{ padding: '10px', border: '1px solid #dbdbdb', borderRadius: '4px', backgroundColor: '#fafafa', fontSize: '12px' }}
          />
          <input 
            type="password" placeholder="รหัสผ่าน" required
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={{ padding: '10px', border: '1px solid #dbdbdb', borderRadius: '4px', backgroundColor: '#fafafa', fontSize: '12px' }}
          />
          
          <button 
            type="submit" 
            disabled={loading} // ป้องกันการกดซ้ำตอนกำลังส่งข้อมูล
            style={{ 
              background: loading ? '#b2dffc' : '#0095f6', 
              color: '#fff', 
              border: 'none', 
              padding: '8px', 
              borderRadius: '4px', 
              fontWeight: 'bold', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              marginTop: '10px' 
            }}
          >
            {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
          </button>
        </form>

        <p style={{ color: '#8e8e8e', fontSize: '12px', marginTop: '20px' }}>
          การสมัครใช้งาน แสดงว่าคุณตกลงตามข้อกำหนด นโยบายส่วนบุคคล และนโยบายคุกกี้ของเรา
        </p>
      </div>

      <div style={{ background: '#fff', border: '1px solid #dbdbdb', padding: '20px', borderRadius: '8px', width: '350px', textAlign: 'center', marginTop: '15px' }}>
        <p style={{ fontSize: '14px', margin: 0 }}>
          มีบัญชีอยู่แล้วใช่ไหม? <Link to="/login" style={{ color: '#0095f6', textDecoration: 'none', fontWeight: 'bold' }}>เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;