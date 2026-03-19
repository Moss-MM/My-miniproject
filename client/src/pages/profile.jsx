import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../component/navbar';

const Profile = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const [username, setUsername] = useState(loggedInUser?.username || "");
  const [email, setEmail] = useState(loggedInUser?.email || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.put(`http://localhost:5000/api/auth/update/${loggedInUser.id || loggedInUser._id}`, {
        username,
        email
      });

      // ✅ จุดสำคัญ: อัปเดตข้อมูลใน localStorage ด้วย!
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      alert("อัปเดตข้อมูลสำเร็จแล้ว!");
      window.location.href = "/"; // กลับหน้าหลัก
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการอัปเดต");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh', fontFamily: 'Kanit' }}>
      <Navbar />
      <div style={{ paddingTop: '100px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: '#fff', padding: '40px', borderRadius: '15px', border: '1px solid #dbdbdb', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} 
            style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '20px', border: '2px solid #0095f6' }} 
            alt="profile"
          />
          
          <h2 style={{ marginBottom: '25px' }}>แก้ไขโปรไฟล์</h2>
          
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: '14px', color: '#8e8e8e' }}>ชื่อผู้ใช้งาน (Username)</label>
              <input 
                type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #dbdbdb', marginTop: '5px' }}
              />
            </div>

            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: '14px', color: '#8e8e8e' }}>อีเมล (Email)</label>
              <input 
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #dbdbdb', marginTop: '5px' }}
              />
            </div>

            <button 
              type="submit" disabled={loading}
              style={{ background: '#0095f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
            >
              {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Profile;