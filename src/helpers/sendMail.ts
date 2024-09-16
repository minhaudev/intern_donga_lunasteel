import nodemailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  //   host: process.env.MAIL_HOST,
  //   port: process.env.MAIL_POST,
  secure: false,
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
} as SMTPTransport.Options);

interface Props {
  sender: string;
  recipient: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendMail({
  sender,
  recipient,
  subject,
  text,
  html,
}: Props) {
  const info = await transporter.sendMail({
    from: sender,
    to: recipient,
    subject: subject,
    text: text,
    html: html,
  });
  console.log('Message Sent', info.messageId);
  return info;
}
