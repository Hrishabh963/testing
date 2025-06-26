import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { get } from "lodash";
import { JhiAlertService, JhiParseLinks } from "ng-jhipster";
import { PrincipalService } from "src/app/core";
import { DashboardService } from "../../dashboard/dashboard.service";
import { AssociateLenderService } from "../services/associate-lender/associate-lender.service";
import { FileService } from "../services/files/file.service";
import { ImportDataService } from "../services/import-data/import-data.service";
import { PartnersService } from "../services/partner/partners.service";
import { ReportGenerationService } from "./kcredit-reportgen.service";
import { LOAN_APPLICATION_DETAILS } from "./kicredit-report.constants";
import { GenerateReportPopupComponent } from "../molecules/generate-reports/generate-report-popup/generate-report-popup.component";
import { GenerateReportsService } from "../services/generate-reports.service";
import { ReviewStateManagementService } from "../services/review-state-management.service";

@Component({
  selector: "jhi-kcredit-reportgen",
  templateUrl: "./kcredit-reportgen.component.html",
  styleUrls: [
    "./loan-status-menu/loan-status-menu.component.scss",
    "./kcredit-reportgeneration.scss",
  ],
  standalone: false,

})
export class KCreditReportGenerationComponent implements OnInit, OnDestroy {
  form: FormGroup;
  routeData: any;
  customerType = new FormControl();
  selectedCustomerType: string[] = [];
  customerTypeList: string[] = [];
  page: any = 1;
  previousPage: any;
  itemsPerPage: number = 8;
  predicate: string = "id";

  jobDetailsList: Array<any>;
  totalItems: any;

  queryCount: any;
  links: any;
  reverse: any;
  isDCBMFI: boolean = false;

  constructor(
    private readonly parseLinks: JhiParseLinks,
    private readonly alertService: JhiAlertService,
    private readonly principal: PrincipalService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    public readonly fb: FormBuilder,
    public readonly dialog: MatDialog,
    private readonly partnerService: PartnersService,
    private readonly importDataService: ImportDataService,
    private readonly reportGenerationService: ReportGenerationService,
    private readonly reportService: GenerateReportsService,
    private readonly fileService: FileService,
    private readonly dashboardService: DashboardService,
    private readonly associateLenderService: AssociateLenderService,
    private readonly reviewStateService: ReviewStateManagementService
  ) {
    this.itemsPerPage = 8;
  }

  ngOnInit() {
    this.principal.identity().then(() => {
      this.dashboardService.sendMessage("shownav");
      this.loadAll();
    });

    this.isDCBMFI =
      this.associateLenderService.getLenderCode().toUpperCase() === "DCBMFI";
    this.reviewStateService.resetToBase();
  }

  loadAll() {
    let additionalParams = this.reportService.getSearchParams();
    this.reportService
      .getKCreditReports(additionalParams, {
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (response: any) => this.onSuccessJob(response.body, response.headers),
        (error: any) => {
          console.error(error);
        }
      );
  }

  sort() {
    const result = [this.reverse ? "asc" : "desc"];
    if (this.predicate !== "id") {
      result.push("id");
    }
    return result;
  }

  private onSuccessJob(data, headers) {
    this.links = this.parseLinks.parse(headers.get("link"));
    this.totalItems = headers.get("X-Total-Count");
    this.links = headers.get("Link");
    this.queryCount = this.totalItems;
    this.jobDetailsList = data;
  }
  private onError(error) {
    this.alertService.error(error.error, null, null);
  }
  private onErrorGen(error) {
    setTimeout(() => {
      this.alertService.error("kCredit.report.failure", null, null);
    }, 200);
  }

  ngOnDestroy() {
    this.routeData?.unsubscribe();
  }

  getReportType(jobName: string): string {
    if (jobName === "GenerateApprovalReport") {
      return "Approval Report";
    } else if (jobName === "GenerateDisbursementReport") {
      return "Disbursal Report";
    } else if (jobName.includes("CMS")) {
      return "CMS Report";
    } else if (jobName.includes("GenerateGroupDetails")) {
      return `Group Details Report`;
    } else if (jobName.includes("PennyDropReport")) {
      return `Penny Drop MIS Report`;
    } else if (jobName.includes("Loan")) {
      return `${LOAN_APPLICATION_DETAILS} Report`;
    }
    return "Booking Report";
  }
  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }
  transition() {
    this.router.navigate(["/genreport"], {
      queryParams: {
        page: this.page,
        sort: this.reverse ? "asc" : "desc",
      },
    });
    this.loadAll();
  }
  getDateRange(jobConfiguration: string): string {
    const jobConfigurationStr = JSON.parse(jobConfiguration);
    if (!jobConfigurationStr["fromDate"] || !jobConfigurationStr["toDate"]) {
      return "--";
    }
    return `${jobConfigurationStr["fromDate"]} - ${jobConfigurationStr["toDate"]}`;
  }
  getJobStatus(jobStatus: string): string {
    switch (jobStatus) {
      case "Processed":
        return "Ready";
      case "Failed":
        return "Failed";
      default:
        return "Generating";
    }
  }
  getOutputFile(outputFile: string, jobStatus: string): string {
    if (
      (jobStatus === "Processed" || jobStatus === "Failed") &&
      outputFile === null
    ) {
      return "Data not available";
    }
    return outputFile;
  }
  getProductId(jobConfiguration: string): string {
    const jobConfigurationStr = JSON.parse(jobConfiguration);
    let partnerIds = jobConfigurationStr["partnerIds"];
    if (get(partnerIds, "length", 0) > 1) {
      return "All";
    }
    return get(partnerIds, "[0]", "--");
  }
  getProductType(jobConfiguration: string): string {
    const jobConfigurationStr = JSON.parse(jobConfiguration);
    let loanTypes = jobConfigurationStr["loanTypes"];
    if (this.reportService?.getLoanTypes()?.length === loanTypes?.length) {
      return "All";
    }
    return loanTypes;
  }
  downLoadFile(fileId: any, jobReportType: string = "") {
    if (fileId != null) {
      if (["PennyDropReport"].includes(jobReportType)) {
        this.fileService.downloadFileFromS3(fileId, false);
      }
      this.fileService.downloadFile(fileId, false);
    }
  }

  openGenerateReport() {
    const dialogRef = this.dialog.open(GenerateReportPopupComponent, {
      minWidth: "45vw",
      maxHeight: "80vh",
      panelClass: 'generate-report-popup'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("Dialog result:", result);
        this.loadAll();
      }
    });
  }
}
