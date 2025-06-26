import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { UI_COMPONENTS } from "src/app/constants/ui-config";
import { PrincipalService } from "src/app/core";
import { DashboardService } from "src/app/entities/dashboard/dashboard.service";
import { getProperty, getUiConfig } from "src/app/utils/app.utils";
import { ReportGenerationService } from "../../genreport/kcredit-reportgen.service";
import { UiConfigService } from "../../services/ui-config.service";
import {
  LOAN_CKYC_REPORTS_UPLOAD_TYPES
} from "../../upload/kcredit-upload.constants";
import { ReviewStateManagementService } from "../../services/review-state-management.service";

@Component({
  selector: "app-kicredit-uploads",
  templateUrl: "./kicredit-uploads.component.html",
  styleUrls: ["./kicredit-uploads.component.scss"],
})
export class KicreditUploadsComponent implements OnInit {
  reportTypes = LOAN_CKYC_REPORTS_UPLOAD_TYPES;

  page: number = 0;
  itemsPerPage: number = 0;
  previousPage: number = 0;
  predicate: any;
  totalItems: any;
  queryCount: any;
  links: any;
  reverse: any;
  sortColumn: string = "";

  routeData: any;

  uploadReports: Array<any> = [];
  readonly uiConfig: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private readonly router: Router,
    private readonly principal: PrincipalService,
    private readonly uiConfigService: UiConfigService,
    private readonly dashboardService: DashboardService,
    private readonly reportService: ReportGenerationService,
    private readonly activatedRoute: ActivatedRoute,
    public  readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly reviewStateService: ReviewStateManagementService
  ) {}

  ngOnInit() {
    this.itemsPerPage = 8;
    this.sortColumn = "createdDate,desc";

    this.routeData = this.activatedRoute.data.subscribe((data) => {
      if (data?.["pagingParams"]) {
        this.page = data["pagingParams"].page;
        this.previousPage = data["pagingParams"].page;
      }
    });

    this.principal.identity().then(() => {
      this.dashboardService.sendMessage("shownav");
    });
    this.uiConfigService.getUiConfigBySection(UI_COMPONENTS.CKYC_UPLOADS,UI_COMPONENTS.UPLOAD_REPORTS).subscribe(
      (reportsConfig) => {
        this.itemsPerPage = getProperty(reportsConfig, "reportsPerPage", 8);
        this.fetchReports();
        this.uiConfig.next(getUiConfig(reportsConfig));
      },
      (error) => this.onError(error)
    );
    this.reviewStateService.resetToBase();
  }
  ngOnDestroy() {
    this.routeData?.unsubscribe();
  }

  private onError(error) {
    this.snackBar.open(error.error, "", { duration: 4000 });
  }

  fetchUploadedReports(event: any) {
    const reportType = getProperty(event, "reportType", "");
    this.fetchReports(reportType);
  }

  fetchReports(reportType: string = "") {
    this.reportService
      .fetchLoanReports(
        reportType,
        this.page - 1,
        this.itemsPerPage,
        "id,desc",
        "UPLOAD_REQUESTS"
      )
      .subscribe(
        (response) => {
          console.log(response);
          this.uploadReports = getProperty(response, "content", []);
          this.totalItems = getProperty(response, "totalElements", 0);
        },
        (error) => this.onError(error)
      );
  }

  loadPage(page: number) {
    this.page = page;
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }
  transition() {
    this.router.navigate(["/kcredit/uploads"], {
      queryParams: {
        page: this.page,
        sort: this.predicate + "," + (this.reverse ? "asc" : "desc"),
      },
    });
    this.fetchReports();
  }
}
