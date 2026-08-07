import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from "pdf-lib";
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

// ============================================================
// Constitution PDF export — full document, watermarked on every page.
// ============================================================

interface ConstitutionSectionInput {
  title: string;
  content: string;
  children: { title: string; content: string }[];
}

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN_X = 50;
const CONTENT_TOP = 780;
const CONTENT_BOTTOM = 70;

/** Breaks text into lines that fit within maxWidth for the given font/size. */
function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const lines: string[] = [];
  // Preserve existing paragraph breaks the user typed.
  const paragraphs = text.split(/\r?\n/);
  for (const para of paragraphs) {
    if (para.trim() === "") {
      lines.push("");
      continue;
    }
    const words = para.split(" ");
    let current = "";
    for (const word of words) {
      const trial = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(trial, size) > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = trial;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

/** Draws a large, faint, diagonal watermark across the page. */
function drawWatermark(page: PDFPage, font: PDFFont, text: string) {
  const size = 48;
  const textWidth = font.widthOfTextAtSize(text, size);
  page.drawText(text, {
    x: PAGE_WIDTH / 2 - textWidth / 2,
    y: PAGE_HEIGHT / 2,
    size,
    font,
    color: rgb(0.85, 0.85, 0.85),
    opacity: 0.35,
    rotate: { type: "degrees", angle: 35 } as any,
  });
}

async function drawHeader(
  doc: PDFDocument,
  page: PDFPage,
  boldFont: PDFFont,
  groupName: string,
  logoData: Buffer | null,
  logoContentType: string | null
): Promise<number> {
  let y = CONTENT_TOP + 20;
  if (logoData) {
    try {
      const isPng = logoContentType?.includes("png");
      const image = isPng ? await doc.embedPng(logoData) : await doc.embedJpg(logoData);
      const dims = image.scale(36 / image.height);
      page.drawImage(image, { x: MARGIN_X, y: y - 16, width: dims.width, height: dims.height });
      page.drawText(groupName, { x: MARGIN_X + dims.width + 10, y: y - 6, size: 12, font: boldFont });
    } catch {
      page.drawText(groupName, { x: MARGIN_X, y: y - 6, size: 12, font: boldFont });
    }
  } else {
    page.drawText(groupName, { x: MARGIN_X, y: y - 6, size: 12, font: boldFont });
  }
  return CONTENT_TOP - 30; // starting y for body content, below the header
}

/**
 * Generates the full constitution as a multi-page, watermarked PDF.
 * Every page carries the group logo/name in the header and a diagonal
 * "NEMSS 2014 SET"-style watermark (driven by groupName) across the middle.
 */
export async function buildConstitutionPdf(sections: ConstitutionSectionInput[]): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  const settings = await prisma.organizationSettings.findFirst();
  const groupName = settings?.groupName || "Constitution";
  let logoData: Buffer | null = null;
  if (settings?.logoData) {
    try {
      logoData = decryptBuffer(Buffer.from(settings.logoData));
    } catch {
      logoData = null;
    }
  }
  const watermarkText = "NEMSS 2014 SET";

  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  drawWatermark(page, boldFont, watermarkText);
  let y = await drawHeader(doc, page, boldFont, groupName, logoData, settings?.logoContentType || null);

  page.drawText("Constitution", { x: MARGIN_X, y, size: 22, font: boldFont });
  y -= 34;

  async function newPage() {
    page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    drawWatermark(page, boldFont, watermarkText);
    y = await drawHeader(doc, page, boldFont, groupName, logoData, settings?.logoContentType || null);
  }

  async function ensureSpace(neededHeight: number) {
    if (y - neededHeight < CONTENT_BOTTOM) {
      await newPage();
    }
  }

  async function drawParagraph(text: string, size: number, useFont: PDFFont, lineHeight: number, color = rgb(0.1, 0.1, 0.15)) {
    const lines = wrapText(text, useFont, size, PAGE_WIDTH - MARGIN_X * 2);
    for (const line of lines) {
      await ensureSpace(lineHeight);
      page.drawText(line, { x: MARGIN_X, y, size, font: useFont, color });
      y -= lineHeight;
    }
  }

  for (const section of sections) {
    await ensureSpace(40);
    y -= 10;
    await drawParagraph(section.title, 15, boldFont, 20);
    if (section.content?.trim()) {
      await drawParagraph(section.content, 10.5, font, 15);
    }

    for (const child of section.children) {
      await ensureSpace(30);
      y -= 6;
      await drawParagraph(child.title, 12, boldFont, 17);
      if (child.content?.trim()) {
        await drawParagraph(child.content, 10.5, font, 15);
      }
    }
  }

  return doc.save();
}
