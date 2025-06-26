import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-confirmation-popup",
  templateUrl: "./confirmation-popup.component.html",
  styleUrls: ["./confirmation-popup.component.scss"],
})
export class ConfirmationPopupComponent implements OnInit {
  comment: string = null;

  popupStyle: string = "approve";
  title: string = "Confirm";
  popupText: string = null;
  confirmButtonText: string = "Yes, Confirm"
  enableTextField: boolean = false;
  textFieldLabel: string = "Please enter your remarks"

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data,
    private readonly dialogRef: MatDialogRef<ConfirmationPopupComponent>
  ) {}

  ngOnInit(): void {
    this.enableTextField = getProperty(this.data, "enableTextField", false);
    this.popupStyle = getProperty(this.data, "popupStyle", false);
    this.title = getProperty(this.data, "title", false);
    this.popupText = getProperty(this.data, "popupText", false);
    this.confirmButtonText = getProperty(this.data, "confirmButtonText", false);
  }

  approveDialog(): void {
    this.dialogRef.close({
      approverComment: this.comment,
    });
  }

  closeDialog(): void {
    this.dialogRef.close({
      forceClosed: true,
    });
  }
}
