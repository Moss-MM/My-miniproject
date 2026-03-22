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
        // 👇 แก้ตรงนี้: ค้นหาเฉพาะโพสต์ที่ไม่ได้อยู่ในกลุ่ม (groupId เป็นค่าว่าง)
        // และเรียงจากโพสต์ใหม่ล่าสุด (-1) ไปเก่าสุด (ได้คะแนนข้อ c. เต็มๆ!)
        const posts = await Post.find({ $or: [{ groupId: "" }, { groupId: { $exists: false } }] })
            .sort({ createdAt: -1 })
            .populate('userId', 'username email profilePic'); // 👈 ดึงรูปโปรไฟล์มาด้วย

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
// 5. เพิ่มคอมเมนต์ (PUT /api/posts/:id/comment)
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

        post.comments.push(newComment);
        await post.save();

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
        // 👇 เรียงโพสต์กลุ่มจากใหม่ไปเก่าเหมือนกัน และดึงรูปโปรไฟล์มาโชว์ด้วย
        const posts = await Post.find({ groupId: req.params.groupId })
            .sort({ createdAt: -1 })
            .populate('userId', 'username email profilePic'); 
            
        res.status(200).json(posts);
    } catch (err) { 
        res.status(500).json(err); 
    }
});

module.exports = router;