import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to subscriber
    const subscriberEmail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to FSH Traders Newsletter! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to FSH Traders!</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Thank you for subscribing to our newsletter</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">🎉 You're Successfully Subscribed!</h2>
            
            <p style="color: #374151; line-height: 1.6;">
              Hi there! 👋
            </p>
            
            <p style="color: #374151; line-height: 1.6;">
              Thank you for subscribing to the FSH Traders newsletter! We're excited to have you as part of our community.
            </p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <h3 style="color: #1f2937; margin-top: 0;">What you'll receive:</h3>
              <ul style="color: #374151; line-height: 1.6;">
                <li>🎁 Exclusive deals and discounts</li>
                <li>🆕 New product announcements</li>
                <li>📰 Latest fashion and tech trends</li>
                <li>💡 Shopping tips and style advice</li>
                <li>🎯 Personalized recommendations</li>
              </ul>
            </div>
            
            <p style="color: #374151; line-height: 1.6;">
              We'll send you updates about our latest products, exclusive offers, and industry insights. Don't worry - we won't spam you, and you can unsubscribe anytime.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3001" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                🛍️ Start Shopping Now
              </a>
            </div>
            
            <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; border: 1px solid #dbeafe;">
              <p style="margin: 0; color: #1e40af; font-size: 14px;">
                <strong>💡 Pro Tip:</strong> Follow us on social media for even more exclusive content and behind-the-scenes updates!
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Best regards,<br>
              The FSH Traders Team
            </p>
          </div>
        </div>
      `,
    };

    // Email to admin about new subscription
    const adminEmail = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || 'shahzaibpc7d@gmail.com',
      subject: `New Newsletter Subscription: ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            📧 New Newsletter Subscription
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Subscription Details:</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">Active</span></p>
          </div>
          
          <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; border: 1px solid #dbeafe;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              <strong>Action:</strong> Welcome email has been sent to the subscriber.
            </p>
          </div>
        </div>
      `,
    };

    // Send emails
    await transporter.sendMail(subscriberEmail);
    await transporter.sendMail(adminEmail);

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { message: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
} 