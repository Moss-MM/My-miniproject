const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); 
const dns = require("dns");
const http = require('http');
const { Server } = require('socket.io');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const app = express();

// ==========================================
// 🚨 ตั้งค่าความปลอดภัยและทางเชื่อม (CORS)
// ==========================================
// 👇 สร้างคลังเก็บลิงก์ Vercel ของคุณมอสทุกรูปแบบ
const allowedOrigins = [
    "https://my-miniproject-narifm78s-teetatjamjang-6880s-projects.vercel.app",
    "https://my-miniproject-teetatjamjang-6880s-projects.vercel.app",
    "https://my-miniproject-git-main-teetatjamjang-6880s-projects.vercel.app"
];

app.use(cors({
    origin: allowedOrigins, // 👈 อนุญาตให้ทุกหน้าบ้านในคลังเข้าถึงได้
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
})); 

app.use(express.json()); 

// ใส่เกราะป้องกัน Helmet (OWASP A05)
app.use(helmet()); 
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// ป้องกันการยิง Request รัวๆ (OWASP A04)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 200, 
    message: "คุณส่งคำขอมากเกินไป กรุณารอสักครู่แล้วลองใหม่ครับ"
});
app.use('/api', limiter); 

// ==========================================

// เชื่อมต่อ Database
async function connectDB() {
    try {
        await mongoose.connect(process.env.Database_url);
        console.log("✅ Connected to MongoDB Success!");
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error.message);
    }
}
connectDB();

// นำเข้า Routers
const authRoutes = require('./backend/routers/authRoutes'); 
const postRoutes = require('./backend/routers/PostRouters'); 
const messageRoutes = require('./backend/routers/MessageRouters'); 
const groupRoutes = require('./backend/routers/GroupRouters'); 

// เปิดใช้งาน API
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes); 
app.use('/api/groups', groupRoutes); 

app.get('/', (req, res) => res.send("🚀 MyGram Backend is Running Securely!"));

// สร้าง Server สำหรับ Socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: allowedOrigins, // 👈 แก้ให้แชทใช้บน Vercel ได้ทุกโดเมน
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

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT} (พร้อมระบบแชทและ OWASP Security!)`);
});