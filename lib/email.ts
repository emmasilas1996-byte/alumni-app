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
  "Happy Birthday! May your dreams continue to unfold beautifully.",
  "Wishing you endless joy, peace, and success in the year ahead.",
  "May today remind you how valued and appreciated you truly are.",
  "May your heart be filled with gratitude and your days with happiness.",
  "Here's to good health, new opportunities, and unforgettable moments.",
  "May this birthday be the beginning of your best chapter yet.",
  "Wishing you wisdom, strength, and countless reasons to smile.",
  "Celebrate today knowing that you make a difference every day.",
  "May every candle on your cake shine as brightly as your future.",
  "Wishing you love, laughter, and lasting happiness.",
  "May this special day bring peace, joy, and cherished memories.",
  "Happy Birthday! May every blessing you desire find its way to you.",
  "May your journey ahead be filled with purpose and fulfillment.",
  "Here's to another year of making beautiful memories.",
  "May success and happiness follow you wherever you go.",
  "Wishing you abundant grace and favor in all you do.",
  "May your kindness return to you in countless ways.",
  "Have a fantastic birthday and an even more amazing year ahead.",
  "May every moment today remind you how special you are.",
  "Wishing you strength for every challenge and joy in every victory.",
  "May today be filled with pleasant surprises and genuine smiles.",
  "Happy Birthday! Keep inspiring those around you.",
  "May your future be brighter than your brightest dreams.",
  "Wishing you endless blessings and beautiful moments.",
  "May your life continue to be filled with purpose and peace.",
  "Celebrate yourself today—you deserve every bit of happiness.",
  "May this birthday open doors to greater opportunities.",
  "Wishing you countless reasons to be thankful this year.",
  "May every step you take lead to success.",
  "Happy Birthday! Keep shining wherever life takes you.",
  "May joy surround you today and always.",
  "Wishing you a lifetime of meaningful friendships and love.",
  "May your heart always find reasons to rejoice.",
  "May this year exceed every expectation you have.",
  "Happy Birthday! Wishing you a beautiful celebration.",
  "May each day ahead bring fresh hope and inspiration.",
  "Wishing you peace that surpasses every challenge.",
  "May your life be filled with blessings beyond measure.",
  "Happy Birthday! May happiness never depart from your home.",
  "Wishing you prosperity, favor, and good health always.",
  "May every dream you've planted bloom in its season.",
  "Here's to another year of growth and achievement.",
  "May your smile continue to brighten the lives of others.",
  "Wishing you unforgettable moments and lasting happiness.",
  "Happy Birthday! May today and every day ahead be truly wonderful."
];

const NEW_MONTH_LINES = [
  "May this month bring fresh opportunities and steady progress.",
  "Here's to new beginnings, renewed energy, and good things ahead.",
  "May every week this month move you closer to your goals.",
  "Wishing you clarity, strength, and good news this month.",
  "May this month be lighter, brighter, and full of wins — big and small.",
  "Welcome to a month filled with hope and endless possibilities.",
  "May every day this month bring a reason to smile.",
  "Wishing you success in every endeavor this month.",
  "May your hard work produce remarkable results this month.",
  "May peace and joy accompany you throughout this month.",
  "Here's to a productive and fulfilling new month.",
  "May unexpected blessings find you this month.",
  "Wishing you wisdom for every decision you make.",
  "May every challenge become an opportunity for growth.",
  "May this month be filled with pleasant surprises.",
  "Wishing you favor in every place you go.",
  "May your efforts be rewarded beyond your expectations.",
  "Here's to new achievements and meaningful progress.",
  "May this month bring healing, hope, and happiness.",
  "Wishing you courage to pursue every opportunity.",
  "May every day bring fresh inspiration.",
  "May your goals become reality one step at a time.",
  "Wishing you abundant peace and lasting joy.",
  "May this month be your most rewarding yet.",
  "May doors of opportunity open for you.",
  "Here's to stronger relationships and brighter days.",
  "May your plans succeed beyond expectation.",
  "Wishing you renewed strength for every challenge.",
  "May this month overflow with reasons to celebrate.",
  "May kindness and favor surround you always.",
  "Here's to making meaningful memories this month.",
  "May your work bring satisfaction and success.",
  "Wishing you confidence to embrace every opportunity.",
  "May every sunrise bring fresh hope.",
  "May this month be filled with answered prayers.",
  "Wishing you financial growth and stability.",
  "May your journey this month be smooth and rewarding.",
  "Here's to greater achievements and lasting peace.",
  "May every day bring positive surprises.",
  "Wishing you happiness that lasts beyond this month.",
  "May your efforts inspire others around you.",
  "Here's to stronger faith and brighter possibilities.",
  "May your month be filled with meaningful connections.",
  "Wishing you patience, wisdom, and success.",
  "May this month exceed all your expectations.",
  "Here's to consistent progress in all you do.",
  "May every opportunity lead you closer to your dreams.",
  "Wishing you countless victories, both big and small.",
  "May this month be remembered for all the right reasons.",
  "Welcome to a month of growth, gratitude, and great accomplishments."
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
