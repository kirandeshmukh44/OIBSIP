const nodemailer = require("nodemailer");
const sendEmail = async ({ to, subject, text }) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) { console.warn(`Email not configured. Intended email to ${to}: ${subject}`); return; }
    const transport = nodemailer.createTransport({ service: process.env.EMAIL_SERVICE || "gmail", auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD } });
    await transport.sendMail({ from: process.env.EMAIL_FROM || process.env.EMAIL_USER, to, subject, text });
};
module.exports = { sendEmail };
