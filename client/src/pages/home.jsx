import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import Navbar from '../component/navbar';
import Postcard from '../component/postcard';
import CreatePost from '../component/createpost';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]);

  // 👇 1. ดึงข้อมูลผู้ใช้ที่กำลังล็อกอินอยู่จาก localStorage
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  // ฟังก์ชันดึงโพสต์ 
  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts');
      
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
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการดึงโพสต์:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = (id) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 } : post
    ));
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
        display: 'flex', justifyContent: 'center', gap: '25px', 
        paddingTop: '100px', 
        paddingBottom: '50px',
        paddingLeft: '20px',
        paddingRight: '20px',
        maxWidth: '1100px', 
        margin: '0 auto'
      }}>
        
        {/* --- ฝั่งซ้าย: Profile Card --- */}
        <div style={{ width: '250px', display: 'none', display: 'block' }}>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.8)', 
            backdropFilter: 'blur(10px)',
            borderRadius: '15px', border: '1px solid rgba(255,255,255,0.3)', 
            overflow: 'hidden',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
          }}>
            <div style={{ height: '70px', background: 'linear-gradient(45deg, #0095f6, #00f2fe)' }}></div>
            <div style={{ padding: '15px', textAlign: 'center', marginTop: '-40px' }}>
              
              {/* 👇 2. เปลี่ยนรูปโปรไฟล์ให้ใช้ชื่อ username สุ่มหน้าตาให้ */}
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${loggedInUser ? loggedInUser.username : "Guest"}`} 
                alt="profile" 
                style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid #fff', backgroundColor: '#fff' }} 
              />
              
              {/* 👇 3. เปลี่ยนชื่อให้ดึงมาจากฐานข้อมูล */}
              <div style={{ fontWeight: 'bold', marginTop: '10px', fontSize: '18px' }}>
                {loggedInUser ? loggedInUser.username : "ผู้ใช้งานทั่วไป"}
              </div>
              
              {/* 👇 4. เปลี่ยน Tag @ ด้านล่าง */}
              <div style={{ fontSize: '13px', color: '#65676b' }}>
                @{loggedInUser ? loggedInUser.username.toLowerCase() : "guest"}
              </div>

            </div>
          </div>
        </div>

        {/* --- ฝั่งกลาง: Feed --- */}
        <div style={{ maxWidth: '500px', width: '100%' }}>
          <CreatePost />
          
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            {posts.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888' }}>กำลังโหลดข้อมูล...</p>
            ) : (
              posts.map((item) => (
                <Postcard key={item.id} post={item} onLike={() => handleLike(item.id)} />
              ))
            )}
            
          </div>
        </div>

        {/* --- ฝั่งขวา: Trending --- */}
        <div style={{ width: '300px', display: 'none', display: 'block' }}>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.8)', 
            backdropFilter: 'blur(10px)',
            padding: '20px', borderRadius: '15px', 
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#1c1e21' }}>Trending</h3>
            <div style={{ color: '#0095f6', fontWeight: '600' }}>#RMUTT_Project</div>
            <div style={{ fontSize: '12px', color: '#65676b', marginBottom: '10px' }}>1.2k posts</div>
            <div style={{ color: '#0095f6', fontWeight: '600' }}>#ReactJS</div>
            <div style={{ fontSize: '12px', color: '#65676b' }}>850 posts</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;