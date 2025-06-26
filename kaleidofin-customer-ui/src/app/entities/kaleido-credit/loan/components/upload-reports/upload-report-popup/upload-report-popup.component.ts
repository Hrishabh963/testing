import {EventEmitter,Output, Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { get } from "lodash";
import { DownloadSampleFile } from "src/app/entities/kaleido-credit/molecules/uploads/upload-filter/upload-filter.component";
import { UploadService } from "src/app/entities/kaleido-credit/services/upload.service";
import { CustomDisplayPopupComponent } from "src/app/entities/kaleido-credit/shared/custom-display-popup/custom-display-popup.component";
import { CustomErrorPopupComponent } from "src/app/entities/kaleido-credit/shared/custom-error-popup/custom-error-popup.component";
import {
  ACCEPTED_FILE_TYPES_FOR_UPLOAD,
  DocumentDTO,
  FILE_UPLOAD_REPORT_INFO_TEXT,
} from "src/app/entities/kaleido-credit/shared/file-upload/file.constants";
import { getUploadStatusEnum } from "src/app/shared";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-upload-report-popup",
  templateUrl: "./upload-report-popup.component.html",
  styleUrls: ["./upload-report-popup.component.scss"],
})
export class UploadReportPopupComponent implements OnInit {
  dialogTitle = "";
  isFilesSelected: boolean = false;
  acceptedFileTypes: string[] = [];
  uploadInfoText: string = "";
  selectedFiles: File[] = [];
  uploadLoanStatus: string = "";
  reload: Function = () => {};
  canAllowMultiple:boolean = true;
  openByDefault:boolean = false;
  selectedDocuments: Array<File> = [];
  uploadedDocuments: Array<DocumentDTO> = [];
  uploadDocumentType: string = null;
  downloadSampleFile: DownloadSampleFile = null;

  @Output() getSelectedFiles= new EventEmitter();
  constructor(
    public readonly dialogRef: MatDialogRef<UploadReportPopupComponent>,
    public readonly dialog: MatDialog,
    private readonly fileUploadService: UploadService,
    @Inject(MAT_DIALOG_DATA) public readonly data: any
  ) {}

  receiveFileSelected(files: File[]) {
    this.isFilesSelected = getProperty(files, "length", 0) > 0;
    this.selectedFiles = files;
    this.selectedDocuments = files;
  }
  ngOnInit(): void {
    this.dialogTitle = getProperty(this.data, "dialogTitle", "");
    this.uploadLoanStatus = getProperty(this.data, "uploadLoanStatus", "");
    this.acceptedFileTypes = getProperty(
      this.data,
      "acceptedFileTypes",
      ACCEPTED_FILE_TYPES_FOR_UPLOAD
    );
    this.uploadInfoText = getProperty(
      this.data,
      "uploadInfoText",
      FILE_UPLOAD_REPORT_INFO_TEXT
    );
    this.reload = getProperty(this.data, "reload", () => {});
    this.canAllowMultiple = get(this.data, "canAllowMultiple", true);
    this.openByDefault = get(this.data, "openByDefault", true);
    this.selectedDocuments = get(this.data, "selectedDocuments", []);
    this.uploadedDocuments = get(this.data, "existingDocuments", []);
    this.uploadDocumentType = get(this.data, "uploadDocumentType", null);
    this.downloadSampleFile = get(this.data, "downloadSampleFile", null);
    
  }

  cancel(): void {
    this.dialogRef.close();
  }

  async uploadCkycReport() {
    const uploadReportType = getProperty(this.data, "selectedReportType", {});
    return await this.fileUploadService.uploadCkycReports(
      this.selectedFiles,
      uploadReportType,
      this.uploadDocumentType
    );
  }
  uploadDecisioningReports() {
    return this.fileUploadService.uploadFiles(
      this.selectedFiles,
      getUploadStatusEnum(this.uploadLoanStatus)
    );
  }
  async proceed() {
    if (this.selectedFiles.length > 0) {
      const uploadType = getProperty(this.data, "uploadType", "");
      if(uploadType === 'RECEIVE_FILES'){
        this.data.receiveFiles(this.selectedFiles);
        this.dialogRef.close()
        return;
      }
      const uploadApi = async () =>
         uploadType === "CKYC"
          ? await this.uploadCkycReport()
          : this.uploadDecisioningReports();
      await uploadApi()
        .then(() => {
          const confirmationDialog = this.dialog.open(
            CustomErrorPopupComponent,
            {
              data: {
                reportsRouteUrl: getProperty(this.data, "reportsRouteUrl", ""),
                dialogRef: this.dialogRef,
              },
            }
          );
          confirmationDialog.afterClosed().subscribe(() => {
            this.reload();
          });
        })
        .catch((error) => {
          console.error(error);
          this.openErrorDialog(
            "Error",
            "Oops, something went wrong. Please try again later. "
          );
          this.dialogRef.close();
        });
    }
  }

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
}
