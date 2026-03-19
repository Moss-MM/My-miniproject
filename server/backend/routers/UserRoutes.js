const express = require('express');
const router = express.Router();
const User = require('../models/User');

// API แก้ไขข้อมูลส่วนตัว
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

module.exports = router;