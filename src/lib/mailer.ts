import nodemailer from 'nodemailer';

export interface InviteEmailOptions {
  to: string;
  firstName: string;
  lastName: string;
  tempPassword: string;
  subject?: string;
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 465),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export async function sendInviteEmail(options: InviteEmailOptions) {
  const appUrl = process.env.APP_URL || 'http://localhost:3000';

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: options.to,
    subject: options.subject || 'Your administrator account',
    text:
      `Hello ${options.firstName} ${options.lastName},\n\n` +
      `Your organization account has been created.\n` +
      `Login: ${options.to}\n` +
      `Temporary password: ${options.tempPassword}\n` +
      `Please log in at ${appUrl}/login and change your password.`,
  };

  await getTransporter().sendMail(mailOptions);
}
