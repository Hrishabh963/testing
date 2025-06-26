import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { JhiParseLinks } from "ng-jhipster";
import { BehaviorSubject } from "rxjs";
import { UI_COMPONENTS } from "src/app/constants/ui-config";
import { PrincipalService } from "src/app/core";
import { DashboardService } from "src/app/entities/dashboard/dashboard.service";
import { UiConfigService } from "src/app/entities/kaleido-credit/services/ui-config.service";
import { getProperty, getUiConfig } from "src/app/utils/app.utils";
import { ReportGenerationService } from "../../genreport/kcredit-reportgen.service";
import { GenerateReportsService } from "../../services/generate-reports.service";
import { ReportsFilterComponent } from "../../molecules/reports/reports-filter/reports-filter.component";
import { ReviewStateManagementService } from "../../services/review-state-management.service";
const DEFAULT_REPORT_TYPE = {
  reportType: "",
  reportPurpose: "REPORT_GENERATION",
  size: 8,
};

@Component({
  selector: "app-kicredit-reports",
  templateUrl: "./kicredit-reports.component.html",
  styleUrls: [
    "../../genreport/loan-status-menu/loan-status-menu.component.scss",
    "../../genreport/kcredit-reportgeneration.scss",
  ],
})
export class KicreditReportsComponent implements OnInit, OnDestroy {
  routeData: any;
  page: number = 0;
  previousPage: number = 0;
  predicate: any;
  totalItems: any;
  queryCount: any;
  links: any;
  reverse: any;

  jobDetailsList: Array<any>;

  itemsPerPage: number = 8;

  uiConfig: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly uiConfigService: UiConfigService,
    private readonly parseLinks: JhiParseLinks,
    private readonly principalService: PrincipalService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    public readonly fb: FormBuilder,
    public readonly dialog: MatDialog,
    public readonly snackBar: MatSnackBar,
    private readonly reportGenerationService: ReportGenerationService,
    private readonly snackbar: MatSnackBar,
    private readonly reportService: GenerateReportsService,
    private readonly reviewStateService: ReviewStateManagementService
  ) {}

  ngOnInit(): void {
    this.principalService.identity().then(() => {
      this.dashboardService.sendMessage("shownav");
    });
    this.uiConfigService
      .getUiConfigBySection(
        UI_COMPONENTS.CKYC_REPORTS,
        UI_COMPONENTS.LOAN_REPORTS
      )
      .subscribe(
        (reportsConfig) => {
          this.itemsPerPage = getProperty(reportsConfig, "reportsPerPage", 8);
          this.fetchKiCreditReports(DEFAULT_REPORT_TYPE);
          this.uiConfig.next(getUiConfig(reportsConfig));
        },
        (error) => console.error(error)
      );
    this.reviewStateService.resetToBase();
  }

  fetchKiCreditReports(reportData: any) {
    const reportType = getProperty(reportData, "reportType", null);
    const size = getProperty(reportData, "size", this.itemsPerPage);
    const successMessage = getProperty(reportData, "successMessage", "");
    this.reportGenerationService
      .fetchLoanReports(reportType, this.page - 1, size, "id,desc")
      .subscribe(
        (response: any) => {
          this.totalItems = getProperty(response, "totalElements", 0);
          this.links = this.parseLinks.parse(
            `</api/backoffice/upload/paginatedKCreditReports?page=1&size=8>; rel="next",</api/backoffice/upload/paginatedKCreditReports?page=207&size=8>; rel="last",</api/backoffice/upload/paginatedKCreditReports?page=0&size=8>; rel="first"`
          );
          this.queryCount = this.totalItems;
          this.jobDetailsList = getProperty(response, "content", 0);
          if (successMessage) {
            this.snackbar.open(successMessage, "", {
              duration: 5000,
            });
          }
        },
        (res: any) => this.onError(res)
      );
  }

  private onError(error) {
    this.snackBar.open(error.error, "", { duration: 4000 });
  }

  ngOnDestroy() {
    this.routeData?.unsubscribe();
  }
  loadPage(page: number) {
    this.page = page;
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }
  transition() {
    this.router.navigate(["/kcredit/reports"], {
      queryParams: {
        page: this.page,
        sort: (this.reverse ? "asc" : "desc"),
      },
    });
    this.fetchKiCreditReports(DEFAULT_REPORT_TYPE);
  }
  openGenerateReport() {
    const dialogRef = this.dialog.open(ReportsFilterComponent, {
      width: "800px", // Adjust width as needed
      data: {
        prop1: this.uiConfig,
        callback: this.fetchKiCreditReports.bind(this),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("Dialog result:", result);
        this.fetchKiCreditReports(DEFAULT_REPORT_TYPE);
      }
    });
  }
}
