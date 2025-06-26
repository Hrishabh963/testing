import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { FileService } from "../../services/files/file.service";

(pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfjsWorker;

@Component({
  selector: "app-document-viewer",
  templateUrl: "./document-viewer.component.html",
  styleUrls: ["./document-viewer.component.scss"],
})
export class DocumentViewerComponent implements OnInit {
  @ViewChild("pdfContainer", { static: true }) pdfContainer!: ElementRef;
  hideActions: boolean = false;
  pdfDoc: any;
  totalPages = 0;
  loading = true;
  zoom = 1;
  pagesRendered: { [key: number]: boolean } = {};

  fileName: string = "";

  constructor(
    public dialogRef: MatDialogRef<DocumentViewerComponent>,
    private fileService:FileService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.fileName = this.data.fileName || "Document";
    this.loadPdf(this.data.pdfData);
  }

  async loadPdf(url: string) {
    const loadingTask = (pdfjsLib as any).getDocument(url);
    this.pdfDoc = await loadingTask.promise;
    this.totalPages = this.pdfDoc.numPages;
    this.loading = false;
    this.renderVisiblePages();
  }

  renderVisiblePages() {
    if (!this.pdfDoc) return;

    for (let i = 1; i <= this.totalPages; i++) {
      if (!this.pagesRendered[i]) {
        const canvas = document.createElement("canvas");
        canvas.id = "pdf-page-" + i;
        canvas.className = "pdf-page-canvas";
        this.pdfContainer.nativeElement.appendChild(canvas);
        this.renderPage(i, canvas);
      }
    }
  }

  async renderPage(pageNum: number, canvas: HTMLCanvasElement) {
    const page = await this.pdfDoc.getPage(pageNum);
    const context = canvas.getContext("2d")!;
    const viewport = page.getViewport({ scale: this.zoom });

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;
    this.pagesRendered[pageNum] = true;
  }
  
  reRenderAll(): void {
    this.pagesRendered = {};
    const container = this.pdfContainer.nativeElement;
    container.innerHTML = '';
    this.renderVisiblePages();
  }
  downloadPdf(): void {
      const pdfData = this.data.pdfData;
      this.fileService.downloadFromS3(pdfData, true);
     }
  
  zoomIn(): void {
    this.zoom = Math.min(this.zoom + 0.1, 3);
    this.reRenderAll();
  }

  zoomOut(): void {
    this.zoom = Math.max(this.zoom - 0.1, 0.5);
    this.reRenderAll();
  }

  onTagClick(): void {
    this.dialogRef.close({ action: "tag", document: this.data.pdfData });
  }

  onAcceptClick(): void {
    this.dialogRef.close({ action: "accept", document: this.data.pdfData });
  }

  onRejectClick(): void {
    this.dialogRef.close({ action: "reject", document: this.data.pdfData });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
