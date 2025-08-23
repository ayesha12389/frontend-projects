const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER, // Apka Gmail email
            pass: process.env.EMAIL_PASS, // App-specific password
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    });
};

module.exports = sendEmail;
