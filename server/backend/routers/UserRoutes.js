const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ==========================================
// 📝 1. API แก้ไขข้อมูลส่วนตัว (อัปเดตใหม่ครบทุกช่อง)
// ==========================================
router.put('/update/:id', async (req, res) => {
  try {
    // รับค่าทั้งหมดที่ส่งมาจากหน้า Profile
    const { username, email, profilePic, bio, location, education, work } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, profilePic, bio, location, education, work },
      { new: true } // ให้ส่งข้อมูลใหม่ล่าสุดกลับไป
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 🚀 2. ระบบเพื่อน (Friend System)
// ==========================================

// ส่งคำขอเป็นเพื่อน
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
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("คุณส่งคำขอเป็นเพื่อนให้ตัวเองไม่ได้ครับ!");
  }
});

// รับแอด
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
  } catch (err) {
    res.status(500).json(err);
  }
});

// ปฏิเสธคำขอ
router.put('/:id/decline-friend', async (req, res) => {
  try {
    const user = await User.findById(req.params.id); 
    if (user.friendRequests.includes(req.body.userId)) {
      await user.updateOne({ $pull: { friendRequests: req.body.userId } });
      res.status(200).json("ปฏิเสธคำขอเป็นเพื่อนแล้ว");
    } else {
      res.status(403).json("ไม่มีคำขอเป็นเพื่อนจากผู้ใช้นี้");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// ดึงรายชื่อคนที่ขอเป็นเพื่อนเรา
router.get('/:id/friend-requests', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
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