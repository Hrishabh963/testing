import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { get } from "lodash";
import { getProperty } from "src/app/utils/app.utils";
import { CustomDisplayPopupComponent } from "../custom-display-popup/custom-display-popup.component";
import {
  getFileExtension,
  getThumbnailUrl,
  validateFileTypes,
} from "./file-utils";
import {
  ACCEPTED_FILE_TYPES,
  DocumentDTO,
  FILE_LIMIT_ERROR_MESSAGE_FOR_UPLOAD,
  FILE_SIZE_ERROR_MESSAGE_FOR_UPLOAD,
  FILE_TYPE_ERROR_MESSAGE_FOR_UPLOAD,
  FILE_UPLOAD_INFO_TEXT,
  FILE_UPLOAD_LIMIT,
  FILE_UPLOAD_MAX_SIZE,
  getFileUploadLimitMessage,
} from "./file.constants";

@Component({
  selector: "app-file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.scss"],
})
export class FileUploadComponent implements AfterViewInit {
  files: any[] = [];
  fileIconPath: string = "";
  @Input() isKiscoreUpload: boolean = false;
  @Input() uploadInfoText: string = FILE_UPLOAD_INFO_TEXT;
  @Input() acceptedFileTypes: string[] = ACCEPTED_FILE_TYPES;
  @Input() fileTypeErrorMessage: string = FILE_TYPE_ERROR_MESSAGE_FOR_UPLOAD;
  @Input() fileSizeErrorMessage: string = FILE_SIZE_ERROR_MESSAGE_FOR_UPLOAD;
  @Input() fileLimitErrorMessage: string = FILE_LIMIT_ERROR_MESSAGE_FOR_UPLOAD;
  @Input() fileUploadLimit: number = FILE_UPLOAD_LIMIT;
  @Input() canAllowMultiple: boolean = true;
  @Input() openByDefault: boolean = true;
  @Input() selectedDocuments: Array<File> = [];
  @Input() fileUploadTitle: string = "Drag & drop or Attach file";
  @Input() uploadedDocuments: DocumentDTO[] = [];

  @ViewChild("fileDropRef") fileDropEl: ElementRef<HTMLInputElement>;

  @Output() passFileSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() removeSelectedDocument: EventEmitter<any> = new EventEmitter<any>();

  sendFilesStatus(data: any) {
    this.passFileSelected.emit(data);
  }
  constructor(
    private readonly dialog: MatDialog,
    private readonly dialogRef: MatDialogRef<CustomDisplayPopupComponent>,
    private readonly domSanitizer: DomSanitizer
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.fileDropEl && this.openByDefault) {
        this.fileDropEl.nativeElement.click();
      }
    });
    this.files = this.selectedDocuments;
  }
  // Method to open the error dialog
  openErrorDialog(errorTitle: string, errorMessage: string): void {
    this.dialog.open(CustomDisplayPopupComponent, {
      maxWidth: "40vw",
      minHeight: "40vh",
      minWidth: "30vw",
      data: {
        title: errorTitle,
        description: errorMessage,
        isErrorDisplay: true,
        actionButtons: [
          {
            buttonText: "Cancel",
            buttonClassName: "btn-secondary",
            onClickHandler: () => this.dialogRef.close(),
          },
          {
            buttonText: "Retry",
            buttonClassName: "btn-primary",
            onClickHandler: () => this.dialogRef.close(),
          },
        ],
      },
    });
  }

  fileBrowseHandler(event) {
    if (!this.prepareFilesList(getProperty(event, "target.files", null))) {
      event.target.value = null;
    }
  }
  deleteFile(index: number) {
    this.files.splice(index, 1);
    this.sendFilesStatus(this.files);
  }
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  prepareFilesList(files: Array<any>) {
    let validFiles = files;
    // Separate files into duplicates and unique files

    const duplicateResponse = this.findDuplicateElements(
      this.files.map((file) => file.name),
      Array.from(files).map((file) => file.name)
    );

    if (getProperty(duplicateResponse, "hasDuplicates", false)) {
      const duplicateFiles = getProperty(
        duplicateResponse,
        "duplicateElements",
        []
      );
      if (duplicateFiles.length > 0) {
        const errorMessage =
          "Duplicate files found. These files will not be uploaded: " +
          duplicateFiles.join(", ");
        this.openErrorDialog("Duplicate Files", errorMessage);
        return false;
      }
    }

    if (
      this.fileUploadLimit &&
      get(this.files, "length", 0) + get(files, "length", 0) >
        this.fileUploadLimit
    ) {
      this.openErrorDialog(
        "Error",
        getFileUploadLimitMessage(this.fileUploadLimit)
      );
      return false;
    }
    validFiles = Array.from(files).filter((file: File) =>
      validateFileTypes(file, this.acceptedFileTypes)
    );
    if (files.length !== validFiles.length) {
      const errorMessage = `${
        this.fileTypeErrorMessage
      } (${this.acceptedFileTypes.join(",")})`;
      this.openErrorDialog("Unsupported File format!", errorMessage);
      return false;
    }
    validFiles = Array.from(files).filter(
      (file) => get(file, "size", 0) <= FILE_UPLOAD_MAX_SIZE
    );
    if (validFiles.length === 0) {
      const errorMessage = this.fileSizeErrorMessage;
      this.openErrorDialog("File size is too big!", errorMessage);
      return false;
    }
    for (const item of validFiles) {
      item.progress = 0;
      item["fileUrl"] = "";
      this.getFileIcon(item);
      this.files.push(item);
    }
    this.passFileSelected.emit(this.files);
    return true;
  }

  getFileIcon(file) {
    this.fileIconPath = "";
    if (!file) {
      return;
    }
    let fileExtension = getFileExtension(file.name);
    let fileUrl = getThumbnailUrl(fileExtension);
    if (["jpg", "jpeg", "svg", "png"].includes(fileUrl)) {
      fileUrl = URL.createObjectURL(file);
    }
    if (fileUrl) {
      file["fileUrl"] = this.domSanitizer.bypassSecurityTrustUrl(fileUrl);
    }
  }
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  addAnotherFile() {
    this.fileDropEl.nativeElement.click();
  }

  getAcceptedFileTypes() {
    return this.acceptedFileTypes.map((type) => `.${type}`).join(",");
  }
  findDuplicateElements(files, currentFiles) {
    const setA = new Set(files);
    const duplicates = [];

    for (const item of currentFiles) {
      if (setA.has(item)) {
        duplicates.push(item);
      }
    }

    if (duplicates.length > 0) {
      return { hasDuplicates: true, duplicateElements: duplicates };
    } else {
      return { hasDuplicates: false, duplicateElements: [] };
    }
  }
}
