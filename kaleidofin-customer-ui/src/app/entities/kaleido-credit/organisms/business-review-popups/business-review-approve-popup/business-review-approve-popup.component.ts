import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { isEmpty } from "lodash";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-business-review-approve-popup",
  templateUrl: "./business-review-approve-popup.component.html",
  styleUrls: ["./business-review-approve-popup.component.scss"],
})
export class BusinessReviewApprovePopupComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<BusinessReviewApprovePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  defaultRejectedSections: Array<string> = [];
  title: string = "";
  rejectionType: string = "";
  rejectOptions: Array<any> = [];
  isRemarksMandatory: boolean = false;
  remarks: string = "";
  remarksLabel: string = "Type a reason";
  remarksPlaceholder: string = "Enter a reason";

  rejectReasonPlaceholder: string = "Choose sections to be resubmitted";
  rejectReasons: Array<any> = [];
  selectedRejectReasons: string[] = [];

  ngOnInit(): void {
    this.isRemarksMandatory = getProperty(
      this.data,
      "isRemarksMandatory",
      false
    );

    this.defaultRejectedSections = getProperty(
      this.data,
      "defaultRejectedSections",
      []
    );
    this.selectedRejectReasons = this.defaultRejectedSections;

    this.rejectionType = getProperty(this.data, "rejectionType", "");
    this.rejectOptions = getProperty(this.data, "rejectOptions", false);
    this.rejectReasons = getProperty(this.data, "rejectReasons", []);
    this.title = getProperty(this.data, "title", false);
  }

  cancel(): void {
    this.dialogRef.close({ type: "cancel" });
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.cancel();
    }
  }

  onClickHandler() {
    this.dialogRef.close({
      type: "confirm",
      rejectionType: this.rejectionType,
      remarks: this.remarks,
      discrepencies: this.selectedRejectReasons.filter(
        (section) => !this.defaultRejectedSections.includes(section)
      ),
    });
  }

  selectedRejectReasonChange(reasons: Array<any>): void {
    if (reasons && reasons?.length > 0) {
      this.selectedRejectReasons = reasons.map((reason) => reason?.value);
    }
  }
  isDisabled() {
    if (isEmpty(this.rejectionType)) {
      return true;
    }
    if (!isEmpty(this.rejectReasons)) {
      return isEmpty(this.selectedRejectReasons) || isEmpty(this.remarks);
    }
    return isEmpty(this.remarks);
  }
}
