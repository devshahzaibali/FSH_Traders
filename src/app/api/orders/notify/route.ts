import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { order, customer } = await request.json();

    // Validate required fields
    if (!order || !customer) {
      return NextResponse.json(
        { message: 'Order and customer information are required' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Calculate total
    const total = order.items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    );

    // Calculate shipping date (2 days from order date)
    const orderDate = new Date(order.createdAt || order.timestamp);
    const shippingDate = new Date(orderDate);
    shippingDate.setDate(shippingDate.getDate() + 2);
    
    const shippingDayName = shippingDate.toLocaleDateString('en-US', { weekday: 'long' });
    const shippingDateFormatted = shippingDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Email to admin
    const adminEmail = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || 'shahzaibpc7d@gmail.com',
      subject: `New Order Received: #${order.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
            🛒 New Order Received
          </h2>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #bbf7d0;">
            <h3 style="color: #065f46; margin-top: 0;">Order Details:</h3>
            <p><strong>Order ID:</strong> #${order.id}</p>
            <p><strong>Date:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
            <p><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">${order.status}</span></p>
            <p><strong>Total Amount:</strong> $${total.toFixed(2)}</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Customer Information:</h3>
            <p><strong>Name:</strong> ${customer.firstName} ${customer.lastName}</p>
            <p><strong>Email:</strong> ${customer.email}</p>
            <p><strong>Phone:</strong> ${customer.phone || 'Not provided'}</p>
            <p><strong>Address:</strong> ${customer.address || 'Not provided'}</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Order Items:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f1f5f9;">
                  <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Item</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 1px solid #e2e8f0;">Qty</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0;">Price</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map((item: any) => `
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${item.name}</td>
                    <td style="padding: 10px; text-align: center; border-bottom: 1px solid #f1f5f9;">${item.quantity}</td>
                    <td style="padding: 10px; text-align: right; border-bottom: 1px solid #f1f5f9;">$${item.price.toFixed(2)}</td>
                    <td style="padding: 10px; text-align: right; border-bottom: 1px solid #f1f5f9;">$${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr style="background-color: #f8fafc;">
                  <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                  <td style="padding: 10px; text-align: right; font-weight: bold;">$${total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; border: 1px solid #dbeafe;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              <strong>Action Required:</strong> Please review and process this order in the admin panel.
            </p>
          </div>
        </div>
      `,
    };

    // Send email to admin
    await transporter.sendMail(adminEmail);

    // Send confirmation email to customer
    const customerEmail = {
      from: process.env.EMAIL_USER,
      to: customer.email,
      subject: `Order Confirmation: #${order.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Order Confirmed!</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Thank you for your order</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="color: #374151; line-height: 1.6; margin-top: 0;">
              Dear <strong>${customer.firstName} ${customer.lastName}</strong>,
            </p>
            
            <p style="color: #374151; line-height: 1.6;">
              Thank you for your order! We have received your order and are processing it. You'll receive updates as your order progresses.
            </p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #065f46; margin-top: 0;">📋 Order Summary:</h3>
              <p><strong>Order ID:</strong> #${order.id}</p>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt || order.timestamp).toLocaleString()}</p>
              <p><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">${order.status}</span></p>
              <p><strong>Payment Method:</strong> ${order.paymentMethod || 'Not specified'}</p>
              <p><strong>Total Amount:</strong> <span style="font-weight: bold; color: #065f46;">$${total.toFixed(2)}</span></p>
            </div>
            
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #92400e; margin-top: 0;">🚚 Shipping Information:</h3>
              <p><strong>Estimated Shipping Date:</strong> <span style="color: #d97706; font-weight: bold;">${shippingDayName}, ${shippingDateFormatted}</span></p>
              <p><strong>Estimated Delivery:</strong> <span style="color: #d97706; font-weight: bold;">3-5 business days after shipping</span></p>
              <p><strong>Shipping Address:</strong></p>
              <div style="background-color: white; padding: 10px; border-radius: 4px; margin-top: 5px;">
                <p style="margin: 0; color: #374151;">
                  ${customer.firstName} ${customer.lastName}<br>
                  ${customer.address}<br>
                  ${customer.city}, ${customer.state} ${customer.zipCode}
                </p>
              </div>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">🛍️ Order Items:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f1f5f9;">
                    <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Item</th>
                    <th style="padding: 10px; text-align: center; border-bottom: 1px solid #e2e8f0;">Qty</th>
                    <th style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0;">Price</th>
                    <th style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items.map((item: any) => `
                    <tr>
                      <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${item.name}</td>
                      <td style="padding: 10px; text-align: center; border-bottom: 1px solid #f1f5f9;">${item.quantity}</td>
                      <td style="padding: 10px; text-align: right; border-bottom: 1px solid #f1f5f9;">$${item.price.toFixed(2)}</td>
                      <td style="padding: 10px; text-align: right; border-bottom: 1px solid #f1f5f9;">$${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
                <tfoot>
                  <tr style="background-color: #f8fafc;">
                    <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                    <td style="padding: 10px; text-align: right; font-weight: bold;">$${total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; border: 1px solid #dbeafe; margin: 20px 0;">
              <h4 style="color: #1e40af; margin-top: 0;">📦 What's Next?</h4>
              <ul style="color: #374151; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>We'll process your order within 24 hours</li>
                <li>Your order will ship on <strong>${shippingDayName}, ${shippingDateFormatted}</strong></li>
                <li>You'll receive shipping updates via email</li>
                <li>Track your order in your account dashboard</li>
                <li>Estimated delivery: 3-5 business days after shipping</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3001/account" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                📊 Track My Order
              </a>
            </div>
            
            <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0;">
              <p style="margin: 0; color: #065f46; font-size: 14px;">
                <strong>💡 Need Help?</strong> Contact us at support@fshtraders.com or call +1 (555) 123-4567
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Best regards,<br>
              <strong>The FSH Traders Team</strong>
            </p>
          </div>
        </div>
      `,
    };

    // Send confirmation email to customer
    await transporter.sendMail(customerEmail);

    return NextResponse.json(
      { message: 'Order notification sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Order notification error:', error);
    return NextResponse.json(
      { message: 'Failed to send order notification' },
      { status: 500 }
    );
  }
} 