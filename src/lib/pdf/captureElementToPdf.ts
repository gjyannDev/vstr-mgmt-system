"use client";

import { jsPDF } from "jspdf";

export async function captureElementToPdf(
  element: HTMLElement | null,
  fileName = "visit-card.pdf",
): Promise<Blob> {
  if (!element) throw new Error("No element provided");

  // dynamic import to avoid SSR issues
  const { toPng } = await import("html-to-image");

  // render element to PNG
  const dataUrl = await toPng(element, {
    backgroundColor: "#ffffff",
    cacheBust: true,
    pixelRatio: 2,
  });

  const img = new Image();
  img.src = dataUrl;
  await new Promise((resolve, reject) => {
    img.onload = () => resolve(true);
    img.onerror = (e) => reject(e);
  });

  // Use element bounding box (CSS pixels) for PDF dimensions so PDF matches
  // the visible element size instead of high-resolution image pixel size.
  const rect = element.getBoundingClientRect();
  const width = Math.ceil(rect.width);
  const height = Math.ceil(rect.height);

  const doc = new jsPDF({ unit: "px", format: [width, height] });
  doc.addImage(dataUrl, "PNG" as any, 0, 0, width, height);

  const blob = doc.output("blob");

  // trigger download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  return blob;
}

export default captureElementToPdf;
