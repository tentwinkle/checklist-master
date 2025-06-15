export interface InviteEmailOptions {
  to: string;
  firstName: string;
  lastName: string;
  tempPassword: string;
}

export async function sendInviteEmail(options: InviteEmailOptions) {
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  console.log('[Email]', {
    to: options.to,
    subject: 'Your administrator account',
    text: `Hello ${options.firstName} ${options.lastName},\n\n` +
      `Your organization account has been created.\n` +
      `Login: ${options.to}\n` +
      `Temporary password: ${options.tempPassword}\n` +
      `Please log in at ${appUrl}/login and change your password.`,
  });
}
