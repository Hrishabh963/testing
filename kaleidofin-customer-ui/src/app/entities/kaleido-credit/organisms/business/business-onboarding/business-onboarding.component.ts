import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { PrincipalService } from "src/app/core";
import { DashboardService } from "src/app/entities/dashboard/dashboard.service";
import { BusinessInvoiceService } from "../../../services/business-invoice/business-invoice.service";
import { get } from "lodash";
import {
  BusinessAgreementStageMetrics,
  BusinessReviewStageMetrics,
} from "../../../models/loan-overview/loan-application-status-metric";
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-business-onboarding",
  templateUrl: "./business-onboarding.component.html",
  styleUrls: ["./business-onboarding.component.scss"],
})
export class BusinessOnboardingComponent implements OnInit {
  businessData: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  selectedTab: string = "businessReview";
  selectedStage: string = "REVIEW_PENDING";
  displayedColumns: string[] = [
    "dateAndTime",
    "businessName",
    "businessID",
    "businessMobile",
    "exportedGoods",
    "location",
    "action",
  ];

  /* Pagination */
  page: number = 0;
  pageSize: number = 5;
  resultsLength: number = 0;

  searchValue = "";
  searchPlaceholder: string =
    "Search by Business name/Business id/Mobile number";

  // Dynamic stage/sub-stage mapping
  stageMapping: { [key: string]: string[] } = {
    businessReview: [
      "REVIEW_PENDING",
      "REWORK",
      "REJECTED",
      "businessReviewAll",
    ],
    businessAgreement: [
      "AGREEMENT_PENDING",
      "AGREEMENT_RECEIVED",
      "APPROVED",
      "AGREEMENT_REWORK",
      "CANCELLED",
      "businessAgreementAll",
    ],
  };

  stageLabelMap = {
    AGREEMENT_PENDING: "Pending",
    REVIEW_PENDING: "Pending",
    AGREEMENT_RECEIVED: "Received",
    REJECTED: "Rejected",
    APPROVED: "Approved",
    REWORK: "Rework",
    AGREEMENT_REWORK: "Rework",
    CANCELLED: "Cancelled",
    businessReviewAll: "All",
    businessAgreementAll: "All",
  };

  businessReviewPendingCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  businessReviewRejectedCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  businessReviewApprovedCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  businessReviewReworkCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  businessReviewCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  businessAgreementPendingCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  businessAgreementReceivedCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  businessAgreementApprovedCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  businessAgreementReworkCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  businessAgreementCancelledCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  businessAgreementCount: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );

  subStageCounts: { [key: string]: BehaviorSubject<number> } = {
    REVIEW_PENDING: this.businessReviewPendingCount,
    AGREEMENT_PENDING: this.businessAgreementPendingCount,
    AGREEMENT_RECEIVED: this.businessAgreementReceivedCount,
    REJECTED: this.businessReviewRejectedCount,
    APPROVED: this.businessAgreementApprovedCount,
    CANCELLED: this.businessAgreementCancelledCount,
    REWORK: this.businessReviewReworkCount,
    AGREEMENT_REWORK: this.businessAgreementReworkCount,
    businessReviewAll: this.businessReviewCount,
    businessAgreementAll: this.businessAgreementCount,
  };

  constructor(
    private readonly principalService: PrincipalService,
    private readonly dashboardService: DashboardService,
    private readonly businessService: BusinessInvoiceService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.principalService.identity().then(() => {
      this.dashboardService.sendMessage("shownav");
      this.fetchData();
    });

    this.businessData.paginator = this.paginator;
    this.businessService.resetStates();

  }

  onTabClick(tab: string): void {
    this.selectedTab = tab;
    this.selectedStage = this.stageMapping[tab][0];
    this.addOrRemoveStatusColumn()
    this.resetPagination();
    this.fetchData();
  }

  addOrRemoveStatusColumn(stage: string = "") {
    if (stage === "businessReviewAll" || stage === "businessAgreementAll") {
      if (!this.displayedColumns.includes("status")) {
        this.displayedColumns.splice(
          this.displayedColumns.length - 1,
          0,
          "status"
        );
      }
    } else {
      this.displayedColumns = this.displayedColumns.filter(
        (col) => col !== "status"
      );
    }
  }

  handleSubStageClick(stage: string): void {
    this.selectedStage = stage;
    this.addOrRemoveStatusColumn(stage);
    this.resetPagination();
    this.fetchData();
  }

  onSearch(condition: any) {
    this.searchValue = condition.searchBy.join(",");
    this.resetPagination();
    this.fetchData();
  }

  fetchData(): void {
    let stageList = [this.selectedStage];

    if (
      ["businessReviewAll", "businessAgreementAll"].includes(this.selectedStage)
    ) {
      stageList = this.stageMapping[this.selectedTab].filter(
        (stage) =>
          !["businessReviewAll", "businessAgreementAll"].includes(stage)
      );
    }

    this.businessService
      .fetchAllBusiness(stageList, this.searchValue, this.page, this.pageSize)
      .subscribe(
        (response: any) => {
          console.log(response);

          let businessCounts: Object = get(response, "body.businessCount", {});
          this.onSuccessCounts(businessCounts);
          let businessList: Array<any> = get(
            response,
            "body.businessDetailsDtoList",
            []
          );
          let addressMap = get(
            response,
            "body.mapOfBusinessIdAndTenantAddressDTO",
            {}
          );
          businessList.forEach((businessData) => {
            const id = businessData?.id;
            const addressDto = id && addressMap[id];
            if (addressDto?.city) {
              businessData["location"] = addressDto.city;
            }
          });

          this.businessData.data = businessList;
          const headers = get(response, "headers", {});
          this.resultsLength = headers.get("X-Total-Count");
        },
        (error) => {
          console.error(error);
        }
      );
  }

  private onSuccessCounts(loanCount: any = {}) {
    // loan review
    const reviewPhaseMetrics = new BusinessReviewStageMetrics(loanCount);
    this.businessReviewPendingCount.next(reviewPhaseMetrics.pending);
    this.businessReviewReworkCount.next(reviewPhaseMetrics.rework);
    this.businessReviewRejectedCount.next(reviewPhaseMetrics.rejected);
    this.businessReviewCount.next(reviewPhaseMetrics.all);

    const agreementPhaseMetrics = new BusinessAgreementStageMetrics(loanCount);
    console.log(agreementPhaseMetrics);

    this.businessAgreementPendingCount.next(agreementPhaseMetrics.pending);
    this.businessAgreementApprovedCount.next(agreementPhaseMetrics.approved);
    this.businessAgreementReworkCount.next(agreementPhaseMetrics.rework);
    this.businessAgreementCancelledCount.next(agreementPhaseMetrics.cancelled);
    this.businessAgreementReceivedCount.next(agreementPhaseMetrics.received);
    this.businessAgreementCount.next(agreementPhaseMetrics.all);
  }

  onPageChange(event: any): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchData();
  }
  resetPagination(): void {
    this.page = 0;
    if (this.paginator) {
      this.paginator.firstPage(); // Reset MatPaginator to the first page
    }
  }

  openBusinessReview(data) {
    this.router.navigate(["/business/review", data?.id]);
  }
}
