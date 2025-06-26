import { Inject, Component } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { get } from "lodash";
import { ReportGenerationService } from "../../genreport/kcredit-reportgen.service";

@Component({
  selector: "app-custom-confirmation-modal",
  templateUrl: "./custom-confirmation-modal.component.html",
  styleUrls: ["./custom-confirmation-modal.component.scss"],
})
export class CustomConfirmationModalComponent {
  closeDialog: boolean = false;
  enableReports: boolean = false;
  errors: boolean = false;
  constructor(
    public readonly dialogRef: MatDialogRef<CustomConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: any,
    private readonly router: Router,
    private readonly reportService: ReportGenerationService
  ) {}
  proceed(): void {
    let loanIds: any = get(this.data, "loanIds", "") || "";
    let downloadReportType = get(this.data, "value", "") || "";
    this.reportService
      .downloadLoanReports(
        typeof loanIds === "string" ? loanIds : loanIds + "",
        downloadReportType
      )
      .subscribe(
        (res) => {
          console.log(res);
          this.enableReports = true;
        },
        (err) => {
          console.log(err);
          this.errors = true;
        }
      );
  }

  cancel(): void {
    this.dialogRef.close();
  }

  goToReports(): void {
    let routeUrl = get(this.data, "reportsRouteUrl", null);
    if (routeUrl) {
      this.router.navigate([routeUrl]);
    }
    this.dialogRef.close();
  }
}
