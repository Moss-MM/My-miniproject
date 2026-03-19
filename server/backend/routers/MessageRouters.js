const router = require('express').Router();
const Message = require('../models/Message');
const User = require('../models/User'); 

// 1. ดึงรายชื่อผู้ใช้ทั้งหมด
router.get('/users/:currentUserId', async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.currentUserId } }).select('username _id');
        res.status(200).json(users);
    } catch (err) { res.status(500).json(err); }
});

// 2. บันทึกข้อความแชทใหม่ลง Database
router.post('/', async (req, res) => {
    const newMessage = new Message(req.body);
    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (err) { res.status(500).json(err); }
});

// 3. ดึงประวัติแชทระหว่าง "เรา" กับ "เพื่อน"
router.get('/:user1/:user2', async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { senderId: req.params.user1, receiverId: req.params.user2 },
                { senderId: req.params.user2, receiverId: req.params.user1 }
            ]
        }).sort({ createdAt: 1 }); 
        res.status(200).json(messages);
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;