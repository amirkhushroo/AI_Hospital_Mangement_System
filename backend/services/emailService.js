const transporter = require("../config/mailConfig");

/**
 * Send Email
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("========== EMAIL DEBUG ==========");
    console.log("Transporter:", transporter);
    console.log("Type:", typeof transporter);
    console.log("sendMail:", transporter.sendMail);
    console.log("================================");

    const mailOptions = {
      from: `"AI Hospital Management System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully");
    console.log(info);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Email Sending Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};

module.exports = sendEmail;