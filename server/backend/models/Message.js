const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    senderId: { type: String, required: true },    // ID คนส่ง
    receiverId: { type: String, required: true },  // ID คนรับ
    text: { type: String },                        // ข้อความ
    mediaUrl: { type: String }                     // ลิงก์รูปหรือวิดีโอ (ถ้ามี)
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);