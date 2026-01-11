const Teacher = require("../models/teacher.model");
const bcrypt = require("bcryptjs");
const sendEmail = require("../services/sendEmail");

exports.addTeacher = async (req, res) => {
  try {
    const { name, email, subject, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = new Teacher({
      name,
      email,
      subject,
      password: hashedPassword
    });

    await teacher.save();

    // 📧 Send Email
    await sendEmail(
      email,
      "Teacher Account Created",
      `
      <h3>Hello ${name}</h3>
      <p>Your teacher account has been created.</p>
      <p><b>Subject:</b> ${subject}</p>
      <p><b>Email:</b> ${email}</p>
      `
    );

    res.status(201).json({ message: "Teacher added successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginTeacher = async (req, res) => {
  const { email, password } = req.body;

  const teacher = await Teacher.findOne({ email });
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });

  const isMatch = await bcrypt.compare(password, teacher.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    message: "Login successful",
    teacher: {
      id: teacher._id,
      name: teacher.name,
      role: teacher.role
    }
  });
};
