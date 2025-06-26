import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { get } from "lodash";
import { CustomDisplayActionButton } from "./custom-display.model";
@Component({
  selector: "app-custom-display-popup",
  templateUrl: "./custom-display-popup.component.html",
  styleUrls: ["../custom-confirmation-modal/custom-confirmation-modal.component.scss","./custom-display-popup.component.scss"],
})
export class CustomDisplayPopupComponent implements OnInit {
  dialogTitle: string = "";
  title: string = "";
  titleClass: string = "";
  description: string = "";
  dialogClass : string = "";
  actionButtons: CustomDisplayActionButton[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly dialogData,
    private readonly dialogRef: MatDialogRef<CustomDisplayPopupComponent>
  ) {}

  ngOnInit(): void {
    this.dialogTitle = get(this.dialogData, "dialogTitle", "");
    this.title = get(this.dialogData, "title", "");
    this.description = get(this.dialogData, "description", "");
    this.actionButtons = get(this.dialogData, "actionButtons", []);
    this.titleClass = get(this.dialogData, "isErrorDisplay", false)
      ? "error"
      : "success";
    this.dialogClass = get(this.dialogData, "dialogClass", undefined);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  approve(btn : any = {}) {
    this.dialogRef.close();
    btn.onClickHandler();
  }
}
