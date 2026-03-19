const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const bcrypt = require('bcryptjs'); // 👈 1. นำเข้าเครื่องมือเข้ารหัสลับ

// 1. ระบบสมัครสมาชิก
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "อีเมลนี้มีคนใช้แล้วครับ" });

        // 👇 2. สร้างเกลือ (Salt) และเข้ารหัสผ่านก่อนเซฟ
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // เปลี่ยน password เป็นตัวที่เข้ารหัสแล้ว
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "สมัครสมาชิกสำเร็จ!", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดที่ Server" });
    }
});

// 2. ระบบเข้าสู่ระบบ (Login)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // เช็คว่ามีอีเมลไหม
        if (!user) {
            return res.status(400).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
        }

        // 👇 3. ถอดรหัสผ่านใน DB มาเทียบกับที่ผู้ใช้พิมพ์มา
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
        }

        // ส่ง ID กลับไปให้หน้าบ้านด้วย (คงของเดิมไว้เป๊ะๆ)
        res.status(200).json({ 
            message: "เข้าสู่ระบบสำเร็จ!", 
            user: { 
                id: user._id,       
                username: user.username, 
                email: user.email 
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดที่ Server" });
    }
});

// 3. แก้ไขข้อมูลส่วนตัว (PUT /api/auth/update/:id)
router.put('/update/:id', async (req, res) => {
    try {
        const { username, email } = req.body;
        
        // ค้นหาและอัปเดตข้อมูล
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { username, email }, 
            { new: true } // ให้คืนค่าข้อมูลตัวที่อัปเดตแล้วกลับมา
        );

        if (!updatedUser) return res.status(404).json("ไม่พบผู้ใช้งาน");

        res.status(200).json({
            message: "อัปเดตข้อมูลสำเร็จ!",
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email
            }
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// 4. ระบบรีเซ็ตรหัสผ่าน (PUT /api/auth/reset-password)
router.put('/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // ค้นหาผู้ใช้จากอีเมล
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "ไม่พบอีเมลนี้ในระบบครับ" });

        // 👇 4. เข้ารหัสผ่านตัวใหม่ก่อนเซฟทับของเดิม
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "เปลี่ยนรหัสผ่านสำเร็จแล้ว!" });
    } catch (err) {
        res.status(500).json({ message: "เกิดข้อผิดพลาดที่ Server" });
    }
});

module.exports = router;