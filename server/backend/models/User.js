const mongoose = require('mongoose');

// กำหนดโครงสร้างข้อมูล (Schema)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" }, // รูปโปรไฟล์ (เผื่อไว้ใส่ทีหลัง)
    bio: { type: String, default: "สวัสดี! ฉันเพิ่งเข้าร่วม MyGram" }
}, { timestamps: true }); // timestamps จะเก็บเวลาที่สมัครให้อัตโนมัติ

module.exports = mongoose.model('User', userSchema);