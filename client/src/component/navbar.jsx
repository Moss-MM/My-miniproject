import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client'; // 👈 นำเข้าเครื่องมือรับแชท

const Navbar = () => {
  const navigate = useNavigate();
  
  // 👇 สร้างหน่วยความจำสำหรับนับแจ้งเตือน
  const [notifications, setNotifications] = useState(0);
  
  // ดึงข้อมูลเราเองมาเช็คว่าแชทส่งมาหาเราไหม
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const myId = loggedInUser?.id || loggedInUser?._id;

  // 👇 ระบบดักจับข้อความแบบ Real-time
  useEffect(() => {
    if (!myId) return;

    // เชื่อมต่อไปที่หลังบ้าน (เปิดเรดาร์)
    const socket = io("https://mygram-backend-yiba.onrender.com");

    // บอกหลังบ้านว่า "ฉันออนไลน์อยู่นะ"
    socket.emit("add_user", myId);

    // นั่งรอฟังข้อความใหม่
    socket.on("receive_message", (data) => {
      // ถ้าข้อความที่ส่งมา มีไอดีผู้รับตรงกับไอดีของเรา = แจ้งเตือนเด้ง!
      if (data.receiverId === myId) {
        setNotifications((prev) => prev + 1);
      }
    });

    // ปิดเรดาร์เมื่อไม่ได้ใช้
    return () => {
      socket.disconnect();
    };
  }, [myId]);

  const handleLogout = () => {
    if (window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      localStorage.removeItem("user"); // 👈 ล้างข้อมูลจริงๆ เพื่อไม่ให้แอบเข้าหน้าอื่นได้
      navigate('/login');
      window.location.href = '/login'; // 👈 รีเฟรชหน้าเพื่อเคลียร์สถานะทั้งหมด
    }
  };

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
      backdropFilter: 'blur(10px)', 
      borderBottom: '1px solid #dbdbdb', 
      display: 'flex', justifyContent: 'center', 
      zIndex: 1000 
    }}>
      <div style={{ 
        width: '100%', maxWidth: '1100px', 
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

          <Link to="/group" style={linkStyle}>
            <span>👥</span> กลุ่ม
          </Link>

          {/* 👇 ปุ่มแชทที่อัปเกรดแล้ว! พอกดปุ๊บ แจ้งเตือนจะรีเซ็ตเป็น 0 */}
          <Link to="/chat" onClick={() => setNotifications(0)} style={{ ...linkStyle, position: 'relative' }}>
            <span>💬</span> แชท
            
            {/* โชว์จุดแดงเฉพาะตอนที่มีแจ้งเตือนมากกว่า 0 */}
            {notifications > 0 && (
              <span style={{ 
                position: 'absolute', top: '-8px', right: '-12px', 
                background: '#ed4956', color: 'white', borderRadius: '50%', 
                width: '18px', height: '18px', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold',
                boxShadow: '0 2px 5px rgba(237,73,86,0.5)' // เพิ่มเงาให้ดูป๊อปอัป
              }}>
                {notifications}
              </span>
            )}
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