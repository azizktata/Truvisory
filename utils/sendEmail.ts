import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error('Gmail credentials not configured');
    }

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

export async function sendContactEmail(
  name: string,
  email: string,
  phone: string,
  message: string
): Promise<EmailResult> {
  const html = `
    <h2>Nouveau message de contact - TRUVISORY</h2>
    <p><strong>Nom:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Téléphone:</strong> ${phone}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `;

  const text = `
    Nouveau message de contact - TRUV

    Nom: ${name}
    Email: ${email}
    Téléphone: ${phone}
    Message: ${message}
  `;

  return sendEmail({
    to: process.env.CONTACT_EMAIL || process.env.GMAIL_USER || '',
    subject: `Nouveau contact de ${name} - TRUV`,
    html,
    text,
  });
}
