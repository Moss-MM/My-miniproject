const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    desc: { 
        type: String, 
        max: 500 
    },
    img: { 
        type: String 
    },
    likes: { 
        type: Array, 
        default: [] 
    },
    // เก็บรายการคอมเมนต์จริงลง Database
    comments: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            username: { type: String },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    // 👇 เพิ่มส่วนนี้เข้าไปครับ สำหรับแยกโพสต์ในระบบกลุ่ม (Group Feed)
    groupId: { 
        type: String, 
        default: "" 
    }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);