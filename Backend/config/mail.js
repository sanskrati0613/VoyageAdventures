const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Email connection failed:', error.message);
    } else {
        console.log('Email server ready');
    }
});

module.exports = transporter;