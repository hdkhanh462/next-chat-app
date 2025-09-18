import nodemailer from "nodemailer";

import { env } from "@/env";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.GOOGLE_EMAIL_SENDER,
    pass: env.GOOGLE_EMAIL_SENDER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

type EmailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  const info = await transporter.sendMail({
    from: `"Next Chat App" <${env.GOOGLE_EMAIL_SENDER}>`,
    to,
    subject,
    text,
    html,
  });

  console.log(" Message sent:", info.messageId);
}
