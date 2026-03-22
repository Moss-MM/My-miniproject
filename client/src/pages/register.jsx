import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const Register = () => {
  const [formData, setFormData] = useState({ 
    email: "", 
    fullName: "", 
    username: "", 
    password: "" 
  });
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  // 👇 เช็คเงื่อนไขรหัสผ่านแบบ Real-time (ดึงค่ามาจาก formData.password)
  const isLengthValid = formData.password.length >= 6;
  const hasLetterAndNumber = /[A-Za-z]/.test(formData.password) && /[0-9]/.test(formData.password);
  const isPasswordStrong = isLengthValid && hasLetterAndNumber;

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('https://mygram-backend-yiba.onrender.com/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName 
      });

      if (response.status === 201) {
        alert("🎉 สมัครสมาชิกสำเร็จ! ข้อมูลถูกบันทึกเรียบร้อย");
        navigate('/login'); 
      }
    } catch (err) {
      // ดักจับข้อความ Error ทั้งจาก error และ message
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก";
      alert("❌ สมัครไม่สำเร็จ: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'Kanit' }}>
      <div style={{ background: '#fff', border: '1px solid #dbdbdb', padding: '40px', borderRadius: '8px', width: '350px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Kanit', fontSize: '32px', marginBottom: '10px', fontWeight: 'bold' }}>MyGram</h1>
        <p style={{ color: '#8e8e8e', fontWeight: 'bold', fontSize: '16px', marginBottom: '20px' }}>
          สมัครใช้งานเพื่อดูรูปภาพและวิดีโอจากเพื่อนของคุณ
        </p>
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="email" placeholder="อีเมล" required
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{ padding: '10px', border: '1px solid #dbdbdb', borderRadius: '4px', backgroundColor: '#fafafa', fontSize: '12px', fontFamily: 'Kanit' }}
          />
          <input 
            type="text" placeholder="ชื่อ-นามสกุล" required
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            style={{ padding: '10px', border: '1px solid #dbdbdb', borderRadius: '4px', backgroundColor: '#fafafa', fontSize: '12px', fontFamily: 'Kanit' }}
          />
          <input 
            type="text" placeholder="ชื่อผู้ใช้" required
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            style={{ padding: '10px', border: '1px solid #dbdbdb', borderRadius: '4px', backgroundColor: '#fafafa', fontSize: '12px', fontFamily: 'Kanit' }}
          />
          <input 
            type="password" placeholder="รหัสผ่าน" required
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={{ padding: '10px', border: '1px solid #dbdbdb', borderRadius: '4px', backgroundColor: '#fafafa', fontSize: '12px', fontFamily: 'Kanit' }}
          />
          
          {/* 👇 กล่องแนะนำรหัสผ่านแบบ Real-time 👇 */}
          <div style={{ fontSize: '12px', textAlign: 'left', marginTop: '5px', marginBottom: '5px', background: '#f8f9fa', padding: '10px', borderRadius: '6px', border: '1px solid #efefef' }}>
             <div style={{ color: '#262626', fontWeight: 'bold', marginBottom: '5px' }}>รหัสผ่านของคุณต้องมี:</div>
             <div style={{ color: isLengthValid ? '#28a745' : '#ed4956', transition: '0.3s' }}>
                {isLengthValid ? '✅' : '❌'} ความยาวอย่างน้อย 6 ตัวอักษร
             </div>
             <div style={{ color: hasLetterAndNumber ? '#28a745' : '#ed4956', transition: '0.3s' }}>
                {hasLetterAndNumber ? '✅' : '❌'} มีตัวอักษรภาษาอังกฤษและตัวเลข
             </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !isPasswordStrong} // 👈 ล็อกปุ่มถ้ารหัสยังไม่แข็งแกร่งพอ!
            style={{ 
              background: (loading || !isPasswordStrong) ? '#b2dffc' : '#0095f6', 
              color: '#fff', 
              border: 'none', 
              padding: '8px', 
              borderRadius: '4px', 
              fontWeight: 'bold', 
              cursor: (loading || !isPasswordStrong) ? 'not-allowed' : 'pointer', 
              marginTop: '5px',
              fontFamily: 'Kanit',
              transition: '0.3s'
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