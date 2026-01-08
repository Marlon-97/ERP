import { EmailClient } from '@azure/communication-email';
import { config } from '../../../config/config.js';

let emailClient;

// Initialize email client if Azure connection string is provided
if (config.azure?.emailConnectionString) {
  emailClient = new EmailClient(config.azure.emailConnectionString);
}

/**
 * Send an email using Azure Communication Service
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.htmlContent - HTML content of the email
 * @param {string} options.plainTextContent - Plain text content (required)
 * @returns {Promise<Object>} - Send result
 */
export const sendEmail = async ({ to, subject, htmlContent, plainTextContent }) => {
  if (!emailClient) {
    console.warn('⚠️ Azure Email Service not configured. Email not sent.');
    console.log('Email details:', { to, subject });
    return { status: 'disabled', message: 'Email service not configured' };
  }

  if (!plainTextContent) {
    throw new Error('Plain text content is required for emails');
  }

  try {
    const message = {
      senderAddress: config.azure.senderEmail || 'DoNotReply@noreply.com',
      content: {
        subject,
        plainText: plainTextContent,
        html: htmlContent
      },
      recipients: {
        to: [{ address: to }]
      }
    };

    const poller = await emailClient.beginSend(message);
    const result = await poller.pollUntilDone();

    console.log(`✅ Email sent to ${to}: ${subject}`);
    return { status: 'sent', result };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

/**
 * Send a welcome email to a new user
 * @param {Object} user - User object
 * @param {string} temporaryPassword - Temporary password (if applicable)
 */
export const sendWelcomeEmail = async (user, temporaryPassword = null) => {
  const plainText = `
Welcome to ERP System!

Hello ${user.username},

Your account has been created successfully. You can now access the ERP system.
${temporaryPassword ? `
Your Login Credentials:
Username: ${user.username}
Temporary Password: ${temporaryPassword}

Please change your password after your first login.
` : ''}
If you have any questions, please contact your system administrator.

Best regards,
ERP System Team
  `.trim();

  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .credentials { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ERP System!</h1>
          </div>
          <div class="content">
            <p>Hello ${user.username},</p>
            <p>Your account has been created successfully. You can now access the ERP system.</p>
            ${temporaryPassword ? `
              <div class="credentials">
                <h3>Your Login Credentials:</h3>
                <p><strong>Username:</strong> ${user.username}</p>
                <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
                <p><em>Please change your password after your first login.</em></p>
              </div>
            ` : ''}
            <p>If you have any questions, please contact your system administrator.</p>
            <p>Best regards,<br>ERP System Team</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: 'Welcome to ERP System',
    htmlContent,
    plainTextContent: plainText
  });
};

/**
 * Send a password reset email
 * @param {Object} user - User object
 * @param {string} resetLink - Password reset link
 */
export const sendPasswordResetEmail = async (user, resetLink) => {
  const plainText = `
Password Reset Request

Hello ${user.username},

We received a request to reset your password. Click the link below to reset it:
${resetLink}

If you didn't request this, please ignore this email.

Best regards,
ERP System Team
  `.trim();

  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello ${user.username},</p>
            <p>We received a request to reset your password. Click the button below to reset it:</p>
            <a href="${resetLink}" class="button">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Best regards,<br>ERP System Team</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    htmlContent,
    plainTextContent: plainText
  });
};
