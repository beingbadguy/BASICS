import sendMail from "./mailer";

export const sendEmailVerificationMail = async (
  email: string,
  verificationToken: string
) => {
  const html = `
    <div style="background-color: #ffffff; padding: 24px; font-family: Arial, sans-serif; color: #000;">
      <div style="max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px;">
        <div style="background-color: #6b21a8; padding: 16px 24px;">
          <h1 style="color: #ffffff; margin: 0;">Basics ⚡</h1>
        </div>
        <div style="padding: 24px;">
          <p>Hello,</p>
          <p>Thanks for registering with <strong>Basics</strong>.</p>
          <p>Your email verification token is:</p>
          <div style="font-size: 20px; font-weight: bold; color: #6b21a8; margin: 16px 0;">${verificationToken}</div>
          <p>Please enter this token to verify your email address.</p>
        </div>
        <div style="background-color: #f9f9f9; padding: 16px; text-align: center; font-size: 12px; color: #999;">
          &copy; ${new Date().getFullYear()} Basics. All rights reserved.
        </div>
      </div>
    </div>
  `;
  sendMail(email, "Basics ⚡ Email Verification", "", html);
};

export const userVerifiedMail = async (email: string) => {
  const html = `
    <div style="background-color: #ffffff; padding: 24px; font-family: Arial, sans-serif; color: #000;">
      <div style="max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px;">
        <div style="background-color: #6b21a8; padding: 16px 24px;">
          <h1 style="color: #ffffff; margin: 0;">Basics ⚡</h1>
        </div>
        <div style="padding: 24px;">
          <p>🎉 Your email has been successfully verified!</p>
          <p>You can now enjoy all the benefits of shopping with <strong>Basics</strong>.</p>
          <p>Happy shopping!</p>
        </div>
        <div style="background-color: #f9f9f9; padding: 16px; text-align: center; font-size: 12px; color: #999;">
          &copy; ${new Date().getFullYear()} Basics. All rights reserved.
        </div>
      </div>
    </div>
  `;
  sendMail(email, "Basics ⚡ Email Verified", "", html);
};

export const forgetPasswordMail = async (email: string, token: string) => {
  const resetLink = `https://shopbasics.vercel.app/reset/${token}`;
  const html = `
    <div style="background-color: #ffffff; padding: 24px; font-family: Arial, sans-serif; color: #000;">
      <div style="max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px;">
        <div style="background-color: #6b21a8; padding: 16px 24px;">
          <h1 style="color: #ffffff; margin: 0;">Basics ⚡</h1>
        </div>
        <div style="padding: 24px;">
          <p>We received a request to reset your password.</p>
          <p>Click the button below to set a new password:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 20px; background-color: #6b21a8; color: #ffffff; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Reset Password
          </a>
          <p>If you did not request this, you can safely ignore this email.</p>
        </div>
        <div style="background-color: #f9f9f9; padding: 16px; text-align: center; font-size: 12px; color: #999;">
          &copy; ${new Date().getFullYear()} Basics. All rights reserved.
        </div>
      </div>
    </div>
  `;
  sendMail(email, "Basics ⚡ Password Reset", "", html);
};

export const passwordResetSuccessMail = async (email: string) => {
  const html = `
    <div style="background-color: #ffffff; padding: 24px; font-family: Arial, sans-serif; color: #000;">
      <div style="max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px;">
        <div style="background-color: #6b21a8; padding: 16px 24px;">
          <h1 style="color: #ffffff; margin: 0;">Basics ⚡</h1>
        </div>
        <div style="padding: 24px;">
          <p>Your password has been successfully reset.</p>
          <p>If this wasn't you, please contact our support immediately.</p>
        </div>
        <div style="background-color: #f9f9f9; padding: 16px; text-align: center; font-size: 12px; color: #999;">
          &copy; ${new Date().getFullYear()} Basics. All rights reserved.
        </div>
      </div>
    </div>
  `;
  sendMail(email, "Basics ⚡ Password Changed", "", html);
};

