import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    console.log('Testing email configuration...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');
    console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'shahzaibpc7d@gmail.com');

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json(
        { 
          error: 'Email configuration missing',
          emailUser: !!process.env.EMAIL_USER,
          emailPass: !!process.env.EMAIL_PASS
        },
        { status: 500 }
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

    // Test email
    const testEmail = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || 'shahzaibpc7d@gmail.com',
      subject: 'Test Email - FSH Traders',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937;">Test Email</h2>
          <p>This is a test email to verify email configuration is working.</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `,
    };

    await transporter.sendMail(testEmail);
    console.log('Test email sent successfully');

    return NextResponse.json(
      { 
        message: 'Test email sent successfully',
        emailUser: process.env.EMAIL_USER,
        adminEmail: process.env.ADMIN_EMAIL || 'shahzaibpc7d@gmail.com'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 