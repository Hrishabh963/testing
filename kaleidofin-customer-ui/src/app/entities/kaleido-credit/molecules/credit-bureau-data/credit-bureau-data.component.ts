import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { getProperty } from "src/app/utils/app.utils";
import { CreditBureauService } from "../../loan/components/credit-bureau-info/credit-bureau.service";
import { FileService } from "../../services/files/file.service";

@Component({
  selector: "app-credit-bureau-data",
  templateUrl: "./credit-bureau-data.component.html",
  styleUrls: ["./credit-bureau-data.component.scss"],
})
export class CreditBureauDataComponent implements OnInit {
  cbResponse: Array<any> = [];
  cbReportStatusMapper = {
    SUCCESS: "Successfully fetched KPL Integrated CB Report",
    FAILED: "Error in fetching KPL Integrated CB Report ",
    null: "Error in fetching KPL Integrated CB Report ",
  };
  constructor(
    private readonly cbReportService: CreditBureauService,
    private readonly route: ActivatedRoute,
    private readonly fileService: FileService
  ) {}

  ngOnInit(): void {
    const segments = this.route.snapshot.url;
    let loanId: string = segments[segments.length - 1].path;
    this.fetchCbReport(loanId);
  }

  fetchCbReport(loanId: string) {
    this.cbReportService.getExternalCbReport(loanId).subscribe(
      (reportResponse) => {
        if (Array.isArray(reportResponse)) {
          this.cbResponse = reportResponse;
        } else {
          this.cbResponse = [reportResponse];
        }
        this.cbResponse.forEach((report, index) => {
          this.updateReportStatus(report);
          this.updateProviderInformation(report);
          this.updateCustomerType(report, index);
        });
      },
      (err) => {
        console.error(err);
        this.cbResponse = [{ reportStatus: this.cbReportStatusMapper.FAILED }];
      }
    );
  }

  updateCustomerType(reportData: any = {}, index: number = 0) {
    let customerType = getProperty(reportData, "customerType", "");
    switch (customerType) {
      case "APPLICANT":
        reportData["sectionTitle"] = "Applicant";
        break;
      case "CO_APPLICANT":
        reportData["sectionTitle"] = `Co-Applicant - ${index}`;
        break;
      case "GUARANTOR":
        reportData["sectionTitle"] = `Guarantor - ${index}`;
        break;
      default:
        reportData["sectionTitle"] = "";
        break;
    }
  }

  updateReportStatus(reportData: any = {}) {
    let ersScore: number = getProperty(reportData, "cbScoreErs", null);
    let reportStatus: string = getProperty(reportData, "reportStatus", null);
    if (ersScore === -1) {
      reportData["reportStatus"] = "Customer is New to Credit";
    } else {
      reportData["reportStatus"] = this.cbReportStatusMapper[reportStatus];
    }
  }

  updateProviderInformation(reportData: any = {}) {
    let provider: string = getProperty(reportData, "cbProvider", "");

    switch (provider) {
      case "crif":
        reportData["ersScoreText"] = "(Consumer)";
        reportData["mrsScoreText"] = "(Commercial)";
        reportData["bureauName"] = "CRIF";
        break;
      case "equifax":
        reportData["ersScoreText"] = "(ERS)";
        reportData["mrsScoreText"] = "(MRS)";
        reportData["bureauName"] = "Equifax";
        break;
      case "partner":
        reportData["ersScoreText"] = "";
        reportData["mrsScoreText"] = "";
        reportData["bureauName"] = "Partner";
        reportData["reportStatus"] = "CB Report from BC Partner";
        break;
      default:
        reportData["ersScoreText"] = "";
        reportData["mrsScoreText"] = "(MRS)";
        break;
    }
  }

  openReport(reportData: any = {}) {
    let reportFileId = getProperty(reportData, "cbHtmlFileId", null);
    if (reportFileId) {
      this.fileService
        .getFileURL(reportFileId)
        .subscribe((url) => window.open(url, "_blank"));
    }
  }
}
