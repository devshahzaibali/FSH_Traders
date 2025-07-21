import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }
    // Send notification to admin
    await resend.emails.send({
      from: 'FSH Traders <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL || 'shahzaibpc7d@gmail.com',
      subject: 'New Newsletter Subscription',
      html: `<h2>New Newsletter Subscription</h2><p><strong>Email:</strong> ${email}</p>`
    });
    // Confirmation to user
    await resend.emails.send({
      from: 'FSH Traders <onboarding@resend.dev>',
      to: email,
      subject: 'Thank you for subscribing to FSH Traders',
      html: `<h2>Thank you for subscribing!</h2><p>You will now receive updates and offers from FSH Traders.</p>`
    });
    return NextResponse.json({ message: 'Subscription successful' }, { status: 200 });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ message: 'Failed to subscribe. Please try again.' }, { status: 500 });
  }
} 