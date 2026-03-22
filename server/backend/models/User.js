const mongoose = require('mongoose');

// กำหนดโครงสร้างข้อมูล (Schema)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    
    // 👇 เพิ่มช่องเก็บรูปโปรไฟล์ และข้อมูลส่วนตัว (ตั้งค่าเริ่มต้นเป็นค่าว่าง)
    profilePic: { type: String, default: "" }, 
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    education: { type: String, default: "" },
    work: { type: String, default: "" },
    
    // ระบบเพื่อน
    friends: { type: Array, default: [] }, 
    friendRequests: { type: Array, default: [] }, 
    
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);