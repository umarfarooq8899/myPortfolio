import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const from = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER;
    const to = process.env.CONTACT_TO_EMAIL;

    if (!to) {
      return NextResponse.json({ error: 'Recipient email not configured' }, { status: 500 });
    }

    await transporter.sendMail({
      from,
      to,
      subject: `New contact from ${name} <${email}>`,
      text: message,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${String(message).replace(/\n/g, '<br/>')}</p>`,
      replyTo: email,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
