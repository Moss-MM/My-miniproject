const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); 
const dns = require("dns");
const http = require('http');
const { Server } = require('socket.io');

// --- แพ็กเกจความปลอดภัย (OWASP) ---
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
// ❌ ลบ mongoSanitize และ hpp ออกไปเลยครับ เพราะมันคือตัวการทำเซิร์ฟเวอร์พัง!

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const app = express();

// ==========================================
// 🌐 1. ตั้งค่าการเชื่อมต่อ (CORS) -> นับเป็น 1 ในด่านความปลอดภัย (Access Control)
// ==========================================
app.use(cors({
    origin: "*", // เปิดรับทุกโดเมนจาก Vercel
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// อ่านค่า JSON จาก Request 
app.use(express.json()); 

// ==========================================
// 🛡️ 2. ตั้งค่าความปลอดภัยเพิ่มเติม (OWASP Top 10)
// ==========================================

// ด่าน 2: Helmet (OWASP A05) - ซ่อนข้อมูล Server และตั้งค่า HTTP Headers ให้ปลอดภัย
app.use(helmet()); 
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// ด่าน 3: Rate Limit (OWASP A04) - ป้องกันคนยิง Request รัวๆ (Anti-DDoS / Brute Force)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 นาที
    max: 200, // ห้ามเกิน 200 ครั้ง
    message: "คุณส่งคำขอมากเกินไป กรุณารอสักครู่แล้วลองใหม่ครับ"
});
app.use('/api', limiter); 

// ด่าน 4: XSS Clean (OWASP A03) - ป้องกันการฝังสคริปต์ไวรัสข้ามไซต์ (Cross-Site Scripting)
app.use('/api', xss());

// 🛡️ ด่าน 5: Bcrypt (OWASP A07) - ระบบเข้ารหัสผ่านซับซ้อน (ฝังอยู่ในไฟล์ authRoutes.js แล้ว!)


// ==========================================
// 🗄️ 3. เชื่อมต่อ Database (MongoDB)
// ==========================================
async function connectDB() {
    try {
        await mongoose.connect(process.env.Database_url);
        console.log("✅ Connected to MongoDB Success!");
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error.message);
    }
}
connectDB();


// ==========================================
// 🛤️ 4. ตั้งค่าเส้นทาง API (Routers)
// ==========================================
const authRoutes = require('./backend/routers/authRoutes'); 
const postRoutes = require('./backend/routers/PostRouters'); 
const messageRoutes = require('./backend/routers/MessageRouters'); 
const groupRoutes = require('./backend/routers/GroupRouters'); 

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes); 
app.use('/api/groups', groupRoutes); 

app.get('/', (req, res) => res.send("🚀 MyGram Backend is Running Securely with OWASP!"));


// ==========================================
// 💬 5. ระบบแชทแบบเรียลไทม์ (Socket.io)
// ==========================================
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

let onlineUsers = []; 

io.on("connection", (socket) => {
    socket.on("add_user", (userId) => {
        const existing = onlineUsers.find(u => u.userId === userId);
        if(!existing){
            onlineUsers.push({ userId, socketId: socket.id });
        } else {
            existing.socketId = socket.id; 
        }
    });

    socket.on("send_message", (data) => {
        const receiver = onlineUsers.find(user => user.userId === data.receiverId);
        if (receiver) {
            io.to(receiver.socketId).emit("receive_message", data);
        }
    });

    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
    });
});

// เริ่มรันเซิร์ฟเวอร์
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT} (พร้อมระบบแชทและ OWASP Security!)`);
});