import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Link } from 'react-router-dom'; 
import Navbar from '../component/navbar';
import Postcard from '../component/postcard';
import CreatePost from '../component/createpost';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]);
  
  // 👇 State สำหรับเก็บคำขอเป็นเพื่อน
  const [friendRequests, setFriendRequests] = useState([]);

  // ดึงข้อมูลผู้ใช้ที่กำลังล็อกอินอยู่
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const myId = loggedInUser?.id || loggedInUser?._id;

  // ฟังก์ชันดึงโพสต์ 
  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://mygram-backend-yiba.onrender.com/api/posts');
      const realPosts = response.data.map((post) => ({
        id: post._id,              
        username: post.userId?.username || "ไม่ทราบชื่อผู้ใช้", 
        type: post.img && post.img.includes('.mp4') ? 'video' : 'image', 
        mediaUrl: post.img,        
        caption: post.desc,        
        likes: post.likes.length,  
        isLiked: false,            
        time: new Date(post.createdAt).toLocaleDateString('th-TH') 
      }));
      setPosts(realPosts); 
    } catch (err) { console.error("เกิดข้อผิดพลาดในการดึงโพสต์:", err); }
  };

  // 👇 ฟังก์ชันดึงรายชื่อคนขอเป็นเพื่อน
  const fetchFriendRequests = async () => {
    if (!myId) return;
    try {
      // หมายเหตุ: สมมติว่าไฟล์ API User ของคุณมอสใช้ path ว่า /api/users นะครับ
      const res = await axios.get(`https://mygram-backend-yiba.onrender.com/api/users/${myId}/friend-requests`);
      setFriendRequests(res.data);
    } catch (err) { console.error("ดึงคำขอเพื่อนพลาด:", err); }
  };

  useEffect(() => {
    fetchPosts();
    fetchFriendRequests(); // เรียกใช้ตอนเปิดหน้าเว็บ
  }, []);

  const handleLike = (id) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 } : post
    ));
  };

  // 👇 ฟังก์ชันกดยอมรับเพื่อน
  const handleAcceptFriend = async (senderId) => {
    try {
      await axios.put(`https://mygram-backend-yiba.onrender.com/api/users/${myId}/accept-friend`, { userId: senderId });
      // พอกดรับเสร็จ ให้เอากล่องคนนั้นออกจากหน้าจอ
      setFriendRequests(friendRequests.filter(req => req._id !== senderId));
      alert("🎉 รับเป็นเพื่อนเรียบร้อย!");
    } catch (err) { console.error(err); alert("เกิดข้อผิดพลาด"); }
  };

  // 👇 ฟังก์ชันกดปฏิเสธเพื่อน
  const handleDeclineFriend = async (senderId) => {
    try {
      await axios.put(`https://mygram-backend-yiba.onrender.com/api/users/${myId}/decline-friend`, { userId: senderId });
      // พอกดปฏิเสธ ก็เอากล่องคนนั้นออกจากหน้าจอเหมือนกัน
      setFriendRequests(friendRequests.filter(req => req._id !== senderId));
    } catch (err) { console.error(err); }
  };

  // สไตล์สำหรับกล่องต่างๆ
  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.9)', 
    backdropFilter: 'blur(10px)',
    borderRadius: '15px', 
    border: '1px solid rgba(255,255,255,0.5)', 
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
    marginBottom: '20px'
  };

  const menuStyle = {
    display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 20px', 
    color: '#4b4f56', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px',
    borderBottom: '1px solid #f0f2f5', transition: '0.2s'
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh', 
      fontFamily: 'Kanit',
      backgroundAttachment: 'fixed' 
    }}>
      <Navbar />
      
      <div style={{ 
        display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap', gap: '25px', 
        paddingTop: '90px', paddingBottom: '50px', paddingLeft: '20px', paddingRight: '20px',
        maxWidth: '1200px', margin: '0 auto'
      }}>
        
        {/* ======================= ฝั่งซ้าย: Profile & Menu ======================= */}
        <div style={{ flex: '0 0 260px', width: '260px' }}>
          <div style={cardStyle}>
            <div style={{ height: '80px', background: 'linear-gradient(45deg, #0095f6, #00f2fe)' }}></div>
            <div style={{ padding: '15px', textAlign: 'center', marginTop: '-50px' }}>
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${loggedInUser ? loggedInUser.username : "Guest"}`} 
                alt="profile" 
                style={{ width: '90px', height: '90px', borderRadius: '50%', border: '4px solid #fff', backgroundColor: '#fff', objectFit: 'cover' }} 
              />
              <div style={{ fontWeight: 'bold', marginTop: '10px', fontSize: '18px', color: '#1c1e21' }}>
                {loggedInUser ? loggedInUser.username : "ผู้ใช้งานทั่วไป"}
              </div>
              <div style={{ fontSize: '13px', color: '#65676b', marginBottom: '10px' }}>
                @{loggedInUser ? loggedInUser.username.toLowerCase() : "guest"}
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <Link to="/profile" style={menuStyle}>👤 หน้าโปรไฟล์ของฉัน</Link>
            <Link to="/group" style={menuStyle}>👥 กลุ่มและชุมชน</Link>
            <Link to="/chat" style={menuStyle}>💬 ข้อความแชท</Link>
            <Link to="/pages" style={menuStyle}>📄 เพจที่ถูกใจ</Link>
          </div>
        </div>

        {/* ======================= ฝั่งกลาง: Feed ======================= */}
        <div style={{ flex: '1 1 500px', maxWidth: '600px', width: '100%' }}>
          <CreatePost />
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {posts.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#888', padding: '40px', background: '#fff', borderRadius: '15px' }}>
                กำลังโหลดเรื่องราวสนุกๆ...
              </div>
            ) : (
              posts.map((item) => (
                <Postcard key={item.id} post={item} onLike={() => handleLike(item.id)} />
              ))
            )}
          </div>
        </div>

        {/* ======================= ฝั่งขวา: Widgets (Trending, Events, Requests) ======================= */}
        <div style={{ flex: '0 0 300px', width: '300px' }}>
          
          {/* กิจกรรมที่จะเกิดขึ้น */}
          <div style={{ ...cardStyle, padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '15px', color: '#1c1e21', textAlign: 'center' }}>📅 กิจกรรมที่กำลังจะมาถึง</h3>
            <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" alt="Event" style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} />
            <div style={{ fontWeight: 'bold', textAlign: 'center', color: '#1c1e21' }}>ปัจฉิมนิเทศ RMUTT</div>
            <div style={{ fontSize: '13px', color: '#65676b', textAlign: 'center', marginBottom: '10px' }}>วันศุกร์ 15:00 น.</div>
            <button style={{ width: '100%', background: '#efefef', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>ดูรายละเอียด</button>
          </div>

          {/* 👇 คำขอเป็นเพื่อน (ต่อกับ API จริงแล้ว!) 👇 */}
          <div style={{ ...cardStyle, padding: '20px' }}>
             <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '15px', color: '#1c1e21', textAlign: 'center' }}>🤝 คำขอเป็นเพื่อน</h3>
             
             {friendRequests.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#888', fontSize: '13px' }}>ยังไม่มีคำขอใหม่ในตอนนี้</div>
             ) : (
                friendRequests.map(req => (
                  <div key={req._id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #f0f2f5', paddingBottom: '15px' }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.username}`} alt="avatar" style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#f0f0f0', marginBottom: '10px' }} />
                    <div style={{ fontWeight: 'bold', color: '#1c1e21', marginBottom: '15px' }}>{req.username}</div>
                    <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                      <button onClick={() => handleAcceptFriend(req._id)} style={{ flex: 1, background: '#28a745', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>✓ รับ</button>
                      <button onClick={() => handleDeclineFriend(req._id)} style={{ flex: 1, background: '#ed4956', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>✗ ปฏิเสธ</button>
                    </div>
                  </div>
                ))
             )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Home;