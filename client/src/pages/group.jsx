import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../component/navbar';

const Group = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // State สำหรับจัดการหน้า Feed ของกลุ่ม
  const [activeGroup, setActiveGroup] = useState(null); // กลุ่มที่กำลังกดเข้าไปดู
  const [groupPosts, setGroupPosts] = useState([]);
  const [newPostDesc, setNewPostDesc] = useState("");
  const [newPostImg, setNewPostImg] = useState("");

  const fetchGroups = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/groups");
      setGroups(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchGroups(); }, []);

  // โหลดโพสต์เฉพาะของกลุ่มที่เลือก
  const fetchGroupPosts = async (groupId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/group/${groupId}`);
      setGroupPosts(res.data);
    } catch (err) { console.error("ดึงโพสต์กลุ่มพลาด:", err); }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/groups", { name: newGroupName, desc: newGroupDesc, userId: loggedInUser.id || loggedInUser._id });
      alert("สร้างกลุ่มสำเร็จ!");
      setNewGroupName(""); setNewGroupDesc(""); setShowCreateForm(false);
      fetchGroups();
    } catch (err) { alert("เกิดข้อผิดพลาดในการสร้างกลุ่ม"); }
  };

  const handleJoinLeave = async (groupId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/groups/${groupId}/join`, { userId: loggedInUser.id || loggedInUser._id });
      alert(res.data);
      fetchGroups();
      if(activeGroup && activeGroup._id === groupId) setActiveGroup(null); // ถ้ากดออกกลุ่มตอนอยู่ในห้อง ให้เด้งกลับมาหน้ารวม
    } catch (err) { alert(err.response?.data || "เกิดข้อผิดพลาด"); }
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm("แน่ใจนะว่าจะยุบกลุ่มนี้ทิ้ง?")) {
      try {
        await axios.delete(`http://localhost:5000/api/groups/${groupId}`, { data: { userId: loggedInUser.id || loggedInUser._id } });
        alert("ลบกลุ่มเรียบร้อย");
        fetchGroups();
        setActiveGroup(null);
      } catch (err) { alert(err.response?.data || "ลบไม่ได้ครับ"); }
    }
  };

  // ฟังก์ชันโพสต์ลงในกลุ่ม
  const handleCreateGroupPost = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/posts", {
        userId: loggedInUser.id || loggedInUser._id,
        desc: newPostDesc,
        img: newPostImg,
        groupId: activeGroup._id // 👈 ชี้เป้าว่าโพสต์นี้เป็นของกลุ่มไหน
      });
      setNewPostDesc(""); setNewPostImg("");
      fetchGroupPosts(activeGroup._id); // รีเฟรชโพสต์
    } catch (err) { alert("โพสต์ไม่ได้ครับ"); }
  };

  // ฟังก์ชันลบโพสต์ในกลุ่ม
  const handleDeletePost = async (postId, postUserId) => {
    const myId = loggedInUser.id || loggedInUser._id;
    // ลบได้ถ้าเป็นเจ้าของโพสต์ หรือ เป็นเจ้าของกลุ่ม
    if (postUserId === myId || activeGroup.creatorId === myId) {
        if(window.confirm("ต้องการลบโพสต์นี้ใช่ไหม?")) {
            try {
                await axios.delete(`http://localhost:5000/api/posts/${postId}`, { data: { userId: myId } });
                fetchGroupPosts(activeGroup._id);
            } catch (err) { alert("ลบโพสต์ไม่สำเร็จ"); }
        }
    } else {
        alert("คุณไม่มีสิทธิ์ลบโพสต์นี้ครับ!");
    }
  };

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', fontFamily: 'Kanit' }}>
      <Navbar />
      
      <div style={{ paddingTop: '100px', maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
        
        {/* =========================================
            หน้ารวมรายชื่อกลุ่ม (ซ่อนเมื่อกดเข้ากลุ่ม)
            ========================================= */}
        {!activeGroup && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 20px' }}>
              <h2 style={{ margin: 0 }}>👥 ชุมชนและกลุ่มต่างๆ</h2>
              <button onClick={() => setShowCreateForm(!showCreateForm)} style={{ background: '#0095f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                {showCreateForm ? '❌ ยกเลิก' : '➕ สร้างกลุ่มใหม่'}
              </button>
            </div>

            {showCreateForm && (
              <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', margin: '0 20px 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <form onSubmit={handleCreateGroup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <input type="text" placeholder="ชื่อกลุ่ม..." required value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', fontFamily: 'Kanit' }} />
                  <input type="text" placeholder="คำอธิบายกลุ่มสั้นๆ..." value={newGroupDesc} onChange={(e) => setNewGroupDesc(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', fontFamily: 'Kanit' }} />
                  <button type="submit" style={{ background: '#28a745', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>ยืนยันการสร้างกลุ่ม</button>
                </form>
              </div>
            )}

            <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {groups.map((g) => {
                const myId = loggedInUser.id || loggedInUser._id;
                const isMember = g.members.includes(myId);
                const isCreator = g.creatorId === myId;

                return (
                  <div key={g._id} style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: '0 0 5px 0', color: '#1c1e21' }}>{g.name}</h3>
                      <p style={{ margin: 0, color: '#65676b', fontSize: '14px' }}>{g.desc}</p>
                      <div style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>สมาชิก {g.members.length} คน</div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {/* ปุ่มเข้าสู่กลุ่ม จะขึ้นก็ต่อเมื่อเป็นสมาชิกแล้ว */}
                      {isMember && (
                        <button onClick={() => { setActiveGroup(g); fetchGroupPosts(g._id); }} style={{ background: '#28a745', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>เข้าสู่กลุ่ม</button>
                      )}
                      <button onClick={() => handleJoinLeave(g._id)} style={{ background: isMember ? '#efefef' : '#0095f6', color: isMember ? '#000' : '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {isMember ? 'ออกจากกลุ่ม' : 'เข้าร่วม'}
                      </button>
                      {isCreator && (
                        <button onClick={() => handleDeleteGroup(g._id)} style={{ background: '#ed4956', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>ยุบกลุ่ม</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* =========================================
            หน้า Feed ภายในกลุ่ม (โชว์เมื่อกดเข้ากลุ่ม)
            ========================================= */}
        {activeGroup && (
          <div style={{ padding: '0 20px' }}>
            <button onClick={() => setActiveGroup(null)} style={{ background: 'none', border: 'none', color: '#0095f6', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginBottom: '20px' }}>
              ⬅ กลับไปหน้ารวมกลุ่ม
            </button>
            
            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderTop: '5px solid #0095f6' }}>
              <h2 style={{ margin: '0 0 10px 0' }}>{activeGroup.name}</h2>
              <p style={{ margin: 0, color: '#65676b' }}>{activeGroup.desc}</p>
            </div>

            {/* ฟอร์มโพสต์ในกลุ่ม */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <form onSubmit={handleCreateGroupPost} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <textarea placeholder="พูดคุยอะไรกับสมาชิกในกลุ่มหน่อยไหม?" required value={newPostDesc} onChange={(e) => setNewPostDesc(e.target.value)} style={{ padding: '15px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', resize: 'none', fontFamily: 'Kanit', minHeight: '80px' }}></textarea>
                <input type="text" placeholder="วางลิงก์รูปภาพ (ถ้ามี)..." value={newPostImg} onChange={(e) => setNewPostImg(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', fontFamily: 'Kanit' }} />
                <button type="submit" style={{ background: '#0095f6', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>โพสต์ลงกลุ่ม</button>
              </form>
            </div>

            {/* แสดงโพสต์ในกลุ่ม */}
            {groupPosts.map((p) => {
               const myId = loggedInUser.id || loggedInUser._id;
               const canDelete = p.userId === myId || activeGroup.creatorId === myId; // ลบได้ถ้าเป็นคนโพสต์ หรือเป็นแอดมินกลุ่ม
               
               return (
                <div key={p._id} style={{ background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <div style={{ fontWeight: 'bold', color: '#0095f6' }}>สมาชิกส่งข้อความ:</div>
                    {canDelete && (
                        <button onClick={() => handleDeletePost(p._id, p.userId)} style={{ background: 'none', border: 'none', color: '#ed4956', cursor: 'pointer', fontWeight: 'bold' }}>ลบโพสต์</button>
                    )}
                  </div>
                  <div style={{ fontSize: '16px', marginBottom: '15px', wordBreak: 'break-word' }}>{p.desc}</div>
                  {p.img && <img src={p.img} alt="post" style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }} />}
                </div>
              );
            })}
            
            {groupPosts.length === 0 && (
              <div style={{ textAlign: 'center', color: '#888', marginTop: '30px' }}>ยังไม่มีการพูดคุยในกลุ่มนี้ เริ่มโพสต์เป็นคนแรกเลย!</div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Group;