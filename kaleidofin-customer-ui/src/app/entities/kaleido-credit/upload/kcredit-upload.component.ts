import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PrincipalService } from "src/app/core";
import { DashboardService } from "../../dashboard/dashboard.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FileService } from "../services/files/file.service";
import { UploadService } from "../services/upload.service";
import { get } from "lodash";
import { UploadReportPopupComponent } from "../loan/components/upload-reports/upload-report-popup/upload-report-popup.component";
import {
  DEFAULT_UPLOAD_REPORT_TITLE,
  LOAN_REPORTS_UPLOAD_TYPES,
  REPAYMENT_DUE_SCHEDULE,
  REPAYMENT_SCHEDULE,
  UPLOAD_LOAN_STAGE,
  UPLOAD_REPORTS_STATUS_MAP,
} from "./kcredit-upload.constants";
import { AssociateLenderService } from "../services/associate-lender/associate-lender.service";
import { ACCEPTED_FILE_TYPES_FOR_UPLOAD } from "../shared/file-upload/file.constants";
import { ReviewStateManagementService } from "../services/review-state-management.service";
import { UiConfigService } from "../services/ui-config.service";
import { UI_COMPONENTS } from "src/app/constants/ui-config";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "jhi-kcredit-upload",
  templateUrl: "./kcredit-upload.component.html",
  styleUrls: ["../kaleido-credit.css", "./kcredit-upload.component.css"],
})
export class KcreditUploadComponent implements OnInit {
  selectedReportType: string = "";
  reportTypes: any[] = [];
  lenderCode: string = "";
  page: number = 1;
  previousPage: number = 0;
  itemsPerPage: number = 0;
  totalItems: number = 0;
  routeData: any;
  sortColumn: string = "";

  uploadReports: Array<any> = [];

  constructor(
    private readonly fileService: FileService,
    private readonly router: Router,
    private readonly principal: PrincipalService,
    private readonly dashboardService: DashboardService,
    private readonly uploadService: UploadService,
    private readonly activatedRoute: ActivatedRoute,
    public readonly dialog: MatDialog,
    private readonly lenderService: AssociateLenderService,
    private readonly reviewStateService: ReviewStateManagementService,
    private readonly uiConfigService: UiConfigService
  ) {}

  ngOnInit() {
    this.reportTypes = [...LOAN_REPORTS_UPLOAD_TYPES];
    this.itemsPerPage = 10;
    this.sortColumn = "createdDate,desc";

    this.routeData = this.activatedRoute.data.subscribe((data) => {
      if (data?.["pagingParams"]) {
        this.page = data["pagingParams"].page;
        this.previousPage = data["pagingParams"].page;
      }
    });

    this.principal.identity().then(() => {
      this.dashboardService.sendMessage("shownav");
      this.loadAll(
        this.selectedReportType,
        this.page,
        this.itemsPerPage,
        this.sortColumn
      );
    });

    this.lenderCode = this.lenderService.getLenderCode();
    if (this.checkCustomLenders()) {
      this.reportTypes.push(...[REPAYMENT_SCHEDULE, REPAYMENT_DUE_SCHEDULE]);
    }
    this.reviewStateService.resetToBase();
    this.uiConfigService
      .getUiConfigBySection(
        UI_COMPONENTS.UPLOAD_REPORTS,
        UI_COMPONENTS.UPLOAD_REPORTS
      )
      .subscribe({
        next: (response: any) => {
          const config = this.uiConfigService.getUiConfigurationsBySection(
            response,
            UI_COMPONENTS.UPLOAD_REPORTS,
            true
          );
          const uploadReportTypes = getProperty(config, "uploadReportTypes", []);
          this.reportTypes.push(...uploadReportTypes);
        },
      });
  }

