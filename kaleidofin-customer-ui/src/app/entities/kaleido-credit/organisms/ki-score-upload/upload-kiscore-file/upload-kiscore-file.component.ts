import { Component, EventEmitter, Output } from "@angular/core";
import { UploadService } from "../../../services/upload.service";
import { CustomMessageDisplayComponent } from "../../../shared/custom-message-display/custom-message-display.component";
import { MatDialog } from "@angular/material/dialog";
import { ACCEPTED_FILE_TYPES_FOR_KISCORE_UPLOAD } from "../../../shared/file-upload/file.constants";

@Component({
  selector: "app-upload-kiscore-file",
  templateUrl: "./upload-kiscore-file.component.html",
  styleUrls: ["./upload-kiscore-file.component.scss"],
})
export class UploadKiscoreFileComponent {
  isUploading = false;
  uploadProgress = 0;
  uploadedSize = 0;
  totalSize = 1;
  intervalId: any;
  selectedFiles: File[] = [];

  acceptedFileTypes = "";
  @Output() fetchKiscore = new EventEmitter();

  constructor(private readonly uploadService: UploadService, private readonly dialog: MatDialog) {
    this.acceptedFileTypes = ACCEPTED_FILE_TYPES_FOR_KISCORE_UPLOAD.map(
      (type) => `.${type}`
    ).join(",");
  }
  onFileSelected(event: any) {
    const newFiles: File[] = Array.from(event.target.files);
    this.selectedFiles.push(...newFiles); // Allow multiple file additions
    this.calculateTotalSize();
    this.uploadFiles();
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const newFiles = Array.from(event.dataTransfer?.files || []);
    this.selectedFiles.push(...newFiles); // Add dropped files
    this.calculateTotalSize();
    this.uploadFiles();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  calculateTotalSize() {
    this.totalSize = this.selectedFiles.reduce(
      (acc, file) => acc + file.size / (1024 * 1024),
      0
    );
  }

  startDummyProgress() {
    this.isUploading = true;
    this.uploadProgress = 0;
    this.uploadedSize = 0;

    this.intervalId = setInterval(() => {
      if (this.uploadProgress < 70) {
        this.uploadProgress += 7;
        this.uploadedSize = (this.uploadProgress / 100) * this.totalSize;
      } else {
        clearInterval(this.intervalId);
      }
    }, 500);
  }

  completeDummyProgress() {
    clearInterval(this.intervalId);
    this.uploadProgress = 100;
    this.uploadedSize = this.totalSize;
  }

  async uploadFiles() {
    if (this.selectedFiles.length === 0) {
      alert("Please select files to upload");
      return;
    }

    this.startDummyProgress();

    await this.uploadService
      .uploadKiScoreReport(this.selectedFiles)
      .then(() => {
        this.completeDummyProgress();
        this.uploadProgress = 100;
        this.uploadedSize = this.totalSize;
        this.uploadProgress = 0;
        this.uploadedSize = 0;

        const confirmationDialog = this.dialog.open(
          CustomMessageDisplayComponent,

          {
            maxWidth: "35vw",
            minWidth: "30vw",
            disableClose: true,
            data: {
              buttonText: "GOT IT",
              description:
                "File upload completed. Status can be downloaded from reports section",
              isErrorDisplay: false,
              canReload: true,
            },
          }
        );
        confirmationDialog.afterClosed().subscribe((event) => {
          console.log("from got it", event);
          if (event) {
            this.fetchKiscore.emit();
          }
        });
      })
      .catch(() => {
        const confirmationDialog = this.dialog.open(
          CustomMessageDisplayComponent,
          {
            maxWidth: "35vw",
            minWidth: "30vw",
            data: {
              buttonText: "Cancel",
              description:
                "File upload failed. Please check the file and try again",
              isErrorDisplay: true,
              canReload: true,
              additionalButton: {
                text: "ReUpload",
              },
            },
          }
        );
        confirmationDialog.afterClosed().subscribe((event) => {
          console.log(event);
          this.cancelUpload();
        });
      });
  }

  cancelUpload() {
    clearInterval(this.intervalId);
    this.isUploading = false;
    this.uploadProgress = 0;
    this.uploadedSize = 0;
  }
}
