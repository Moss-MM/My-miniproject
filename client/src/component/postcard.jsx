import React, { useState } from 'react';
import axios from 'axios';

const Postcard = ({ post }) => {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const myId = loggedInUser?.id || loggedInUser?._id;
  
  const postId = post?._id || post?.id;

  const validLikes = Array.isArray(post?.likes) ? post.likes : [];
  const validComments = Array.isArray(post?.comments) ? post.comments : [];

  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState(validComments);
  const [likes, setLikes] = useState(typeof post.likes === 'number' ? post.likes : validLikes.length);
  const [isLiked, setIsLiked] = useState(post.isLiked || validLikes.includes(myId));
  const [isRequested, setIsRequested] = useState(false); 

  const handleLike = async () => {
    try {
      if (!myId) return alert("กรุณาล็อกอินก่อนครับ");
      await axios.put(`https://mygram-backend-yiba.onrender.com/api/posts/${postId}/like`, { userId: myId });
      setLikes(isLiked ? likes - 1 : likes + 1);
      setIsLiked(!isLiked);
    } catch (err) { console.error(err); }
  };

  const handleAddComment = async (e) => {
    if (e.key === 'Enter' && comment.trim() !== "") {
      if (!myId) return alert("กรุณาล็อกอินก่อนคอมเมนต์ครับ!");

      const newComment = { 
        userId: myId, 
        username: loggedInUser.username, 
        text: comment 
      };

      const previousComments = [...allComments];
      setAllComments([...allComments, newComment]); 
      setComment(""); 

      try {
        const res = await axios.put(`https://mygram-backend-yiba.onrender.com/api/posts/${postId}/comment`, newComment);
        if (res.data && res.data.comments) {
          setAllComments(res.data.comments);
        }
      } catch (err) { 
        console.error("คอมเมนต์พัง:", err); 
        alert("เซิร์ฟเวอร์มีปัญหา ส่งคอมเมนต์ไม่สำเร็จครับ 😥");
        setAllComments(previousComments); 
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm("คุณแน่ใจนะว่าจะลบโพสต์นี้?")) {
      try {
        await axios.delete(`https://mygram-backend-yiba.onrender.com/api/posts/${postId}`, { data: { userId: myId } });
        window.location.reload();
      } catch (err) { console.error(err); }
    }
  };

  const handleAddFriend = async () => {
    try {
      await axios.put(`https://mygram-backend-yiba.onrender.com/api/auth/${post.authorId}/friend-request`, { userId: myId });
      alert("✅ ส่งคำขอเป็นเพื่อนไปแล้ว รอเขากดยอมรับนะ!");
      setIsRequested(true); 
    } catch (err) { 
      alert(err.response?.data || "เกิดข้อผิดพลาดในการส่งคำขอ"); 
    }
  };

  return (
    <div style={{ background: '#fff', border: '1px solid #dbdbdb', borderRadius: '15px', marginBottom: '20px', maxWidth: '100%', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', fontFamily: 'Kanit' }}>
      
      {/* ================= Header ================= */}
      <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* 👇 ซ่อมรูปโปรไฟล์หน้าโพสต์แล้ว ดึงรูปจริงมาโชว์ + ใส่ objectFit */}
          <img 
            src={post.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.username}`} 
            style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f0f0f0', border: '1px solid #efefef', objectFit: 'cover' }} 
            alt="avatar" 
          />
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#262626' }}>{post.username}</span>
              
              {loggedInUser && post.authorId && post.authorId !== myId && (
                 <button 
                   onClick={handleAddFriend} 
                   disabled={isRequested} 
                   style={{ 
                     background: isRequested ? '#efefef' : '#0095f6', 
                     color: isRequested ? '#8e8e8e' : '#fff', 
                     border: 'none', 
                     padding: '3px 10px', 
                     borderRadius: '6px', 
                     fontSize: '12px', 
                     fontWeight: 'bold', 
                     cursor: isRequested ? 'default' : 'pointer', 
                     transition: '0.2s' 
                   }}
                 >
                   {isRequested ? '⏳ รอยืนยัน' : '➕ เพิ่มเพื่อน'}
                 </button>
              )}
            </div>
            {post.time && (
              <span style={{ fontSize: '12px', color: '#8e8e8e', marginTop: '2px' }}>{post.time}</span>
            )}
          </div>
        </div>

        {loggedInUser && (loggedInUser.username === post.username) && (
          <button onClick={handleDelete} style={{ background: 'none', border: 'none', color: '#ed4956', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>ลบโพสต์</button>
        )}
      </div>
      
      {/* ================= Content ================= */}
      {post.mediaUrl ? (
        <div style={{ width: '100%', maxHeight: '500px', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {post.type === 'video' ? <video src={post.mediaUrl} controls style={{ width: '100%', height: 'auto', objectFit: 'contain' }} /> : <img src={post.mediaUrl} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} alt="post" onError={(e) => e.target.style.display = 'none'} />}
        </div>
      ) : (
        <div style={{ width: '100%', padding: '40px 20px', backgroundColor: '#f8f9fa', textAlign: 'center', fontSize: '18px', borderTop: '1px solid #efefef', borderBottom: '1px solid #efefef', wordBreak: 'break-word', color: '#262626', boxSizing: 'border-box' }}>
          {post.caption || post.desc}
        </div>
      )}

      {/* ================= Footer ================= */}
      <div style={{ padding: '15px' }}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '10px', alignItems: 'center' }}>
          <span onClick={handleLike} style={{ cursor: 'pointer', fontSize: '24px', transition: '0.2s', transform: isLiked ? 'scale(1.1)' : 'scale(1)' }}>{isLiked ? '❤️' : '🤍'}</span>
          <span style={{ fontSize: '24px', cursor: 'pointer' }}>💬</span>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#262626' }}>{likes} ถูกใจ</span>
        </div>
        
        {post.mediaUrl && (
          <div style={{ marginBottom: '8px', fontSize: '15px', color: '#262626' }}><b>{post.username}</b> {post.caption || post.desc}</div>
        )}

        <div style={{ marginTop: '10px', fontSize: '14px', borderTop: '1px solid #efefef', paddingTop: '10px', color: '#4b4f56' }}>
          {allComments && allComments.length > 0 && allComments.map((c, i) => (
            <div key={i} style={{ marginBottom: '5px' }}><b>{c.username}:</b> {c.text}</div>
          ))}
        </div>

        <input type="text" placeholder="เพิ่มคอมเมนต์..." value={comment} onChange={(e) => setComment(e.target.value)} onKeyPress={handleAddComment} style={{ width: '100%', border: 'none', borderTop: '1px solid #efefef', marginTop: '10px', padding: '15px 0 0 0', outline: 'none', fontFamily: 'Kanit', fontSize: '14px' }} />
      </div>
    </div>
  );
};

export default Postcard;