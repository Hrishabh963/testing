import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { get } from "lodash";
import { getProperty } from "src/app/utils/app.utils";
import { UploadService } from "../../services/upload.service";
import { CustomMessageDisplayComponent } from "../../shared/custom-message-display/custom-message-display.component";
import { ACCEPTED_FILE_TYPES_FOR_KISCORE_UPLOAD } from "../../shared/file-upload/file.constants";

@Component({
  selector: "app-kiscore-data-upload",
  templateUrl: "./kiscore-data-upload.component.html",
  styleUrls: ["./kiscore-data-upload.component.scss"],
})
export class KiscoreDataUploadComponent implements OnInit {
  dialogTitle = "";
  isFilesSelected: boolean = false;
  acceptedFileTypes: string[] = [];
  uploadInfoText: string = "";
  selectedFiles: File[] = [];
  uploadLoanStatus: string = "";
  reload: Function = () => {};
  canAllowMultiple: boolean = true;
  openByDefault: boolean = false;
  selectedDocuments: Array<File> = [];
  fileUploadTitle: string = "Drag & drop Customers data for Scoring";

  @Output() getSelectedFiles = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<KiscoreDataUploadComponent>,
    public dialog: MatDialog,
    private readonly uploadService: UploadService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  receiveFileSelected(files: File[]) {
    this.isFilesSelected = getProperty(files, "length", 0) > 0;
    this.selectedFiles = files;
    this.selectedDocuments = files;
  }
  ngOnInit(): void {
    this.dialogTitle = getProperty(this.data, "dialogTitle", "");
    this.uploadLoanStatus = getProperty(this.data, "uploadLoanStatus", "");
    this.acceptedFileTypes = ACCEPTED_FILE_TYPES_FOR_KISCORE_UPLOAD;
    this.uploadInfoText = "Max file size should be within 100MB";
    this.reload = getProperty(this.data, "reload", () => {});
    this.canAllowMultiple = get(this.data, "canAllowMultiple", true);
    this.openByDefault = get(this.data, "openByDefault", true);
    this.selectedDocuments = get(this.data, "selectedDocuments", []);
  }

  cancel(): void {
    this.dialogRef.close("cancel");
  }

  async proceed() {
    if (this.selectedFiles.length > 0) {
      await this.uploadService
        .uploadKiScoreReport(this.selectedFiles)
        .then(() => {
          this.dialogRef.close();
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
              this.reload();
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
                  onClickHandler: () => this.dialogRef.close(),
                },
              },
            }
          );
          confirmationDialog.afterClosed().subscribe((event) => {
            console.log(event);
            this.reload();
          });
          this.dialogRef.close();
        });
    }
  }
}
