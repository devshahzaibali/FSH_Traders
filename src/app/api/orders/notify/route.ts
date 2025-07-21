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
    // Email to admin
    await resend.emails.send({
      from: 'FSH Traders <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL || 'shahzaibpc7d@gmail.com',
      subject: `New Order Received: #${order.id}`,
      html: `<h2>New Order Received</h2><p><strong>Order ID:</strong> #${order.id}</p><p><strong>Date:</strong> ${new Date(order.timestamp).toLocaleString()}</p><p><strong>Status:</strong> ${order.status}</p><p><strong>Total Amount:</strong> $${total.toFixed(2)}</p>`
    });
    // Confirmation to customer
    await resend.emails.send({
      from: 'FSH Traders <onboarding@resend.dev>',
      to: customer.email,
      subject: `Order Confirmation: #${order.id}`,
      html: `<h2>Order Confirmed!</h2><p>Dear <strong>${customer.firstName} ${customer.lastName}</strong>,</p><p>Thank you for your order! We have received your order and are processing it. You'll receive updates as your order progresses.</p>`
    });
    return NextResponse.json({ message: 'Order notification sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Order notification error:', error);
    return NextResponse.json({ message: 'Failed to send order notification' }, { status: 500 });
  }
} 