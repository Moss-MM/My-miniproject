const express = require('express');
const router = express.Router();
const User = require('../models/User');

// API แก้ไขข้อมูลส่วนตัว (ของเดิม)
router.put('/update/:id', async (req, res) => {
  try {
    const { fullName, username, profilePic } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, username, profilePic },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 🚀 ระบบเพื่อน (Friend System)
// ==========================================

// 1. ส่งคำขอเป็นเพื่อน (Send Friend Request)
router.put('/:id/friend-request', async (req, res) => {
  // req.params.id = ID ของคนที่เราจะแอดไปหา
  // req.body.userId = ID ของเราเอง (คนกดแอด)
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id); // เป้าหมาย
      if (!user.friendRequests.includes(req.body.userId) && !user.friends.includes(req.body.userId)) {
        // ถ้ายังไม่ได้ส่งคำขอ และยังไม่ได้เป็นเพื่อนกัน
        await user.updateOne({ $push: { friendRequests: req.body.userId } });
        res.status(200).json("ส่งคำขอเป็นเพื่อนสำเร็จ!");
      } else {
        res.status(403).json("คุณเคยส่งคำขอไปแล้ว หรือเป็นเพื่อนกันอยู่แล้ว");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("คุณส่งคำขอเป็นเพื่อนให้ตัวเองไม่ได้ครับ!");
  }
});

// 2. รับแอด (Accept Friend Request)
router.put('/:id/accept-friend', async (req, res) => {
  // req.params.id = ID ของเราเอง (คนกดยืนยันรับแอด)
  // req.body.userId = ID ของคนที่ส่งคำขอมา
  try {
    const user = await User.findById(req.params.id); // ตัวเรา
    const sender = await User.findById(req.body.userId); // คนที่ขอมา

    if (user.friendRequests.includes(req.body.userId)) {
      // 1. เอา ID ออกจากคำขอ และเพิ่มเข้า List เพื่อนของเรา
      await user.updateOne({ 
        $pull: { friendRequests: req.body.userId }, 
        $push: { friends: req.body.userId } 
      });
      // 2. เพิ่ม ID เรา เข้า List เพื่อนของคนส่ง
      await sender.updateOne({ $push: { friends: req.params.id } });
      
      res.status(200).json("รับเป็นเพื่อนสำเร็จ!");
    } else {
      res.status(403).json("ไม่มีคำขอเป็นเพื่อนจากผู้ใช้นี้");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. ปฏิเสธคำขอ (Decline Friend Request)
router.put('/:id/decline-friend', async (req, res) => {
  try {
    const user = await User.findById(req.params.id); 
    if (user.friendRequests.includes(req.body.userId)) {
      // เอา ID ออกจากคำขอทิ้งไปเลย
      await user.updateOne({ $pull: { friendRequests: req.body.userId } });
      res.status(200).json("ปฏิเสธคำขอเป็นเพื่อนแล้ว");
    } else {
      res.status(403).json("ไม่มีคำขอเป็นเพื่อนจากผู้ใช้นี้");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// 4. ดึงรายชื่อคนที่ขอเป็นเพื่อนเรา (เอาไปโชว์ที่หน้าบ้าน)
router.get('/:id/friend-requests', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // วนลูปตาม ID แล้วไปดึง (ชื่อ, รูปโปรไฟล์) ของคนๆ นั้นมาให้หน้าบ้าน
    const requests = await Promise.all(
      user.friendRequests.map(friendId => {
        return User.findById(friendId).select("username profilePic _id");
      })
    );
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;