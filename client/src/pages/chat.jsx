import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Navbar from '../component/navbar';

// เชื่อมต่อหลังบ้าน
const socket = io.connect("https://mygram-backend-yiba.onrender.com");

const Chat = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const [users, setUsers] = useState([]); // รายชื่อคนทั้งหมด
  const [currentChat, setCurrentChat] = useState(null); // คนที่เรากดเลือกคุยด้วย
  const [messages, setMessages] = useState([]); // ข้อความในห้องแชท
  const [newMessage, setNewMessage] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [showMediaInput, setShowMediaInput] = useState(false);
  const scrollRef = useRef(); // ตัวช่วยเลื่อนจอลงล่างสุดเวลาแชทเด้ง

  // 1. พอเปิดหน้าแชท -> แจ้ง Socket ว่าออนไลน์ & ดึงรายชื่อทุกคนมาโชว์
  useEffect(() => {
    if (loggedInUser) {
      const myId = loggedInUser.id || loggedInUser._id;
      socket.emit("add_user", myId);
      
      const fetchUsers = async () => {
        try {
          const res = await axios.get(`https://mygram-backend-yiba.onrender.com/api/messages/users/${myId}`);
          setUsers(res.data);
        } catch (err) { console.error("ดึงรายชื่อพลาด:", err); }
      };
      fetchUsers();
    }
  }, []);

  // 2. พอกดเลือกคุยกับใคร -> ไปดึง "ประวัติการแชท" ระหว่างเรากับเขามาจาก DB
  useEffect(() => {
    const getMessages = async () => {
      if (currentChat) {
        try {
          const myId = loggedInUser.id || loggedInUser._id;
          const res = await axios.get(`https://mygram-backend-yiba.onrender.com/api/messages/${myId}/${currentChat._id}`);
          setMessages(res.data);
        } catch (err) { console.error("ดึงประวัติแชทพลาด:", err); }
      }
    };
    getMessages();
  }, [currentChat]);

  // 3. ดักรอรับข้อความแบบ Real-time (ถ้าเพื่อนพิมพ์มาให้เด้งขึ้นจอทันที)
  useEffect(() => {
    const handleReceiveMsg = (data) => {
      // เช็คว่าข้อความที่เด้งมา เป็นของคนที่เปิดช่องแชทค้างไว้พอดีไหม
      if (currentChat && data.senderId === currentChat._id) {
        setMessages((prev) => [...prev, data]);
      }
    };
    socket.on("receive_message", handleReceiveMsg);
    return () => socket.off("receive_message", handleReceiveMsg);
  }, [currentChat]);

  // เลื่อนจอลงล่างสุดอัตโนมัติเวลามีแชทใหม่
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. ฟังก์ชันกดส่งข้อความ
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !mediaUrl.trim()) return;

    const myId = loggedInUser.id || loggedInUser._id;
    const messageData = {
      senderId: myId,
      receiverId: currentChat._id,
      text: newMessage,
      mediaUrl: mediaUrl.trim()
    };

    // ส่งให้เพื่อนผ่าน Socket
    socket.emit("send_message", messageData);

    try {
      // เซฟลง Database
      const res = await axios.post("https://mygram-backend-yiba.onrender.com/api/messages", messageData);
      setMessages([...messages, res.data]); // เอามาโชว์ฝั่งเราด้วย
      setNewMessage("");
      setMediaUrl("");
      setShowMediaInput(false);
    } catch (err) { console.error("ส่งแชทพลาด:", err); }
  };

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', fontFamily: 'Kanit' }}>
      <Navbar />
      
      <div style={{ paddingTop: '90px', display: 'flex', justifyContent: 'center', height: 'calc(100vh - 20px)', paddingBottom: '20px' }}>
        <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
          
          {/* 🌟 ฝั่งซ้าย: รายชื่อเพื่อน (รายชื่อคนทั้งหมดในเว็บ) */}
          <div style={{ width: '30%', borderRight: '1px solid #dbdbdb', background: '#fff', overflowY: 'auto' }}>
            <div style={{ padding: '20px', fontWeight: 'bold', fontSize: '18px', borderBottom: '1px solid #dbdbdb' }}>
              ข้อความส่วนตัว (DM)
            </div>
            {users.map((u) => (
              <div 
                key={u._id} 
                onClick={() => setCurrentChat(u)}
                style={{ 
                  padding: '15px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                  background: currentChat?._id === u._id ? '#f0f0f0' : '#fff',
                  borderBottom: '1px solid #fafafa', transition: '0.2s'
                }}
              >
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #ddd' }} alt="avatar" />
                <span style={{ fontWeight: '500' }}>{u.username}</span>
              </div>
            ))}
          </div>

          {/* 🌟 ฝั่งขวา: ห้องแชท 1-1 */}
          <div style={{ width: '70%', display: 'flex', flexDirection: 'column', background: '#e5ddd5' }}>
            {currentChat ? (
              <>
                {/* หัวห้องแชท */}
                <div style={{ padding: '15px 20px', background: '#fff', borderBottom: '1px solid #dbdbdb', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentChat.username}`} style={{ width: '40px', height: '40px', borderRadius: '50%' }} alt="avatar" />
                  <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{currentChat.username}</span>
                </div>

                {/* พื้นที่แสดงแชท */}
                <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                  {messages.map((m, index) => {
                    const isMe = m.senderId === (loggedInUser.id || loggedInUser._id);
                    return (
                      <div key={index} ref={scrollRef} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: '15px' }}>
                        <div style={{ maxWidth: '60%', background: isMe ? '#dcf8c6' : '#fff', padding: '10px 15px', borderRadius: '15px', borderTopRightRadius: isMe ? '0' : '15px', borderTopLeftRadius: !isMe ? '0' : '15px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                          
                          {/* โชว์รูป/วิดีโอ */}
                          {m.mediaUrl && (
                             m.mediaUrl.includes('.mp4') ? (
                               <video src={m.mediaUrl} controls style={{ width: '100%', borderRadius: '8px', marginBottom: '5px' }} />
                             ) : (
                               <img src={m.mediaUrl} alt="media" style={{ width: '100%', borderRadius: '8px', marginBottom: '5px' }} />
                             )
                          )}
                          
                          <div style={{ wordBreak: 'break-word', fontSize: '15px' }}>{m.text}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ช่องพิมพ์ข้อความ */}
                <div style={{ padding: '15px', background: '#f0f0f0' }}>
                  {showMediaInput && (
                    <input type="text" placeholder="วางลิงก์รูปภาพ หรือ วิดีโอ (URL) ตรงนี้..." value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px', boxSizing: 'border-box', outline: 'none', fontFamily: 'Kanit' }} />
                  )}
                  <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" onClick={() => setShowMediaInput(!showMediaInput)} style={{ background: '#fff', border: '1px solid #ddd', padding: '10px 15px', borderRadius: '20px', cursor: 'pointer' }}>📷</button>
                    <input type="text" placeholder="พิมพ์ข้อความ..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} style={{ flex: 1, padding: '10px 15px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none', fontFamily: 'Kanit' }} />
                    <button type="submit" style={{ background: '#0095f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'Kanit' }}>ส่ง</button>
                  </form>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#888', fontSize: '18px' }}>
                👈 เลือกรายชื่อเพื่อนด้านซ้ายเพื่อเริ่มแชทเลย!
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Chat;