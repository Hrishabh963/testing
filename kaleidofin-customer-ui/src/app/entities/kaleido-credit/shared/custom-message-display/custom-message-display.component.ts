import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { get } from "lodash";
@Component({
  selector: "app-custom-message-display",
  templateUrl: "./custom-message-display.component.html",
  styleUrls: ["./custom-message-display.component.scss"],
})
export class CustomMessageDisplayComponent {
  canReload: boolean = false;
  buttonText: string = "";
  additionalButton: any = null;
  headerText: string = null;
  isSuccessConfirmation: boolean = false;
  successText: string = null;
  constructor(
    public dialogRef: MatDialogRef<CustomMessageDisplayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.canReload = get(this.data, "canReload") || false;
    this.buttonText = get(this.data, "buttonText") || "OK";
    this.additionalButton = get(this.data, "additionalButton") || null;
    this.headerText = get(this.data, "headerText", null);
    this.isSuccessConfirmation = get(this.data, "isSuccessConfirmation", false);
    this.successText = get(this.data, "successText", null);
  }
  proceed(): void {
    this.dialogRef.close(this.canReload);
  }
}
