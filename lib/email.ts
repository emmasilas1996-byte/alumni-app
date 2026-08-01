import nodemailer from "nodemailer";

// ============================================================
// Gmail SMTP transporter — free tier (~500 emails/day on a
// regular Gmail account). Requires GMAIL_USER + GMAIL_APP_PASSWORD
// (a 16-character App Password, NOT your normal Gmail password —
// generate one at myaccount.google.com/apppasswords after turning
// on 2-Step Verification).
// ============================================================

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error("GMAIL_USER / GMAIL_APP_PASSWORD not set in .env");
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

const BIRTHDAY_LINES = [
  "Wishing you a year filled with laughter, good health, and even better memories.",
  "May this new year of life bring you closer to every goal you're chasing.",
  "Here's to another year of showing up for this community the way you always do.",
  "May your day be as bright and memorable as the mark you've left here.",
  "Cheers to you — may the year ahead treat you with the same warmth you give others.",
];

const NEW_MONTH_LINES = [
  "May this month bring fresh opportunities and steady progress.",
  "Here's to new beginnings, renewed energy, and good things ahead.",
  "May every week this month move you closer to your goals.",
  "Wishing you clarity, strength, and good news this month.",
  "May this month be lighter, brighter, and full of wins — big and small.",
];

function pickLine(lines: string[]): string {
  return lines[Math.floor(Math.random() * lines.length)];
}

interface BirthdayEmailInput {
  toEmail: string;
  firstName: string;
  photoBuffer?: Buffer | null;
  photoContentType?: string | null;
}

export async function sendBirthdayEmail({
  toEmail,
  firstName,
  photoBuffer,
  photoContentType,
}: BirthdayEmailInput) {
  const transporter = getTransporter();
  const message = pickLine(BIRTHDAY_LINES);

  const attachments = photoBuffer
    ? [
        {
          filename: `celebrant.${(photoContentType || "image/jpeg").split("/")[1] || "jpg"}`,
          content: photoBuffer,
          cid: "celebrant-photo",
        },
      ]
    : [];

  const photoHtml = photoBuffer
    ? `<img src="cid:celebrant-photo" alt="${firstName}" style="width:160px;height:160px;object-fit:cover;border-radius:50%;margin-bottom:16px;" />`
    : "";

  await transporter.sendMail({
    from: `"NEMSS 2014 SET" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: `Happy Birthday, ${firstName}! 🎉`,
    html: `
      <div style="font-family:Arial,sans-serif;text-align:center;padding:24px;">
        ${photoHtml}
        <h2>Happy Birthday, ${firstName}!</h2>
        <p style="font-size:15px;color:#333;">${message}</p>
        <p style="font-size:13px;color:#888;">— From all of us at NEMSS 2014 SET</p>
      </div>
    `,
    attachments,
  });
}

interface NewMonthEmailInput {
  toEmail: string;
  firstName: string;
  monthName: string;
}

export async function sendNewMonthEmail({ toEmail, firstName, monthName }: NewMonthEmailInput) {
  const transporter = getTransporter();
  const message = pickLine(NEW_MONTH_LINES);

  await transporter.sendMail({
    from: `"NEMSS 2014 SET" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: `Happy New Month, ${firstName}! 🎉`,
    html: `
      <div style="font-family:Arial,sans-serif;text-align:center;padding:24px;">
        <h2>Happy New Month, ${firstName}!</h2>
        <p style="font-size:15px;color:#333;">As we step into ${monthName}, ${message.charAt(0).toLowerCase() + message.slice(1)}</p>
        <p style="font-size:13px;color:#888;">— From all of us at NEMSS 2014 SET</p>
      </div>
    `,
  });
}
