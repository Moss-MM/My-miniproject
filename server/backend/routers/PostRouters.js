const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); 

// ==========================================
// 1. สร้างโพสต์ใหม่ (POST /api/posts)
// ==========================================
router.post('/', async (req, res) => {
    const newPost = new Post(req.body); 
    try {
        const savedPost = await newPost.save();
        res.status(200).json({ message: "โพสต์สำเร็จแล้ว!", post: savedPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการสร้างโพสต์" });
    }
});

// ==========================================
// 2. ดึงโพสต์ทั้งหมดไปโชว์หน้าฟีด (GET /api/posts)
// ==========================================
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'username email'); 

        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลโพสต์" });
    }
});

// ==========================================
// 3. ลบโพสต์ตาม ID (DELETE /api/posts/:id)
// ==========================================
router.delete('/:id', async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        
        if (!deletedPost) {
          return res.status(404).json({ message: "ไม่พบโพสต์ที่ต้องการลบ" });
        }

        res.status(200).json({ message: "ลบโพสต์สำเร็จแล้ว!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบโพสต์จาก Server" });
    }
});

// ==========================================
// 4. กดไลก์ หรือ เลิกกดไลก์ (PUT /api/posts/:id/like)
// ==========================================
router.put('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json("ไม่พบโพสต์");

        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("กดไลก์เรียบร้อย");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("ยกเลิกกดไลก์เรียบร้อย");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// ==========================================
// 5. เพิ่มคอมเมนต์ (PUT /api/posts/:id/comment) - แก้บั๊กซ้ำซ้อนแล้ว!
// ==========================================
router.put('/:id/comment', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json("ไม่พบโพสต์");

        const newComment = {
            userId: req.body.userId,
            username: req.body.username,
            text: req.body.text
        };

        // สั่งให้ดัน (push) คอมเมนต์ใหม่เข้าไปในอาเรย์
        post.comments.push(newComment);
        await post.save();

        // ส่งเฉพาะก้อน comments กลับไปให้หน้าบ้านอัปเดตแบบเรียลไทม์
        res.status(200).json({ comments: post.comments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการคอมเมนต์" });
    }
});

// ==========================================
// 6. ดึงโพสต์เฉพาะที่อยู่ในกลุ่ม (Group Feed)
// ==========================================
router.get('/group/:groupId', async (req, res) => {
    try {
        const posts = await Post.find({ groupId: req.params.groupId }).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) { 
        res.status(500).json(err); 
    }
});

module.exports = router;