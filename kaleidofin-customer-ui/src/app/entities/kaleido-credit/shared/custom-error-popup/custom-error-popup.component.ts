import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { getProperty } from "src/app/utils/app.utils";

const DEFAULT_DESCRIPTION ="File upload is successful. Check status in the reports section"

@Component({
  selector: "app-custom-error-popup",
  templateUrl: "./custom-error-popup.component.html",
  styleUrls: ["./custom-error-popup.component.scss"],
})
export class CustomErrorPopupComponent implements OnInit {
  closeDialog: boolean = false;
  enableReports: boolean = false;
  errors: boolean = false;
  description:string = "";
  constructor(
    public readonly dialogRef: MatDialogRef<CustomErrorPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: any,
    private readonly router: Router
  ) {}

  ngOnInit() {
    let dialogRef = getProperty(this.data, "dialogRef", null);
    this.description = getProperty(this.data, "description", DEFAULT_DESCRIPTION);
    this.errors = getProperty(this.data, "isError", false);
    
    if (dialogRef) {
      dialogRef.close(true);
    }
  }

  proceed(): void {
    let routeUrl = getProperty(this.data, "reportsRouteUrl", "");
    if (routeUrl) {
      this.router.navigate([routeUrl]);
    }
    this.dialogRef.close('reload');
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