export const welcomeUserMail = async (email: string, userName: string) => {
  const html = `
    <div style="background-color: #ffffff; padding: 24px; font-family: Arial, sans-serif; color: #000;">
      <div style="max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px;">
        <div style="background-color: #6b21a8; padding: 16px 24px;">
          <h1 style="color: #ffffff; margin: 0;">Welcome to Basics ⚡</h1>
        </div>
        <div style="padding: 24px;">
          <p style="font-size: 16px;">Hey ${userName},</p>
          <p>We're thrilled to have you at <strong>Basics</strong> – your new favorite place to shop online 🛒</p>
          <p>Start exploring awesome deals, trending products, and smooth checkout right away.</p>
          <a href="https://shopbasics.vercel.app" style="display: inline-block; padding: 12px 20px; background-color: #6b21a8; color: #ffffff; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Start Shopping
          </a>
          <p>Need any help? Our team is just a click away.</p>
        </div>
        <div style="background-color: #f9f9f9; padding: 16px; text-align: center; font-size: 12px; color: #999;">
          &copy; ${new Date().getFullYear()} Basics. All rights reserved.
        </div>
      </div>
    </div>
  `;

  sendMail(email, "Welcome to Basics ⚡", "", html);
};

export const newsletterSubscriptionMail = async (email: string) => {
  const html = `
    <div style="background-color: #ffffff; padding: 24px; font-family: Arial, sans-serif; color: #000;">
      <div style="max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px;">
        <div style="background-color: #6b21a8; padding: 16px 24px;">
          <h1 style="color: #ffffff; margin: 0;">You're Subscribed! 📨</h1>
        </div>
        <div style="padding: 24px;">
          <p>Thank you for subscribing to the <strong>Basics</strong> newsletter!</p>
          <p>You'll now receive exclusive deals, product launches, and shopping updates straight to your inbox.</p>
          <a href="https://shopbasics.vercel.app" style="display: inline-block; padding: 12px 20px; background-color: #6b21a8; color: #ffffff; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Explore Now
          </a>
        </div>
        <div style="background-color: #f9f9f9; padding: 16px; text-align: center; font-size: 12px; color: #999;">
          &copy; ${new Date().getFullYear()} Basics. All rights reserved.
        </div>
      </div>
    </div>
  `;

  sendMail(email, "You're Subscribed! 🎉", "", html);
};

// utils/mails/contactConfirmation.ts

export const contactConfirmationMail = async (email: string, name: string) => {
  const html = `
    <div style="background-color: #ffffff; padding: 24px; font-family: Arial, sans-serif; color: #000;">
      <div style="max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px;">
        <div style="background-color: #6b21a8; padding: 16px 24px;">
          <h1 style="color: #ffffff; margin: 0;">Thank You for Reaching Out, ${name}!</h1>
        </div>
        <div style="padding: 24px;">
          <p>We've received your message and our team will get back to you as soon as possible.</p>
          <p>We appreciate your interest in <strong>Basics</strong>.</p>
          <a href="https://shopbasics.vercel.app" style="display: inline-block; padding: 12px 20px; background-color: #6b21a8; color: #ffffff; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Visit Our Website
          </a>
        </div>
        <div style="background-color: #f9f9f9; padding: 16px; text-align: center; font-size: 12px; color: #999;">
          &copy; ${new Date().getFullYear()} Basics. All rights reserved.
        </div>
      </div>
    </div>
  `;

  sendMail(email, "We've received your message 📨", "", html);
};

