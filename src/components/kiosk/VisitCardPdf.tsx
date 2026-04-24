"use client";

import { jsPDF } from "jspdf";

type PdfProps = {
  name?: string | null;
  company?: string | null;
  imageUrl?: string | null;
  idNumber?: string | null;
  visitType?: string | null;
  date?: string | null;
};

async function loadImageAsDataUrl(url?: string | null): Promise<string | null> {
  if (!url) return null;
  if (url.startsWith("data:")) return url;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed reading image blob"));
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn("Failed to fetch image", err);
    return null;
  }
}

export async function generateVisitCardPdf(props: PdfProps): Promise<Blob> {
  const { name, company, imageUrl, idNumber, visitType, date } = props;
  const imgDataUrl = await loadImageAsDataUrl(imageUrl);

  const width = 520;
  const height = 300;
  const leftW = 120;
  const padding = 12;

  const doc = new jsPDF({ unit: "px", format: [width, height] });

  // white background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, width, height, "F");

  // left sidebar
  doc.setFillColor(30, 45, 74);
  doc.rect(0, 0, leftW, height, "F");

  // Logo
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("Logo", leftW / 2, 30, { align: "center" });

  // Visit type
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text((visitType ?? "VISITOR").toUpperCase(), leftW / 2, 150, {
    align: "center",
  });

  // Date
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(date ?? "", leftW / 2, 170, { align: "center" });

  // Right content
  const rightX = leftW + padding;
  const imgX = rightX;
  const imgY = 30;
  const imgW = 64;
  const imgH = 64;

  if (imgDataUrl) {
    const imgType = imgDataUrl.startsWith("data:image/png") ? "PNG" : "JPEG";
    try {
      doc.addImage(imgDataUrl, imgType as any, imgX, imgY, imgW, imgH);
    } catch (e) {
      console.warn("addImage failed", e);
      doc.setFillColor(240, 240, 240);
      doc.rect(imgX, imgY, imgW, imgH, "F");
    }
  } else {
    doc.setFillColor(240, 240, 240);
    doc.rect(imgX, imgY, imgW, imgH, "F");
  }

  const textX = imgX + imgW + 12;
  let cursorY = imgY + 24;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(30, 45, 74);
  doc.text(name ?? "Guest", textX, cursorY);

  if (company) {
    cursorY += 20;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(company, textX, cursorY);
  }

  if (idNumber) {
    const idY = imgY + imgH + 30;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("ID", rightX, idY);

    doc.setFont("courier", "normal");
    doc.setFontSize(12);
    doc.setTextColor(30, 45, 74);
    doc.text(String(idNumber), rightX, idY + 16);
  }

  const blob = doc.output("blob");
  return blob;
}

export default generateVisitCardPdf;