  checkCustomLenders(lenders = ["DMI", "KCPL"]) {
    return lenders.includes(this.lenderCode);
  }
  loadAll(
    loanStage: string = "LOAN_REVIEW",
    page = 0,
    size = 0,
    sortColumn = "createdDate,desc"
  ) {
    this.uploadService
      .fetchUploadReports(loanStage, page - 1, size, sortColumn)
      .subscribe((response) => {
        console.log(response);
        this.uploadReports = get(response, "content", []);
        this.totalItems = get(response, "totalElements", 0);
      });
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }
  transition() {
    this.router.navigate(["/kcredit/upload"], {
      queryParams: {
        page: this.page,
      },
    });
    this.loadAll(
      this.selectedReportType["value"],
      this.page,
      this.itemsPerPage,
      this.sortColumn
    );
  }
  downLoadFile(fileId: any) {
    console.log("File to download " + fileId);
    if (fileId != null) {
      this.fileService.getFileURL(fileId).subscribe(
        (url) => window.open(url, "_blank"),
        (err) => console.error(err)
      );
    }
  }

  getReportType(reportType: string = "") {
    switch (reportType) {
      case UPLOAD_LOAN_STAGE.LOAN_AGREEMENT:
        return "Loan Agreement Decisioning Report";
      case UPLOAD_LOAN_STAGE.LOAN_REVIEW:
        return "Loan Review Decisioning Report";
      case UPLOAD_LOAN_STAGE.LOAN_DISBURSEMENT:
        return "Disbursement Report";
      case UPLOAD_LOAN_STAGE.LOAN_BOOKING:
        return "Loan Booking decisioning report";
      default:
        return this.reportTypes.find((type)=> {
          return type?.value === reportType;
        })?.reportType ?? reportType;
    }
  }
  getStatus(status: string = "") {
    return get(UPLOAD_REPORTS_STATUS_MAP[status], "value", "") || status;
  }
  getClass(status: string = "") {
    return get(UPLOAD_REPORTS_STATUS_MAP[status], "class", "") || status;
  }
  getFileStatusMessage(reportData: any = {}) {
    let errorRowCount = get(reportData, "errorRowCount", null);
    let status = get(reportData, "status", null);
    switch (status) {
      case "READY":
        if (errorRowCount) {
          return `Unable to process “${errorRowCount}” rows. Download the response file for more details`;
        }
        return UPLOAD_REPORTS_STATUS_MAP.READY.statusMessage;
      case "IN_PROGRESS":
        return UPLOAD_REPORTS_STATUS_MAP.IN_PROGRESS.statusMessage;
      case "FAILED":
        return UPLOAD_REPORTS_STATUS_MAP.FAILED.statusMessage;
      default:
        return "--";
    }
  }
  getUploadFileTypes() {
    if (
      [REPAYMENT_SCHEDULE.value, REPAYMENT_DUE_SCHEDULE.value].includes(
        get(this.selectedReportType, "value", "")
      )
    ) {
      return [...ACCEPTED_FILE_TYPES_FOR_UPLOAD, "xml", "json"];
    }
    return ACCEPTED_FILE_TYPES_FOR_UPLOAD;
  }

  openUploadDialog = (): void => {
    const dialogRef = this.dialog.open(UploadReportPopupComponent, {
      minWidth: "45vw",
      maxHeight: "80vh",
      data: {
        reportsRouteUrl: "kcredit/upload",
        uploadLoanStatus: get(this.selectedReportType, "value", ""),
        acceptedFileTypes: this.getUploadFileTypes(),
        dialogTitle: get(
          this.selectedReportType,
          "dialogTitle",
          DEFAULT_UPLOAD_REPORT_TITLE
        ),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      if (result) {
        this.loadAll(
          get(this.selectedReportType, "value", ""),
          this.page,
          this.itemsPerPage,
          this.sortColumn
        );
      }
    });
  };

  updateReportType() {
    this.loadAll(
      this.selectedReportType["value"],
      this.page,
      this.itemsPerPage,
      this.sortColumn
    );
  }
}
