import { Component, Inject, LOCALE_ID, OnInit } from "@angular/core";
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
} from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { UI_COMPONENTS } from "src/app/constants/ui-config";
import { DeviationTypeAndValue } from "src/app/entities/kaleido-credit/molecules/deviations-table/deviations.constants";
import { AssociateLenderService } from "src/app/entities/kaleido-credit/services/associate-lender/associate-lender.service";
import { FileService } from "src/app/entities/kaleido-credit/services/files/file.service";
import { PdfExportService } from "src/app/entities/kaleido-credit/services/pdfexport.service";
import { UiConfigService } from "src/app/entities/kaleido-credit/services/ui-config.service";
import { getProperty } from "src/app/utils/app.utils";

const acceptIcon = "assets/images/common/success-check-circle-outlined.svg";
const rejectIcon = "assets/images/common/mdi_close-circle.svg";
const deviationIcon = "assets/images/common/deviation.svg";

@Component({
  selector: "app-bre-report",
  templateUrl: "./bre-report.component.html",
  styleUrls: ["./bre-report.component.scss"],
})
export class BreReportComponent implements OnInit {
  toggleReport: boolean = false;
  tableData: Array<any> = [];
  featureMap: any = {};
  actionIcon: SafeResourceUrl = undefined;
  breData: any = {};
  breDecisionIcon = "";
  passiveRuleDescription: string =
    "These rules are only for monitoring purpose, and will not effect the BRE Decision";
  uiFieldsMap: Array<any> = new Array();

  loanApplicationId: string = "";
  partnerLoanId: string = "";
  partnerCustomerId: string = "";
  applicantName: string = null;

  logo: string = "assets/images/kaleidofin-new-logo.svg";
  nullValueError: string = "System is unable to calculate due to missing data";

  constructor(
    private readonly sanitizer: DomSanitizer,
    @Inject(LOCALE_ID) private readonly locale: string,
    private readonly route: ActivatedRoute,
    private readonly fileService: FileService,
    private readonly uiConfigService: UiConfigService,
    private readonly pdfExportService: PdfExportService,
    private readonly lenderService: AssociateLenderService
  ) {
    // Set the path of the SVG image file
    // Generate a safe URL for the SVG image file
  }
  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      // Check if the 'data' query parameter exists
      this.getBreUiFields();
      this.getBreUiFields();
      if (params.hasOwnProperty("data")) {
        // Get the serialized data from the query parameter
        const serializedData = params["data"];
        this.partnerCustomerId = params["partnerCustomerId"];
        this.partnerLoanId = params["partnerLoanId"];
        this.loanApplicationId = params["loanId"];
        let data = JSON.parse(decodeURIComponent(window.atob(serializedData)));
        this.applicantName = getProperty(data, "applicantName", null);
        const breReportFileId = getProperty(data, "breReportFileId", null);

        let lenderCode = this.lenderService.getLenderCode();
        if (["DCB", "DCBMFI"].includes(lenderCode)) {
          this.logo = "assets/images/lender/dcb-logo.svg";
        }

        if (breReportFileId === null) {
          this.setBreReport(data);
        } else {
          this.fileService.getFileURL(breReportFileId).subscribe((s3Url) => {
            data = this.fileService
              .fetchS3Json(s3Url)
              .subscribe((data) => this.setBreReport(data));
          });
        }
      }
    });
  }

  setBreReport(data): void {
    const breReportData: any = getProperty(data, "breReportData", {});
    const overallDecision = getProperty(data, "overallDecision", null);
    this.breData = {
      ...breReportData,
      partnerCustomerId: this.partnerCustomerId,
      partnerLoanId: this.partnerLoanId,
      loanApplicationId: this.loanApplicationId,
      overallDecision,
    };
    this.tableData = getProperty(data, "breResults", []);
    this.featureMap = this.tableData.map(
      (featureData, index) => (this.featureMap[index] = featureData.featureNameAndValues)
    );
  }

  fetchDecisionIcon(decision = "") {
    let icon = rejectIcon;
    if (decision) {
      switch (decision.toLowerCase()) {
        case "pass":
          icon = acceptIcon;
          break;
        case "fail":
          icon = rejectIcon;
          break;
        default:
          icon = deviationIcon;
      }
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(icon);
  }

  checkCurrency(feature: any = {}): boolean {
    const featureName = (feature?.name || "").toLowerCase();
    const value = feature?.value || "";
    return (
      ["amount", "value", "price", "valuation"].some((term) =>
        featureName.includes(term)
      ) && value != 0
    );
  }

  formatCodeSnippet(code: string): SafeHtml {
    if (code) {
      const formattedCode = code
        .replace(/ /g, "&nbsp;")
        .replace(/\t/g, "&nbsp;")
        .replace(/\n/g, "<br>");
      return formattedCode;
    }
    return "";
  }

  getBreUiFields(): void {
    this.uiConfigService.getUiConfig(UI_COMPONENTS.LOAN_REVIEW).subscribe(
      (response) => {
        const sectionConfig = this.uiConfigService.getUiConfigurationsBySection(
          response,
          "BRE_REPORT",
          true
        );
        this.uiFieldsMap = getProperty(sectionConfig, "uiFieldsMap", []);
      },
      (error) => console.error(error)
    );
  }

  downloadPdf(): void {
    const fileName: string = this.applicantName
      ? `${this.applicantName}_BRE_Report`
      : null;
    this.pdfExportService.downloadCurrentPageAsPdf(fileName);
  }

  getCalculatedNameList(calculatedList: Array<DeviationTypeAndValue> = []) {
    return calculatedList.map((desc)=> {
      return desc?.name; 
    })
  }

  
  getCalculatedValueList(calculatedList: Array<DeviationTypeAndValue> = []) {
    return calculatedList.map((desc)=> {
      return desc?.value; 
    })
  }

}
