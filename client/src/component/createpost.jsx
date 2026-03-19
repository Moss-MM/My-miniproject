import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = () => {
  const [desc, setDesc] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showImgInput, setShowImgInput] = useState(false); 

  // 👇 1. ดึงข้อมูลคนล็อกอินมาเตรียมไว้ใช้เปลี่ยนชื่อ
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const handlePost = async (e) => {
    e.preventDefault();
    if (!desc.trim() && !imgUrl.trim()) return; 

    setLoading(true);

    try {
      if (!loggedInUser) {
        alert("❌ กรุณาเข้าสู่ระบบก่อนโพสต์");
        setLoading(false);
        return;
      }
      
      const newPost = {
        userId: loggedInUser.id || loggedInUser._id, 
        desc: desc.trim(),
        img: imgUrl.trim()
      };

      const response = await axios.post('https://mygram-backend-yiba.onrender.com/api/posts', newPost);

      if (response.status === 200) {
        setDesc(""); 
        setImgUrl(""); 
        setShowImgInput(false); 
        window.location.reload(); 
      }

    } catch (err) {
      console.error(err);
      alert("❌ เกิดข้อผิดพลาดในการโพสต์");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.9)', 
      backdropFilter: 'blur(10px)',
      borderRadius: '15px', 
      padding: '20px', 
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.05)', 
      border: '1px solid rgba(255,255,255,0.4)',
      marginBottom: '20px',
      fontFamily: 'Kanit'
    }}>
      <div style={{ display: 'flex', gap: '15px' }}>
        
        {/* 👇 2. เปลี่ยนรูปโปรไฟล์ในกล่องโพสต์ ให้ตรงกับคนล็อกอิน */}
        <img 
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${loggedInUser ? loggedInUser.username : "Guest"}`} 
          alt="profile" 
          style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e1e8ed' }} 
        />

        <div style={{ flex: 1 }}>
          {/* 👇 3. เปลี่ยนคำว่า Moss เป็นชื่อ username ของคนที่ล็อกอินอยู่ */}
          <textarea
            placeholder={`คุณกำลังคิดอะไรอยู่ ${loggedInUser ? loggedInUser.username : ""} ?`}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            style={{ 
              width: '100%', 
              border: 'none', 
              outline: 'none', 
              resize: 'none', 
              fontSize: '16px', 
              fontFamily: 'Kanit', 
              minHeight: '40px', 
              background: 'transparent',
              paddingTop: '10px'
            }}
          />

          {imgUrl && (
            <div style={{ position: 'relative', marginTop: '10px' }}>
              <img 
                src={imgUrl} 
                alt="preview" 
                style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px' }}
                onError={(e) => e.target.style.display = 'none'} 
              />
              <button 
                onClick={() => setImgUrl("")}
                style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>
          )}

          {showImgInput && (
            <input 
              type="text" 
              placeholder="วางลิงก์รูปภาพ (Image URL) ตรงนี้..." 
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              autoFocus
              style={{ 
                width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', 
                border: '1px solid #e1e8ed', marginTop: '10px', fontSize: '14px', fontFamily: 'Kanit', outline: 'none' 
              }}
            />
          )}

          <hr style={{ border: 'none', borderTop: '1px solid #e1e8ed', margin: '15px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            
            <button 
              type="button"
              onClick={() => setShowImgInput(!showImgInput)} 
              style={{ 
                background: 'transparent', border: 'none', color: '#0095f6', cursor: 'pointer', 
                display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600', fontFamily: 'Kanit', fontSize: '14px', padding: '5px 10px', borderRadius: '8px'
              }}
            >
              🖼️ รูปภาพ/วิดีโอ
            </button>
            
            <button
              onClick={handlePost}
              disabled={(!desc.trim() && !imgUrl.trim()) || loading}
              style={{ 
                background: (!desc.trim() && !imgUrl.trim()) ? '#b2dffc' : '#0095f6', 
                color: '#fff', border: 'none', padding: '8px 25px', borderRadius: '20px', 
                fontWeight: 'bold', fontFamily: 'Kanit', fontSize: '15px',
                cursor: (!desc.trim() && !imgUrl.trim()) ? 'default' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'กำลังแชร์...' : 'โพสต์'}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;