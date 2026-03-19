// backend/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// --- ส่วนสมัครสมาชิก (เดิม) ---
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // ตรวจสอบว่ามีอีเมลนี้ในระบบหรือยัง
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: "อีเมลนี้ถูกใช้งานแล้ว" });

    // เข้ารหัสผ่านก่อนบันทึก (Security - OWASP)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: "สมัครสมาชิกสำเร็จ!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    res.json({ message: "เปลี่ยนรหัสผ่านใหม่สำเร็จแล้ว!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- ส่วนเข้าสู่ระบบ (เพิ่มใหม่) ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. ค้นหาผู้ใช้จากอีเมล
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "ไม่พบผู้ใช้งานด้วยอีเมลนี้" });
    }

    // 2. ตรวจสอบรหัสผ่าน (เอา password ที่รับมาเทียบกับตัวที่เข้ารหัสใน DB)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "รหัสผ่านไม่ถูกต้อง" });
    }

    // 3. ถ้าถูกต้อง ส่งข้อมูลผู้ใช้กลับไป (ยกเว้นรหัสผ่าน)
    res.status(200).json({ 
      message: "เข้าสู่ระบบสำเร็จ!", 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic
      } 
    });

  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }

};