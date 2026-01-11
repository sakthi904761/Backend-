import nodemailer from "nodemailer";

export const sendEmail = async (req, res, next) => {
  try {
    const { to, subject, message } = req.body;

    // Validate required fields
    if (!to || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields (to, subject, message) are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address format",
      });
    }

    // Check if environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email credentials not configured");
      return res.status(500).json({
        success: false,
        message: "Email service not configured. Please contact administrator.",
      });
    }

    // Create transporter with additional configuration
    // Use explicit SMTP settings for Gmail (more reliable than `service`)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log("Email transporter verified successfully");
    } catch (verifyError) {
      console.error("Transporter verification failed:", verifyError);
      return res.status(500).json({
        success: false,
        message: "Email configuration error. Please check server logs.",
        error: process.env.NODE_ENV === 'development' ? verifyError.message : undefined
      });
    }

    // Send email
    const info = await transporter.sendMail({
      from: `"Teacher Dashboard" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: message,
      html: `<p>${message.replace(/\n/g, '<br>')}</p>`, // Support line breaks
    });

    console.log("Email sent successfully:", info.messageId);

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    
    // More specific error messages
    let errorMessage = "Failed to send email";
    
    if (error.code === 'EAUTH') {
      errorMessage = "Authentication failed. Please check email credentials.";
    } else if (error.code === 'ECONNECTION') {
      errorMessage = "Could not connect to email server.";
    } else if (error.responseCode === 535) {
      errorMessage = "Invalid email credentials. Please use an App Password for Gmail.";
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};