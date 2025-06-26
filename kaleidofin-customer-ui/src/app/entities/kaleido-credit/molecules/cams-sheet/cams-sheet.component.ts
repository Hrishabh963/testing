import { Component, Input } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CamsService } from "../../services/cams.service";

@Component({
  selector: "app-cams-sheet",
  templateUrl: "./cams-sheet.component.html"
})
export class CamsSheetComponent {
  @Input() loanId: number = null;

  constructor(
    private readonly service: CamsService, 
    private readonly snackbar: MatSnackBar
  ) {}

  openReport(reportData: any = {}) {
    const serializedData = window.btoa(
      encodeURIComponent(JSON.stringify(reportData))
    );
    const queryParams = new URLSearchParams();
    queryParams.set("data", serializedData);
    const camsReportFragment = 'cams-report';
    const url = `#${camsReportFragment}/cams-report?${queryParams.toString()}`;
    window.open(url, "_blank");
  }

  openCamsSheetReport() {
    this.service.getCamsReport(this.loanId).subscribe(
      (reportData) => {
        this.openReport(reportData);
      },
      (error) => {
        console.error(error);
        this.snackbar.open("Error fetching CAM Report", "");
      }
    );
  }
}
