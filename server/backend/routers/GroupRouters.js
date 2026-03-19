const router = require('express').Router();
const Group = require('../models/Group');

// 1. สร้างกลุ่มใหม่
router.post('/', async (req, res) => {
    const newGroup = new Group({
        name: req.body.name,
        desc: req.body.desc,
        creatorId: req.body.userId,
        members: [req.body.userId] // คนสร้างจะได้เป็นสมาชิกอัตโนมัติ
    });
    try {
        const savedGroup = await newGroup.save();
        res.status(200).json(savedGroup);
    } catch (err) { res.status(500).json(err); }
});

// 2. ดึงรายชื่อกลุ่มทั้งหมดมาโชว์
router.get('/', async (req, res) => {
    try {
        const groups = await Group.find().sort({ createdAt: -1 });
        res.status(200).json(groups);
    } catch (err) { res.status(500).json(err); }
});

// 3. เข้าร่วม / ออกจากกลุ่ม
router.put('/:id/join', async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group.members.includes(req.body.userId)) {
            // ถ้ายังไม่เป็นสมาชิก -> ให้เข้าร่วม
            await group.updateOne({ $push: { members: req.body.userId } });
            res.status(200).json("เข้าร่วมกลุ่มเรียบร้อย");
        } else {
            // ถ้าเป็นสมาชิกอยู่แล้ว -> ให้ออกจากกลุ่ม
            if (group.creatorId === req.body.userId) {
                return res.status(400).json("คนสร้างกลุ่มออกจากกลุ่มตัวเองไม่ได้ครับ!");
            }
            await group.updateOne({ $pull: { members: req.body.userId } });
            res.status(200).json("ออกจากกลุ่มเรียบร้อย");
        }
    } catch (err) { res.status(500).json(err); }
});

// 4. ลบกลุ่ม (ทำได้เฉพาะคนสร้างกลุ่มเท่านั้น)
router.delete('/:id', async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (group.creatorId === req.body.userId) {
            await group.deleteOne();
            res.status(200).json("ลบกลุ่มเรียบร้อยแล้ว");
        } else {
            res.status(403).json("คุณไม่ใช่เจ้าของกลุ่ม ลบไม่ได้ครับ!");
        }
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;