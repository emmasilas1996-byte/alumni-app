import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { prisma } from "./db";
import { decryptBuffer } from "./crypto";

interface PdfRow {
  name: string;
  amount: number;
  date: string;
}

interface BuildPdfInput {
  title: string;
  subtitle?: string;
  rows: PdfRow[];
  total: number;
}

/** Generates a branded PDF (logo + title + table) and returns the bytes. */
export async function buildRecordPdf({ title, subtitle, rows, total }: BuildPdfInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  let y = 800;

  // Logo, if one is set in OrganizationSettings
  const settings = await prisma.organizationSettings.findFirst();
  if (settings?.logoData) {
    try {
      const logoBytes = decryptBuffer(Buffer.from(settings.logoData));
      const isPng = settings.logoContentType?.includes("png");
      const image = isPng ? await doc.embedPng(logoBytes) : await doc.embedJpg(logoBytes);
      const logoDims = image.scale(40 / image.height);
      page.drawImage(image, { x: 50, y: y - 20, width: logoDims.width, height: logoDims.height });
    } catch {
      // logo decrypt/embed failure shouldn't block the export
    }
  }

  page.drawText(settings?.groupName || "NEMSS 2014 SET", {
    x: 110,
    y: y - 5,
    size: 12,
    font: boldFont,
  });

  y -= 60;
  page.drawText(title, { x: 50, y, size: 18, font: boldFont });
  y -= 22;
  if (subtitle) {
    page.drawText(subtitle, { x: 50, y, size: 11, font, color: rgb(0.4, 0.4, 0.4) });
    y -= 22;
  }

  y -= 10;
  page.drawText("Name", { x: 50, y, size: 11, font: boldFont });
  page.drawText("Amount", { x: 320, y, size: 11, font: boldFont });
  page.drawText("Date", { x: 430, y, size: 11, font: boldFont });
  y -= 6;
  page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 1, color: rgb(0.7, 0.7, 0.7) });
  y -= 18;

  for (const row of rows) {
    if (y < 60) break; // simple single-page cap; extend to multi-page if lists grow large
    page.drawText(row.name, { x: 50, y, size: 10, font });
    page.drawText(`NGN ${row.amount.toLocaleString()}`, { x: 320, y, size: 10, font });
    page.drawText(row.date, { x: 430, y, size: 10, font });
    y -= 16;
  }

  y -= 10;
  page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 1, color: rgb(0.7, 0.7, 0.7) });
  y -= 20;
  page.drawText(`Total: NGN ${total.toLocaleString()}`, { x: 50, y, size: 12, font: boldFont });

  return doc.save();
}
