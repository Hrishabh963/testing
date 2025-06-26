import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AdditionalTractorDetailsService } from "./additional-tractor-details.service";
import { CamsService } from "./cams.service";
import { LoanReviewService } from "../report/loan-review.service";

@Injectable({
  providedIn: "root",
})
export class CommonReportsDownloadService {
  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly camsService: CamsService,
    private readonly atdService: AdditionalTractorDetailsService,
    private readonly loanAppService: LoanReviewService
  ) {}

  openReport(reportData: any = {}, routerLink: string = "") {
    const serializedData = window.btoa(
      encodeURIComponent(JSON.stringify(reportData))
    );
    let currentLocation = window.location.href;
    const currentFragment = currentLocation.split("#")[1];
    const queryParams = new URLSearchParams();
    queryParams.set("data", serializedData);
    const url = `#${currentFragment}/${routerLink}?${queryParams.toString()}`;
    window.open(url, "_blank");
  }

  openATDReport(loanId: number = null, routerLink: string = "") {
    this.atdService.getAdditionalTractorDetailsReport(loanId).subscribe(
      (reportData) => {
        reportData = {
          ...reportData,
          applicantName: this.loanAppService.getApplicantName(),
        };
        this.openReport(reportData, routerLink);
      },
      (error) => {
        console.error(error);
        this.snackbar.open("Error fetching Report", "", { duration: 4000 });
      }
    );
  }

  openCamsSheetReport(loanId: number = null, routerLink: string = "") {
    this.camsService.getCamsReport(loanId).subscribe(
      (reportData) => {
        reportData = {
          ...reportData,
          applicantName: this.loanAppService.getApplicantName(),
        };
        this.openReport(reportData, routerLink);
      },
      (error) => {
        console.error(error);
        this.snackbar.open(
          error?.error?.message || "Error fetching Report",
          "",
          { duration: 4000 }
        );
      }
    );
  }

  openFiReport(routerLink: string = "", reportData: any = {}) {
    reportData = {
      ...reportData,
      applicantName: this.loanAppService.getApplicantName(),
    };
    this.openReport(reportData, routerLink);
  }
}
