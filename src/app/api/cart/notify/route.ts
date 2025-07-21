import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { cart, customer, total } = await request.json();

    console.log('Cart notification request received:', { cart, customer, total });

    // Validate required fields
    if (!cart || !customer || !total) {
      console.error('Missing required fields:', { cart: !!cart, customer: !!customer, total: !!total });
      return NextResponse.json(
        { message: 'Cart, customer, and total information are required' },
        { status: 400 }
      );
    }

    // Calculate shipping date (2 days from current date)
    const currentDate = new Date();
    const shippingDate = new Date(currentDate);
    shippingDate.setDate(shippingDate.getDate() + 2);
    const shippingDayName = shippingDate.toLocaleDateString('en-US', { weekday: 'long' });
    const shippingDateFormatted = shippingDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Email HTML content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🛒 Cart Checkout</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">You're one step away from completing your order</p>
        </div>
        <div style="background-color: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="color: #374151; line-height: 1.6; margin-top: 0;">
            Dear <strong>${customer.firstName} ${customer.lastName}</strong>,
          </p>
          <p style="color: #374151; line-height: 1.6;">
            We noticed you've added items to your cart and are ready to checkout. Here's a summary of your cart items and shipping information.
          </p>
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1e40af; margin-top: 0;">📋 Cart Summary:</h3>
            <p><strong>Cart Total:</strong> <span style="font-weight: bold; color: #1e40af;">$${total.toFixed(2)}</span></p>
            <p><strong>Items in Cart:</strong> ${cart.length} item${cart.length > 1 ? 's' : ''}</p>
            <p><strong>Checkout Date:</strong> ${currentDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</p>
          </div>
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">🛍️ Cart Items:</h3>
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
                ${cart.map((item: { name: string; quantity: number; price: number }) => `
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
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin-top: 0;">🚚 Shipping Information:</h3>
            <p><strong>Estimated Shipping Date:</strong> <span style="color: #d97706; font-weight: bold;">${shippingDayName}, ${shippingDateFormatted}</span></p>
            <p><strong>Estimated Delivery:</strong> <span style="color: #d97706; font-weight: bold;">3-5 business days after shipping</span></p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3001/cart" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              🛒 Complete Checkout
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            <strong>The FSH Traders Team</strong>
          </p>
        </div>
      </div>
    `;

    // Send email to customer
    try {
      await resend.emails.send({
        from: 'FSH Traders <onboarding@resend.dev>',
        to: customer.email,
        subject: `Your Cart Checkout - FSH Traders`,
        html: htmlContent,
      });
    } catch (emailError) {
      console.error('Failed to send cart notification email:', emailError);
      return NextResponse.json(
        { message: 'Failed to send cart notification email', error: emailError instanceof Error ? emailError.message : String(emailError) },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Cart checkout notification sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Cart checkout notification error:', error);
    return NextResponse.json(
      { message: 'Failed to send cart checkout notification', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 