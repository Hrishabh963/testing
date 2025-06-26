import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-close-mandate-status",
  templateUrl: "./close-mandate-status.component.html",
  styleUrls: [
    "../close-mandate.component.scss",
    "./close-mandate-status.component.scss",
  ],
})
export class CloseMandateStatusComponent implements OnInit {
  closeDialog: boolean = false;
  enableReports: boolean = false;
  failedSvg: string = "assets/images/common/failed.svg";
  successSvg = "assets/images/common/upload-success.svg";
  statusIcon: string = "";
  constructor(
    public readonly dialogRef: MatDialogRef<CloseMandateStatusComponent>,
    private readonly router:Router,
    @Inject(MAT_DIALOG_DATA) public readonly data: any
  ) {}

  ngOnInit(): void {
    this.statusIcon = getProperty(this.data, "success", false)
      ? this.successSvg
      : this.failedSvg;
  }
  proceed(): void {
    if(getProperty(this.data,'success',false)){
      const route = getProperty(this.data,'route','');
      this.router.navigate([route]);
    }
    this.enableReports = true;
    this.cancel();
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
