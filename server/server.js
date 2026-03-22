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
// ❌ ลบ xss-clean ออกไปเลยครับ!

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const app = express();

// ==========================================
// 🛡️ 1. CORS Policy (ด่าน 1: ป้องกันคนนอกเข้าถึง API ตามอำเภอใจ)
// ==========================================
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json()); 

// ==========================================
// 🛡️ ตั้งค่าความปลอดภัย (OWASP Top 10) เพิ่มเติม
// ==========================================

// 🛡️ ด่าน 2: Helmet (OWASP A05) - ซ่อนข้อมูล Server ป้องกันการโดนแสกนช่องโหว่
app.use(helmet()); 
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// 🛡️ ด่าน 3: Rate Limit (OWASP A04) - ป้องกันโดนยิง Request รัวๆ (Anti-DDoS / Brute Force)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 200, 
    message: "คุณส่งคำขอมากเกินไป กรุณารอสักครู่แล้วลองใหม่ครับ"
});
app.use('/api', limiter); 

// ==========================================
// 🗄️ เชื่อมต่อ Database (MongoDB)
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
// 🛤️ ตั้งค่าเส้นทาง API (Routers)
// ==========================================
const authRoutes = require('./backend/routers/authRoutes'); 
const postRoutes = require('./backend/routers/PostRouters'); 
const messageRoutes = require('./backend/routers/MessageRouters'); 
const groupRoutes = require('./backend/routers/GroupRouters'); 

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes); 
app.use('/api/groups', groupRoutes); 

app.get('/', (req, res) => res.send("🚀 MyGram Backend is Running Securely!"));

// ==========================================
// 💬 ระบบแชทแบบเรียลไทม์ (Socket.io)
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

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});