const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const bcrypt = require('bcryptjs');

// ==========================================
// 1. ระบบสมัครสมาชิก (Register)
// ==========================================
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "อีเมลนี้มีคนใช้แล้วครับ" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "สมัครสมาชิกสำเร็จ!", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดที่ Server" });
    }
});

// ==========================================
// 2. ระบบเข้าสู่ระบบ (Login)
// ==========================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });

        // 👇 ส่งข้อมูลให้ครบ เพื่อให้ localStorage จำค่า Profile ใหม่ได้
        res.status(200).json({ 
            message: "เข้าสู่ระบบสำเร็จ!", 
            user: { 
                id: user._id,      
                username: user.username, 
                email: user.email,
                bio: user.bio,
                location: user.location,
                education: user.education,
                work: user.work,
                friends: user.friends,
                friendRequests: user.friendRequests
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดที่ Server" });
    }
});

// ==========================================
// 3. แก้ไขข้อมูลส่วนตัว (Update Profile)
// ==========================================
router.put('/update/:id', async (req, res) => {
    try {
        // 👇 รับค่ามาให้ครบทุกช่อง
        const { username, email, bio, location, education, work } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { username, email, bio, location, education, work }, 
            { new: true } 
        );

        if (!updatedUser) return res.status(404).json("ไม่พบผู้ใช้งาน");

        res.status(200).json({
            message: "อัปเดตข้อมูลสำเร็จ!",
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                bio: updatedUser.bio,
                location: updatedUser.location,
                education: updatedUser.education,
                work: updatedUser.work,
                friends: updatedUser.friends,
                friendRequests: updatedUser.friendRequests
            }
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// ==========================================
// 4. ระบบรีเซ็ตรหัสผ่าน
// ==========================================
router.put('/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "ไม่พบอีเมลนี้ในระบบครับ" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "เปลี่ยนรหัสผ่านสำเร็จแล้ว!" });
    } catch (err) {
        res.status(500).json({ message: "เกิดข้อผิดพลาดที่ Server" });
    }
});

// ==========================================
// 🚀 5. ระบบเพื่อน (Friend System)
// ==========================================
router.put('/:id/friend-request', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id); 
      if (!user.friendRequests.includes(req.body.userId) && !user.friends.includes(req.body.userId)) {
        await user.updateOne({ $push: { friendRequests: req.body.userId } });
        res.status(200).json("ส่งคำขอเป็นเพื่อนสำเร็จ!");
      } else {
        res.status(403).json("คุณเคยส่งคำขอไปแล้ว หรือเป็นเพื่อนกันอยู่แล้ว");
      }
    } catch (err) { res.status(500).json(err); }
  } else {
    res.status(403).json("คุณส่งคำขอเป็นเพื่อนให้ตัวเองไม่ได้ครับ!");
  }
});

router.put('/:id/accept-friend', async (req, res) => {
  try {
    const user = await User.findById(req.params.id); 
    const sender = await User.findById(req.body.userId); 

    if (user.friendRequests.includes(req.body.userId)) {
      await user.updateOne({ 
        $pull: { friendRequests: req.body.userId }, 
        $push: { friends: req.body.userId } 
      });
      await sender.updateOne({ $push: { friends: req.params.id } });
      res.status(200).json("รับเป็นเพื่อนสำเร็จ!");
    } else {
      res.status(403).json("ไม่มีคำขอเป็นเพื่อนจากผู้ใช้นี้");
    }
  } catch (err) { res.status(500).json(err); }
});

router.put('/:id/decline-friend', async (req, res) => {
  try {
    const user = await User.findById(req.params.id); 
    if (user.friendRequests.includes(req.body.userId)) {
      await user.updateOne({ $pull: { friendRequests: req.body.userId } });
      res.status(200).json("ปฏิเสธคำขอเป็นเพื่อนแล้ว");
    } else {
      res.status(403).json("ไม่มีคำขอเป็นเพื่อนจากผู้ใช้นี้");
    }
  } catch (err) { res.status(500).json(err); }
});

// ดึงรายชื่อคนขอเป็นเพื่อน
router.get('/:id/friend-requests', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json("ไม่พบผู้ใช้");

    const requests = await Promise.all(
      user.friendRequests.map(friendId => {
        return User.findById(friendId).select("username profilePic _id");
      })
    );
    
    // 👇 แก้ตรงนี้: กรองเอาเฉพาะข้อมูลที่มีจริง กันบั๊กไอดีพัง 👇
    const validRequests = requests.filter(req => req !== null);
    res.status(200).json(validRequests);
  } catch (err) { 
    res.status(500).json(err); 
  }
});

module.exports = router;