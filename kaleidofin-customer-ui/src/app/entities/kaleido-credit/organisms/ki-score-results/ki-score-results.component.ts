import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { HttpResponse } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { DashboardService } from "src/app/entities/dashboard/dashboard.service";
import { getProperty } from "src/app/utils/app.utils";
import { KiscoreResultsStageMetrics } from "../../models/loan-overview/loan-application-status-metric";
import { KiScoreService } from "../../services/ki-score.service";

@Component({
  selector: "app-ki-score-results",
  templateUrl: "./ki-score-results.component.html",
  styleUrls: ["./ki-score-results.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class KiScoreResultsComponent implements OnInit {
  selectedStage = "all";
  searchValues: string = "";
  searchParams: any = {};
  links: any;
  totalItems: number = 0;
  queryCount: number = 0;
  page: number = 0;
  itemsPerPage: number = 10;
  status: any = "";
  predicate: any;
  previousPage: number = 0;
  reverse: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  kiscoreResults: any = [];
  dataSource = new MatTableDataSource<any>(this.kiscoreResults);

  pendingCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  approvedCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  rejectedCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  cancelledCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  allCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  taskId: string = null;
  columnsToDisplayWithExpand = [
    "timeAndDate",
    "customerId",
    "loanId",
    "loanType",
    "branch",
    "kiscore",
    "cbScore",
    "productType",
    "status",
  ];

  expandedElement: any = null;

  apiViewMapper = {
    all: "incomplete,pending,externalpending,scoredrejected,scoredapproved,cancelled",
    pending: "incomplete,pending,externalpending",
    scoredrejected: "scoredrejected",
    cancelled: "cancelled",
    scoredapproved: "scoredapproved",
  };
  loanTenureMapper = {
    fortnightly: "days",
    half_yearly: "years",
    monthly: "months",
    MONTHS: "months",
    quarterly: "months",
    weekly: "weeks",
    yearly: "years",
  };
  stageViewMapper = {
    all: "All",
    pending: "Pending",
    externalpending: "Pending",
    incomplete: "Pending",
    scoredrejected: "Rejected",
    cancelled: "Cancelled",
    scoredapproved: "Approved",
  };
  countMapper = {
    all: this.allCount,
    pending: this.pendingCount,
    scoredrejected: this.rejectedCount,
    cancelled: this.cancelledCount,
    scoredapproved: this.approvedCount,
  };
  classViewMapper = {
    pending: { class: "pending", icon: "access_time" },
    externalpending: { class: "pending", icon: "access_time" },
    incomplete: { class: "pending", icon: "access_time" },
    scoredrejected: { class: "rejected", icon: "error" },
    cancelled: { class: "cancelled", icon: "cancel" },
    scoredapproved: { class: "approved", icon: "check_circle" },
  };
  stages = [
    { value: "all" },
    { value: "scoredapproved" },
    { value: "scoredrejected" },
    { value: "pending" },
    { value: "cancelled" },
  ];
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly kiscoreService: KiScoreService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.taskId = params.get("id") || "";
    });

    this.dashboardService.sendMessage("shownav");
    this.fetchKiscoreResults();
  }
  onSearch(condition: any) {
    this.searchValues = condition.searchBy.join(",");
    this.page = 0;
    if (condition.executeSearch) {
      this.fetchKiscoreResults();
    }
  }

  fetchKiscoreResults() {
    if (!this.selectedStage) {
      return null;
    }
    this.searchParams = {};
    let requestPayload = {
      page: this.page,
      size: this.itemsPerPage,
      applicationStatus: this.apiViewMapper[this.selectedStage],
      searchValues: this.searchValues || "",
      taskId: this.taskId,
      loanProduct: "kcredit",
      ...this.searchParams,
    };
    this.kiscoreService.fetchKiScoreResults(requestPayload).subscribe(
      (response: HttpResponse<any>) => {
        this.onSuccess(
          getProperty(response, "body", []),
          getProperty(response, "headers", {})
        );
      },
      (error: HttpResponse<any>) => this.onError(error)
    );
  }
  private onSuccessCounts(loanCount: any = {}) {
    // loan review
    const reviewPhaseMetrics = new KiscoreResultsStageMetrics(loanCount);
    this.pendingCount.next(reviewPhaseMetrics.pending);
    this.approvedCount.next(reviewPhaseMetrics.approved);
    this.rejectedCount.next(reviewPhaseMetrics.rejected);
    this.cancelledCount.next(reviewPhaseMetrics.cancelled);
    this.allCount.next(reviewPhaseMetrics.all);
  }

  private onSuccess(data, headers) {
    const kiscoreResults = getProperty(data, "loanApplications", []);
    const loanCount = getProperty(data, "loanCounts", {});
    this.onSuccessCounts(loanCount);
    this.totalItems = headers.get("X-Total-Count");
    this.queryCount = this.totalItems;
    this.kiscoreResults = kiscoreResults;
    this.dataSource.data = this.kiscoreResults;
    if (this.paginator) {
      this.paginator.length = this.totalItems;
    }
  }

  private onError(error) {
    console.error(error);
  }

  selectStage(stage: string) {
    this.page = 0;
    this.selectedStage = stage;
    this.fetchKiscoreResults();
  }

  onLoadPage(pageEvent: any = {}) {
    let currentPage = pageEvent?.pageIndex;
    this.page = currentPage;
    if (currentPage !== this.previousPage) {
      this.previousPage = currentPage;
      this.fetchKiscoreResults();
    }
  }

  getLoanTenure(loanTenure: any = "", repaymentFrequency: string = "") {
    return `${loanTenure} ${
      this.loanTenureMapper[repaymentFrequency?.toLowerCase()] || ""
    }`;
  }

  goBack() {
    this.router.navigate(["/kcredit/kiscore"]);
  }
}
