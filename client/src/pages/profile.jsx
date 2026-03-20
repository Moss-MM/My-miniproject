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
      const res = await axios.put(`https://mygram-backend-yiba.onrender.com/api/auth/update/${loggedInUser.id || loggedInUser._id}`, {
        username,
        email
      });

      // ✅ อัปเดตข้อมูลใน localStorage 
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      alert("🎉 อัปเดตข้อมูลโปรไฟล์สำเร็จแล้ว!");
      window.location.href = "/"; // กลับหน้าหลัก
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการอัปเดต");
    } finally {
      setLoading(false);
    }
  };

  // สไตล์สำหรับกล่องต่างๆ (สไตล์เดียวกับหน้า Home)
  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.9)', 
    backdropFilter: 'blur(10px)',
    borderRadius: '15px', 
    border: '1px solid rgba(255,255,255,0.5)', 
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', 
      minHeight: '100vh', 
      fontFamily: 'Kanit',
      backgroundAttachment: 'fixed'
    }}>
      <Navbar />
      
      <div style={{ paddingTop: '90px', paddingBottom: '50px', maxWidth: '1000px', margin: '0 auto', paddingLeft: '20px', paddingRight: '20px' }}>
        
        {/* ======================= ส่วนหัว (Cover & Profile Info) ======================= */}
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden', marginBottom: '25px' }}>
          {/* รูปหน้าปก (Cover Photo) */}
          <div style={{ height: '200px', background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)' }}></div>
          
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-75px' }}>
             <img 
               src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} 
               alt="profile"
               style={{ width: '130px', height: '130px', borderRadius: '50%', border: '5px solid #fff', backgroundColor: '#f0f0f0', objectFit: 'cover', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} 
             />
             <h1 style={{ margin: '15px 0 5px 0', color: '#1c1e21', fontSize: '26px' }}>{username || "ผู้ใช้งาน"}</h1>
             <p style={{ margin: 0, color: '#65676b', fontSize: '15px' }}>{email || "ยังไม่ได้ตั้งค่าอีเมล"}</p>
             
             {/* Stats (ตัวเลขโชว์ความเท่) */}
             <div style={{ display: 'flex', gap: '40px', marginTop: '20px', borderTop: '1px solid #efefef', paddingTop: '20px', width: '100%', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '22px', color: '#1c1e21' }}>15</div>
                  <div style={{ fontSize: '13px', color: '#888' }}>โพสต์ทั้งหมด</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '22px', color: '#1c1e21' }}>128</div>
                  <div style={{ fontSize: '13px', color: '#888' }}>เพื่อน</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '22px', color: '#1c1e21' }}>1.2k</div>
                  <div style={{ fontSize: '13px', color: '#888' }}>ถูกใจ</div>
                </div>
             </div>
          </div>
        </div>

        {/* ======================= ส่วนเนื้อหาแบ่ง 2 ฝั่ง ======================= */}
        <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>
            
            {/* --- ฝั่งซ้าย: ข้อมูลส่วนตัว (About Me) --- */}
            <div style={{ flex: '1 1 300px' }}>
                <div style={{ ...cardStyle, padding: '25px' }}>
                    <h3 style={{ borderBottom: '3px solid #0095f6', display: 'inline-block', paddingBottom: '5px', marginBottom: '20px', color: '#1c1e21' }}>📖 เกี่ยวกับฉัน</h3>
                    <p style={{ color: '#4b4f56', lineHeight: '1.6' }}>สวัสดี! ฉันชื่อ <b>{username}</b> ยินดีที่ได้รู้จักทุกคนบน MyGram ตอนนี้กำลังสนุกกับการสร้างโปรเจคใหม่ๆ อยู่ครับ 🚀</p>
                    
                    <div style={{ marginTop: '20px', fontSize: '14px', color: '#65676b', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>📍 <span>อาศัยอยู่ที่: ประเทศไทย</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>🎓 <span>การศึกษา: ม.ราชมงคลธัญบุรี (RMUTT)</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>💻 <span>อาชีพ: Full-Stack Developer</span></div>
                    </div>
                </div>
            </div>

            {/* --- ฝั่งขวา: ฟอร์มแก้ไขข้อมูลของเดิมของคุณมอส --- */}
            <div style={{ flex: '2 1 400px' }}>
                <div style={{ ...cardStyle, padding: '30px' }}>
                    <h3 style={{ marginBottom: '25px', color: '#1c1e21' }}>⚙️ ตั้งค่าและแก้ไขโปรไฟล์</h3>
                    
                    <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ fontWeight: 'bold', color: '#4b4f56', fontSize: '14px' }}>ชื่อผู้ใช้งาน (Username)</label>
                            <input 
                              type="text" value={username} onChange={(e) => setUsername(e.target.value)} 
                              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #dbdbdb', marginTop: '8px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Kanit' }} 
                            />
                        </div>
                        <div>
                            <label style={{ fontWeight: 'bold', color: '#4b4f56', fontSize: '14px' }}>อีเมล (Email)</label>
                            <input 
                              type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #dbdbdb', marginTop: '8px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Kanit' }} 
                            />
                        </div>
                        <button 
                          type="submit" disabled={loading} 
                          style={{ background: '#0095f6', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', fontSize: '16px', transition: '0.3s' }}
                        >
                            {loading ? "กำลังบันทึกข้อมูล..." : "💾 บันทึกการเปลี่ยนแปลง"}
                        </button>
                    </form>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;