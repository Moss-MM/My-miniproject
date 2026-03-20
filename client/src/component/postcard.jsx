import React, { useState } from 'react';
import axios from 'axios';

const Postcard = ({ post }) => {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const myId = loggedInUser?.id || loggedInUser?._id;
  
  // ป้องกัน ID โพสต์หาย (ดักทั้ง _id และ id)
  const postId = post?._id || post?.id;

  const validLikes = Array.isArray(post?.likes) ? post.likes : [];
  const validComments = Array.isArray(post?.comments) ? post.comments : [];

  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState(validComments);
  const [likes, setLikes] = useState(validLikes.length);
  const [isLiked, setIsLiked] = useState(validLikes.includes(myId));

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
      try {
        const res = await axios.put(`https://mygram-backend-yiba.onrender.com/api/posts/${postId}/comment`, {
          userId: myId,
          username: loggedInUser.username,
          text: comment
        });
        setAllComments(res.data.comments);
        setComment("");
      } catch (err) { console.error(err); }
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

  return (
    <div style={{ background: '#fff', border: '1px solid #dbdbdb', borderRadius: '12px', marginBottom: '20px', maxWidth: '500px', margin: '0 auto 20px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontFamily: 'Kanit' }}>
      <div style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* 👇 แก้ไขส่วน Header โพสต์: เพิ่มวันที่และเวลาตรงนี้ 👇 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.username}`} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f0f0f0' }} alt="avatar" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 'bold' }}>{post.username}</span>
            {post.createdAt && (
              <span style={{ fontSize: '12px', color: '#8e8e8e' }}>
                {new Date(post.createdAt).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })} น.
              </span>
            )}
          </div>
        </div>
        {/* 👆 สิ้นสุดส่วนที่แก้ไข 👆 */}

        {loggedInUser && (loggedInUser.username === post.username) && (
          <button onClick={handleDelete} style={{ background: 'none', border: 'none', color: '#ed4956', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>ลบโพสต์</button>
        )}
      </div>
      
      {post.mediaUrl && (
        <div style={{ width: '100%', maxHeight: '500px', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {post.type === 'image' ? <img src={post.mediaUrl} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} alt="post" /> : <video src={post.mediaUrl} controls style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />}
        </div>
      )}

      <div style={{ padding: '12px' }}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '10px', alignItems: 'center' }}>
          <span onClick={handleLike} style={{ cursor: 'pointer', fontSize: '24px' }}>{isLiked ? '❤️' : '🤍'}</span>
          <span style={{ fontSize: '24px' }}>💬</span>
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{likes} likes</span>
        </div>
        
        <div style={{ marginBottom: '8px' }}><b>{post.username}</b> {post.desc || post.caption}</div>

        <div style={{ marginTop: '10px', fontSize: '14px', borderTop: '1px solid #fafafa', paddingTop: '10px' }}>
          {allComments && allComments.length > 0 && allComments.map((c, i) => (
            <div key={i} style={{ marginBottom: '4px' }}><b>{c.username}:</b> {c.text}</div>
          ))}
        </div>

        <input type="text" placeholder="เพิ่มคอมเมนต์..." value={comment} onChange={(e) => setComment(e.target.value)} onKeyPress={handleAddComment} style={{ width: '100%', border: 'none', borderTop: '1px solid #efefef', marginTop: '10px', padding: '12px 0 0 0', outline: 'none', fontFamily: 'Kanit' }} />
      </div>
    </div>
  );
};

export default Postcard;