import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { LOAN_REPORTS_DOWNLOAD_TYPES } from "../../loan/constant";
import { getProperty } from "src/app/utils/app.utils";
@Component({
  selector: "app-download-loan-report-popup",
  templateUrl: "./download-loan-report-popup.component.html",
  styleUrls: ["./download-loan-report-popup.component.scss"],
})
export class DownloadLoanReportPopupComponent implements OnInit {
  selectedOption: string;
  reportTypes = LOAN_REPORTS_DOWNLOAD_TYPES;

  constructor(
    public dialogRef: MatDialogRef<DownloadLoanReportPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    const reports = getProperty(this.data, "reports","");
    if (reports !== "") {
      this.reportTypes = reports;
    }
    
  }

  download(): void {
    this.dialogRef.close(this.selectedOption);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
