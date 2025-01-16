import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { name, email, message, honeypot } = req.body

  // Check honeypot
  if (honeypot) {
    return res.status(200).json({ message: 'Message sent successfully' })
  }

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Send email
    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
      to: 'noahlaratta@gmail.com',
      subject: `New Contact Form Message from ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
      html: `
<h2>New Contact Form Message</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<br>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    res.status(200).json({ message: 'Message sent successfully' })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({ message: 'Failed to send message' })
  }
} 