import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      // ล้างข้อมูล Session/Localstorage ตรงนี้ถ้ามี
      navigate('/login');
    }
  };

  // สไตล์พื้นฐานสำหรับ Link
  const linkStyle = {
    textDecoration: 'none',
    color: '#262626',
    fontWeight: '500',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    transition: 'color 0.2s'
  };

  return (
    <nav style={{ 
      position: 'fixed', top: 0, width: '100%', height: '60px', 
      background: 'rgba(255, 255, 255, 0.8)', 
      backdropFilter: 'blur(10px)', // ทำให้ Navbar ใสๆ เห็นพื้นหลังเบลอๆ
      borderBottom: '1px solid #dbdbdb', 
      display: 'flex', justifyContent: 'center', // จัดให้อยู่กลางหน้าจอ
      zIndex: 1000 
    }}>
      <div style={{ 
        width: '100%', maxWidth: '1100px', // กำหนดความกว้างให้เท่ากับ Content หน้า Home
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '0 20px' 
      }}>
        
        {/* Logo */}
        <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', textDecoration: 'none', color: '#000', fontFamily: 'Kanit' }}>
          MyGram
        </Link>
        
        {/* Menu Items */}
        <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
          
          <Link to="/" style={linkStyle}>
            <span>🏠</span> หน้าหลัก
          </Link>

          {/* --- ปุ่มกลุ่ม (ที่เพิ่มใหม่) --- */}
          <Link to="/group" style={linkStyle}>
            <span>👥</span> กลุ่ม
          </Link>

          <Link to="/chat" style={{ ...linkStyle, position: 'relative' }}>
            <span>💬</span> แชท
            {/* ตัวเลขแจ้งเตือน */}
            <span style={{ 
              position: 'absolute', top: '-8px', right: '-12px', 
              background: '#ed4956', color: 'white', borderRadius: '50%', 
              width: '18px', height: '18px', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' 
            }}>
              3
            </span>
          </Link>

          <Link to="/profile" style={linkStyle}>
            <span>👤</span> โปรไฟล์
          </Link>
          
          {/* ปุ่ม Logout */}
          <button 
            onClick={handleLogout}
            style={{ 
              background: '#fff', border: '1px solid #ed4956', color: '#ed4956', 
              padding: '6px 15px', borderRadius: '20px', cursor: 'pointer', 
              fontWeight: 'bold', fontSize: '13px', transition: '0.3s'
            }}
            onMouseOver={(e) => { e.target.style.background = '#ed4956'; e.target.style.color = '#fff'; }}
            onMouseOut={(e) => { e.target.style.background = '#fff'; e.target.style.color = '#ed4956'; }}
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;