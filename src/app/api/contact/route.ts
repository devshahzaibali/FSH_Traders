import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }
    // Send email to admin
    await resend.emails.send({
      from: 'FSH Traders <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL || 'shahzaibpc7d@gmail.com',
      subject: `New Contact Form Submission: ${subject}`,
      html: `<h2>New Contact Form Submission</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>`
    });
    // Confirmation to user
    await resend.emails.send({
      from: 'FSH Traders <onboarding@resend.dev>',
      to: email,
      subject: 'Thank you for contacting FSH Traders',
      html: `<h2>Thank you for contacting us!</h2><p>Dear ${name},</p><p>We have received your message and will get back to you as soon as possible.</p>`
    });
    return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ message: 'Failed to send message. Please try again.' }, { status: 500 });
  }
} 