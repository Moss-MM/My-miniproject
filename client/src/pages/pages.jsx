import React, { useState } from 'react';
import Navbar from '../component/navbar';
import Postcard from '../component/postcard';

const Page = () => {
  const [isFollowing, setIsFollowing] = useState(false);

  // ข้อมูลโพสต์เฉพาะของเพจนี้
  const pagePosts = [
    {
      id: 101,
      username: "RMUTT Tech Page",
      type: "image",
      mediaUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
      caption: "วันนี้มีเวิร์กชอปเขียน React ฟรีที่คณะ! 💻 #RMUTT #ReactJS",
      likes: 450
    }
  ];

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ paddingTop: '60px', maxWidth: '800px', margin: '0 auto' }}>
        {/* 1. Header & Cover Photo Section */}
        <div style={{ background: '#fff', border: '1px solid #dbdbdb', borderRadius: '0 0 15px 15px', overflow: 'hidden', marginBottom: '20px' }}>
          {/* รูปปก (Cover) */}
          <div style={{ height: '200px', background: 'linear-gradient(135deg, #0095f6 0%, #00c6ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <h1 style={{ color: 'white', opacity: 0.5 }}>RMUTT TECHNOLOGY</h1>
          </div>
          
          {/* ข้อมูลเพจ (Profile Info) */}
          <div style={{ padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '25px', marginTop: '-50px' }}>
            <div style={{ 
              width: '120px', height: '120px', borderRadius: '50%', background: '#eee', 
              border: '5px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', overflow: 'hidden' 
            }}>
               <img src="https://api.dicebear.com/7.x/bottts/svg?seed=tech" alt="logo" />
            </div>
            
            <div style={{ marginTop: '55px', flex: 1 }}>
              <h2 style={{ margin: 0 }}>RMUTT ComTech Page </h2>
              <p style={{ color: '#8e8e8e', margin: '5px 0' }}>เพจอย่างเป็นทางการสำหรับอัปเดตข่าวสารไอที</p>
              
              <div style={{ display: 'flex', gap: '20px', margin: '15px 0' }}>
                <span><b>1.2k</b> ผู้ติดตาม</span>
                <span><b>45</b> กำลังติดตาม</span>
              </div>

              <button 
                onClick={() => setIsFollowing(!isFollowing)}
                style={{ 
                  background: isFollowing ? '#efefef' : '#0095f6', 
                  color: isFollowing ? '#000' : '#fff', 
                  border: 'none', padding: '8px 25px', borderRadius: '8px', 
                  fontWeight: 'bold', cursor: 'pointer', transition: '0.3s'
                }}
              >
                {isFollowing ? 'กำลังติดตาม' : 'ติดตามเพจ'}
              </button>
            </div>
          </div>
        </div>

        {/* 2. Page Timeline Section */}
        <div style={{ maxWidth: '470px', margin: '0 auto' }}>
          <h3 style={{ marginBottom: '15px' }}>โพสต์ล่าสุด</h3>
          {pagePosts.map((post) => (
            <Postcard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;