export const OrderStatusMail = async (
  email: string,
  orderId: string,
  status: string
) => {
  const template = `
    <div style="max-width:600px; margin:0 auto; background:#fff; padding:2rem; font-family:'Segoe UI', sans-serif; border-radius:12px; box-shadow:0 2px 10px rgba(0,0,0,0.05); color:#333;">
      <header style="text-align:left; margin-bottom:1.5rem;">
        <h1 style="font-size:26px; margin:0; color:#000;">Order Status Update 🚚</h1>
        <p style="color:#666; font-size:14px;">Order ID: <strong>#${orderId}</strong></p>
      </header>

      <section style="background:#f9f9f9; padding:1.5rem; border-radius:10px; margin-bottom:1.5rem;">
        <h2 style="font-size:18px; margin:0 0 0.5rem 0; color:#8b5cf6;">Current Status:</h2>
        <p style="font-size:16px; font-weight:500; margin:0;">${
          status.charAt(0).toUpperCase() + status.slice(1)
        }</p>
      </section>

      <p style="font-size:15px;">Thank you for shopping with <strong>Basics</strong>! We'll keep you updated on your order journey.</p>

      <footer style="margin-top:2rem; font-size:12px; color:#aaa; text-align:center;">
        <p>Visit us at <a href="https://shopbasics.vercel.app" style="color:#8b5cf6; text-decoration:none;">shopbasics.vercel.app</a></p>
      </footer>
    </div>
  `;

  await sendMail(email, "Your Order Status Updated 🚚", "", template);
};

export const OrderConfirmationMail = async (
  email: string,
  name: string,
  order: {
    _id: string;
    products: {
      title: string;
      price: number;
      image: string;
      quantity: number;
    }[];
    totalAmount: number;
    address: string;
    paymentMethod: string;
    deliveryType: string;
  }
) => {
  const TAX = 20;
  const grandTotal = order.totalAmount + TAX;

  const html = `
  <style>
    @media only screen and (max-width: 600px) {
      .email-container {
        padding: 16px !important;
      }
    }
  </style>

  <div style="background-color: #f4f4f5; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <div class="email-container" style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      
      <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 10px; color: #1a1a1a;">
        Order confirmation 🛍️
      </h1>

      <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Hi ${name},</p>
      <p style="font-size: 15px; color: #333;">
        Thank you for shopping with us! We've received your order<br/>
        <strong>№: ${order._id}</strong>. We'll notify you when we ship it.
      </p>

      <div style="margin-top: 30px; border: 1px solid #eee; border-radius: 12px; padding: 24px;">
        <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 20px; color: #111;">Order summary</h2>

        ${order.products
          .map(
            (item) => `
            <div style="display: flex; gap: 16px; margin-bottom: 20px; align-items: center;">
              <img src="${item.image}" alt="${item.title}" width="80" height="80" style="border-radius: 10px; object-fit: cover; border: 1px solid #ddd;" />
              <div style="flex: 1;">
                <p style="margin: 0 0 4px 0; font-weight: 600; font-size: 15px; margin-left: 8px;">${item.title}</p>
                <p style="margin: 0; font-weight: 600; color: #1a1a1a; font-size: 15px; margin-left: 8px;">₹${item.price}</p>
                <p style="margin: 0; font-size: 14px; color: #666; margin-left: 8px;">Quantity: ${item.quantity}</p>
              </div>
            </div>
          `
          )
          .join("")}

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />

        <div style="font-size: 15px; color: #333;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Subtotal: </span><span style="margin-left: 8px;">₹${
              order.totalAmount
            }</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Tax (Fixed): </span><span style="margin-left: 8px;">₹${TAX}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 16px; margin-top: 14px;">
            <span>Total:</span><span style="margin-left: 8px;">₹${grandTotal}</span>
          </div>
        </div>
      </div>

      <div style="margin-top: 32px; font-size: 15px; color: #333;">
        <p style="margin-bottom: 10px;"><strong>Shipping Address:</strong><br/>${
          order.address
        }</p>
        <p style="margin-bottom: 0;"><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
      </div>

      <p style="margin-top: 40px; font-size: 13px; color: #888;">
        Need help? Contact us at 
        <a href="https://shopbasics.vercel.app/contact" style="color: #4f46e5; text-decoration: none;">shopbasics.vercel.app/contact</a>
      </p>

      <p style="font-size: 12px; color: #aaa;">shopbasics.vercel.app</p>
    </div>
  </div>
  `;

  await sendMail(email, "Order Confirmed 🛍️ | Basics", "", html);
};
