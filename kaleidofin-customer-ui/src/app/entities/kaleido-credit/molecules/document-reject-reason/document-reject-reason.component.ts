import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DialogData } from "src/app/entities/demand/demand-upload/demand-upload.component";
import { get, isEmpty } from "lodash";
import { getProperty } from "src/app/utils/app.utils";
@Component({
  selector: "app-document-reject-reason",
  templateUrl: "./document-reject-reason.component.html",
  styleUrls: [
    "./document-reject-reason.component.scss",
    "../../report/kcredit-confirmation-reject-dialog.css",
  ],
})
export class DocumentRejectReasonComponent implements OnInit {
  selectedRejectReasons: string[] = [];
  remarks: string = "";
  rejectReasons: any = [];
  documentCategory: string = "";
  hideReasonRejection: boolean = false;

  constructor(
    public readonly dialogRef: MatDialogRef<DocumentRejectReasonComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: DialogData
  ) {}

  ngOnInit() {
    this.rejectReasons = getProperty(this.data, "rejectionReasons", []);
    this.documentCategory = get(this.data, "documentCategory", "");
    this.hideReasonRejection =
      this.rejectReasons?.length === 0 || this.rejectReasons?.length === 1;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  checkForReasonOthers() {
    return this.selectedRejectReasons.includes("Others");
  }
  onReject(): void {
    let reasons = this.selectedRejectReasons;
    if (this.checkForReasonOthers() || this.hideReasonRejection) {
      reasons = reasons.filter((reason) => reason !== "Others");
      reasons.push(this.remarks);
    }
    this.dialogRef.close({
      rejected: true,
      reason: reasons,
    });
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.cancel();
    }
  }

  selectedRejectReasonChange(reasons: Array<any>): void {
    this.selectedRejectReasons = reasons.map((reason) => reason?.value);
  }

  disableReject() {
    if(this.hideReasonRejection) {
      return isEmpty(this.remarks);
    }
    if (this.checkForReasonOthers()) {
      return isEmpty(this.selectedRejectReasons) || isEmpty(this.remarks);
    }
    return isEmpty(this.selectedRejectReasons);
  }
}
