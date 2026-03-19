import React, { useState } from 'react';
import Navbar from '../component/navbar';

const Admin = () => {
  // สร้างรายการผู้ใช้จำลอง
  const [users, setUsers] = useState([
    { id: 1, name: "Student_RMUTT", role: "Admin", status: "Active" },
    { id: 2, name: "User_02", role: "User", status: "Active" },
    { id: 3, name: "Suspicious_Account", role: "User", status: "Banned" }
  ]);

  // ฟังก์ชันลบผู้ใช้ (Action ที่อาจารย์อยากเห็น)
  const handleDelete = (id) => {
    if(window.confirm("ยืนยันการลบผู้ใช้งานนี้หรือไม่?")) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ paddingTop: '100px', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ color: '#333' }}>Admin Dashboard</h1>
        
        {/* สรุปยอด (Stat Cards) */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: '#fff', padding: '20px', flex: 1, borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <div style={{ color: '#888' }}>ผู้ใช้ทั้งหมด</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{users.length} คน</div>
          </div>
          <div style={{ background: '#fff', padding: '20px', flex: 1, borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <div style={{ color: '#888' }}>รายงานความไม่เหมาะสม</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'red' }}>2 รายการ</div>
          </div>
        </div>

        {/* ตารางจัดการผู้ใช้ */}
        <table style={{ width: '100%', background: '#fff', borderCollapse: 'collapse', borderRadius: '10px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#333', color: '#fff', textAlign: 'left' }}>
              <th style={{ padding: '15px' }}>ID</th>
              <th style={{ padding: '15px' }}>ชื่อผู้ใช้</th>
              <th style={{ padding: '15px' }}>สถานะ</th>
              <th style={{ padding: '15px' }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px' }}>{user.id}</td>
                <td style={{ padding: '15px' }}>{user.name} ({user.role})</td>
                <td style={{ padding: '15px' }}>
                  <span style={{ color: user.status === 'Active' ? 'green' : 'red' }}>{user.status}</span>
                </td>
                <td style={{ padding: '15px' }}>
                  <button onClick={() => handleDelete(user.id)} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' }}>ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;