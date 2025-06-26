import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { get } from "lodash";
import { UploadService } from "../../../services/upload.service";
import {
  ACCEPTED_FILE_TYPES,
  FILE_UPLOAD_INFO_TEXT,
  FILE_UPLOAD_SUCCESS_TEXT,
} from "../../../shared/file-upload/file.constants";

@Component({
  selector: "app-loan-approval-confirmation-popup",
  templateUrl: "./loan-approval-confirmation-popup.component.html",
  styleUrls: ["./loan-approval-confirmation-popup.component.scss"],
})
export class LoanApprovalConfirmationPopupComponent {
  remarks: string = "";
  isFilesSelected: boolean = false;
  readonly acceptedFileTypes = ACCEPTED_FILE_TYPES;
  readonly uploadInfoText = FILE_UPLOAD_INFO_TEXT;
  fileUploadLimit:number = 10;
  selectedFiles: File[] = [];
  constructor(
    public readonly dialogRef: MatDialogRef<LoanApprovalConfirmationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: any,
    private readonly fileUploadService: UploadService,
    private readonly snackbar: MatSnackBar
  ) {}


  receiveFileSelected(files: File[]) {
    this.isFilesSelected = get(files, "length", 0) > 0;
    this.selectedFiles = files;
  }
  cancel(): void {
    this.dialogRef.close("cancel");
  }

  approve() {
    const loanId = get(this.data, "loanId", null);
    this.fileUploadService
      .uploadLoanDocuments(this.selectedFiles, loanId, this.remarks)
      .then(() => {
        this.snackbar.open(FILE_UPLOAD_SUCCESS_TEXT, "", {
          duration: 4000,
        });
        this.dialogRef.close("confirm");
      })
      .catch((error) => {
        console.error(error);
        this.snackbar.open("Error Uploading Loan Documents", "", {
          duration: 3000,
        });
        return null;
      });
  }
}
