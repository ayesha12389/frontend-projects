const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/send-email', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'toobaamjad098@gmail.com',
        pass: 'aaoxlzkuuuxcqhtl'
      }
    });

    let mailOptions = {
      from: email,
      to: 'toobaamjad098@gmail.com', // Jahan email receive karni hai
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    let info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully!'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error sending email.'
    });
  }
});

module.exports = router;
