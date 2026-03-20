const mongoose = require('mongoose');

// กำหนดโครงสร้างข้อมูล (Schema)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" }, 
    
    // ข้อมูลส่วนตัว (About Me)
    bio: { type: String, default: "สวัสดี! ฉันเพิ่งเข้าร่วม MyGram" },
    location: { type: String, default: "ประเทศไทย" },
    education: { type: String, default: "ม.ราชมงคลธัญบุรี (RMUTT)" },
    work: { type: String, default: "Full-Stack Developer" },
    
    // ระบบเพื่อน
    friends: { type: Array, default: [] }, 
    friendRequests: { type: Array, default: [] }, 
    
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);