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

// 👇 ใช้สูตรนี้: อนุญาตให้ทุกเว็บที่ลงท้ายด้วย .vercel.app หรือ localhost ผ่านได้หมด! 👇
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origin.endsWith('.vercel.app') || origin.includes('localhost')) {
            return callback(null, true);
        }
        return callback(new Error('CORS Policy blocked this request'));
    },
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
        origin: "*", // 👈 ปลดล็อกแชทให้ใช้บน Vercel ได้ทุกโดเมนชัวร์ๆ 100%
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