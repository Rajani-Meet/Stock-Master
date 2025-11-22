import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export async function sendOTP(email: string, otp: string) {
  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'StockMaster - Password Reset OTP',
    html: `
      <h2>Password Reset Request</h2>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>This code expires in 10 minutes.</p>
    `
  })
}