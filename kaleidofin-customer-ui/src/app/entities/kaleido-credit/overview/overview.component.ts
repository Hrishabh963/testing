import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";

import { ActivatedRoute } from "@angular/router";
import { JhiLanguageService } from "ng-jhipster";
import { PrincipalService } from "src/app/core";
import { KCREDIT_ITEMS_PER_PAGE } from "src/app/shared";
import { DashboardService } from "../../dashboard/dashboard.service";
import { LoanPhaseMetrics } from "../models/loan-overview/loan-application-phase-metrics";
import { getProperty } from "src/app/utils/app.utils";
import { UiConfigService } from "../services/ui-config.service";
import { UI_COMPONENTS } from "src/app/constants/ui-config";
import { LoanApplicationSearchFilterService } from "../services/loan-application-search-filter.service";
import { AssociateLenderService } from "../services/associate-lender/associate-lender.service";
import { ReviewStateManagementService } from "../services/review-state-management.service";
import { LoanReviewService } from "../report/loan-review.service";

@Component({
  selector: "jhi-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["../kaleido-credit.css", "./overview.component.scss"],
})
export class OverviewComponent implements OnInit, OnDestroy {
  currentAccount: any;
  errorObject: any;
  success: any;
  routeData: any;
  links: any;
  totalItems: any;
  queryCount: any;
  itemsPerPage: any;
  status: any = "";
  predicate: any;
  previousPage: any;
  reverse: any;
  loanDetails: any;
  languageKey;
  loanCounts: Map<any, Map<any, any>>;

  requiredFilters: Array<any> = new Array();
  tableData: LoanPhaseMetrics[];
  tableTotal: LoanPhaseMetrics;
  searchBy: any = {};
  isDCBMFI: boolean = false;

  constructor(
    private readonly jhiLanguageService: JhiLanguageService,
    private readonly principal: PrincipalService,
    private readonly activatedRoute: ActivatedRoute,
    public readonly fb: FormBuilder,
    public readonly dialog: MatDialog,
    private readonly loanReviewService: LoanReviewService,
    private readonly dashboardService: DashboardService,
    private readonly uiConfigService: UiConfigService,
    private readonly loanFilterService: LoanApplicationSearchFilterService,
    private readonly associateLenderService: AssociateLenderService,
    private readonly reviewStateService: ReviewStateManagementService
  ) {
    this.itemsPerPage = KCREDIT_ITEMS_PER_PAGE;
  }

  ngOnInit() {
    this.routeData = this.activatedRoute.data.subscribe((data) => { });
    this.principal.identity().then((account) => {
      this.dashboardService.sendMessage("shownav");
      this.currentAccount = account;
      this.languageKey = this.currentAccount.langKey;
      this.jhiLanguageService.changeLanguage(this.languageKey);
      this.getLoanMetrics();
      this.getUiConfiguration();
    });
    this.isDCBMFI =
      this.associateLenderService.getLenderCode().toLowerCase() === "dcbmfi";
      this.reviewStateService.resetToBase();
  }
  ngOnDestroy() {
    this.routeData?.unsubscribe();
  }

  getLoanMetrics() {
    this.loanReviewService.getPartnerLoanCounts(this.searchBy).subscribe((response: Map<string, LoanPhaseMetrics>) => {
      this.tableData = [];
      this.tableTotal = new LoanPhaseMetrics({});
      response.forEach((countDto, partnerName) => {
        countDto.partnerName = partnerName;
        this.tableData.push(countDto);
        this.tableTotal.addMoreCount(countDto);
      });
    });
  }

  getUiConfiguration(): void {
    this.uiConfigService
      .getUiConfigurations()
      .subscribe((configurations: Object) => {
        const overviewSection: Object = getProperty(
          configurations,
          UI_COMPONENTS.LOAN_OVERVIEW_REVIEW,
          {}
        );

        const filters: Array<string> = getProperty(
          overviewSection,
          "requiredFilters",
          []
        );
        this.requiredFilters = filters.map((filter) => this.loanFilterService.FILTERS[filter]);
      });
  }

  onFilterChange(filterValues: Array<any> = []): void {
    this.updateFilter(filterValues);
    this.getLoanMetrics();
  }

  updateFilter(filters: Array<any> = []) {
    if (filters) {
      filters.forEach((filter) => {
        this.searchBy[getProperty(filter, "type", "")] = getProperty(
          filter,
          "value",
          ""
        );
      });
    }
  }

}
