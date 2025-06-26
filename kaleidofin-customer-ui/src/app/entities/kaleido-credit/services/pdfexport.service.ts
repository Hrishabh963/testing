import { Injectable } from "@angular/core";
import * as jspdf from "jspdf";
import html2canvas from "html2canvas";

@Injectable({
  providedIn: "root",
})
export class PdfExportService {
  constructor() {}

  async downloadCurrentPageAsPdf(pdfName?: string) {
    const filename = pdfName ? `${pdfName}.pdf` : "report.pdf";
  
    const downloadButton = document.getElementById("pdf-download-button");
    if (downloadButton) {
      downloadButton.style.display = "none";
    }
  
    try {
      const element = document.getElementById("pdf-capture") || document.documentElement;
      const maxWidth = document.body.scrollWidth;
      const maxHeight = document.body.scrollHeight;
      const imageQuality = 0.8;
      const pdf = new jspdf.jsPDF("p", "mm", [maxWidth, maxHeight], false);
  
      const images = Array.from(document.images);
      await Promise.all(
        images.map((img) => {
          return new Promise((resolve) => {
            img.crossOrigin = "anonymous";
            if (!img.complete) {
              img.addEventListener("load", resolve);
              img.addEventListener("error", resolve); // Ignore errors
            } else {
              resolve(null);
            }
          });
        })
      );
  
      const canvas = await html2canvas(element, {
        width: maxWidth,
        height: maxHeight,
        useCORS: true,
        allowTaint: false,
        scrollY: -window.scrollY, 
        logging: false,
      });
  
      const imgData = canvas.toDataURL("image/jpeg", imageQuality);
      const aspectRatio = canvas.width / canvas.height;
      const adjustedHeight = maxWidth / aspectRatio;
  
      pdf.addImage(imgData, "JPEG", 0, 0, maxWidth, adjustedHeight);
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      if (downloadButton) {
        downloadButton.style.display = "block";
      }
    }
  }
  
}
