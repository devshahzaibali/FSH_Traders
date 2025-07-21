import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { Product } from '@/data/products';
type OrderItem = Product & { quantity: number };

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { order, customer } = await request.json();
    if (!order || !customer) {
      return NextResponse.json({ message: 'Order and customer information are required' }, { status: 400 });
    }
    const total = order.items.reduce((sum: number, item: OrderItem) => sum + (item.price * item.quantity), 0);
    const orderDate = new Date(order.createdAt || order.timestamp);
    const shippingDate = new Date(orderDate);
    shippingDate.setDate(shippingDate.getDate() + 2);
    const shippingDayName = shippingDate.toLocaleDateString('en-US', { weekday: 'long' });
    const shippingDateFormatted = shippingDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Build order items table
    const itemsTable = `
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
          ${order.items.map((item: OrderItem) => `
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
    `;

    // Customer details block
    const customerDetails = `
      <div style="margin-bottom: 16px;">
        <h3 style="margin: 0 0 8px 0; color: #1e40af;">Customer Details</h3>
        <p><strong>Name:</strong> ${customer.firstName} ${customer.lastName}</p>
        <p><strong>Email:</strong> ${customer.email}</p>
        <p><strong>Address:</strong> ${order.address ? `${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.zip}, ${order.address.country}` : customer.address || ''}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod || 'N/A'}</p>
      </div>
    `;

    // Email to admin
    await resend.emails.send({
      from: 'FSH Traders <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL || 'shahzaibpc7d@gmail.com',
      subject: `New Order Received: #${order.id}`,
      html: `
        <h2>New Order Received</h2>
        <p><strong>Order ID:</strong> #${order.id}</p>
        <p><strong>Date:</strong> ${orderDate.toLocaleString()}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        ${customerDetails}
        <h3 style="color: #374151;">Order Items</h3>
        ${itemsTable}
        <div style="background-color: #fef3c7; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h4 style="color: #92400e; margin-top: 0;">Shipping Information</h4>
          <p><strong>Estimated Shipping Date:</strong> <span style="color: #d97706; font-weight: bold;">${shippingDayName}, ${shippingDateFormatted}</span></p>
          <p><strong>Estimated Delivery:</strong> <span style="color: #d97706; font-weight: bold;">3-5 business days after shipping</span></p>
        </div>
      `
    });
    // Confirmation to customer
    await resend.emails.send({
      from: 'FSH Traders <onboarding@resend.dev>',
      to: customer.email,
      subject: `Order Confirmation: #${order.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed!</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Thank you for your order!</p>
          </div>
          <div style="background-color: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="color: #374151; line-height: 1.6; margin-top: 0;">
              Dear <strong>${customer.firstName} ${customer.lastName}</strong>,
            </p>
            <p style="color: #374151; line-height: 1.6;">
              We have received your order and are processing it. You'll receive updates as your order progresses.
            </p>
            ${customerDetails}
            <h3 style="color: #374151;">Order Items</h3>
            ${itemsTable}
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <h4 style="color: #92400e; margin-top: 0;">Shipping Information</h4>
              <p><strong>Estimated Shipping Date:</strong> <span style="color: #d97706; font-weight: bold;">${shippingDayName}, ${shippingDateFormatted}</span></p>
              <p><strong>Estimated Delivery:</strong> <span style="color: #d97706; font-weight: bold;">3-5 business days after shipping</span></p>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Best regards,<br>
              <strong>The FSH Traders Team</strong>
            </p>
          </div>
        </div>
      `
    });
    return NextResponse.json({ message: 'Order notification sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Order notification error:', error);
    return NextResponse.json({ message: 'Failed to send order notification' }, { status: 500 });
  }
} 