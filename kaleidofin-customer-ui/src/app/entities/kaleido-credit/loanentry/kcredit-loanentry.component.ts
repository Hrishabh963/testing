import { HttpResponse } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { get } from "lodash";
import { JhiParseLinks } from "ng-jhipster";
import { BehaviorSubject, Subject } from "rxjs";
import { UI_COMPONENTS } from "src/app/constants/ui-config";
import { PrincipalService } from "src/app/core";
import { getProperty } from "src/app/utils/app.utils";
import { DashboardService } from "../../dashboard/dashboard.service";
import { AUTHORITES } from "../constants/authorization.constants";
import { LoanDetails } from "../models/krediline/loan-details.model";
import { AuthorizationService } from "../services/authorization.service";
import { UiConfigService } from "../services/ui-config.service";
import { LoanIncompleteReasonDialogComponent } from "../shared/loan-incomplete-reason/loan-incomplete-reason-dialog/loan-incomplete-reason-dialog.component";
import { LoanEntryStageMetrics } from "../models/loan-overview/loan-application-status-metric";
import { LoanApplicationSearchFilterService } from "../services/loan-application-search-filter.service";
import { AssociateLenderService } from "../services/associate-lender/associate-lender.service";
import { ReviewStateManagementService } from "../services/review-state-management.service";
import { takeUntil } from "rxjs/operators";
import { LoanReviewService } from "../report/loan-review.service";
@Component({
  selector: "jhi-kcredit-loanentry",
  templateUrl: "./kcredit-loanentry.component.html",
  styleUrls: ["./kcredit-loanentry.css"],
})
export class KCreditLoanEntryComponent implements OnInit, OnDestroy {
  isSelected: boolean = false;
  isLoanEntry: boolean = true;
  selectedIndex: number = 0;

  currentAccount: any;
  errorObject: any;
  success: any;
  routeData: any;
  links: any;
  totalItems: any;
  queryCount: any;
  page: number = 0;
  itemsPerPage: any;
  status: any = "";
  predicate: any;
  previousPage: number = 1;
  reverse: any;

  loanIncompleteCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  loanCompleteCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  allLoanCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  applicationStatuses: Array<any> = [];
  searchParams: any = {};

  selectedApplicationStatus: string;

  selectedLoanPhase: string = "";
  selectedReviewStatus: string;
  SearchBy;
  customerType: string = "All";
  loanDetails: LoanDetails[];

  searchValues: string;
  searchPlaceholder: string =
    "Search by Application ID/Mobile Number/Customer Name";

  authority = {
    search: false,
    viewAction: false,
  };

  actionFields: any = {
    all: [],
    incomplete: [],
    complete: [],
  };
  tableData: Array<any> = [];
  requiredFilters: BehaviorSubject<Array<any>> = new BehaviorSubject<
    Array<any>
  >([]);
  fields: Array<any> = [];
  loanCount: any = {
    incomplete: 0,
    complete: 0,
    all: 0,
  };

  private $destroyRef: Subject<void> = new Subject<void>();

  constructor(
    private readonly parseLinks: JhiParseLinks,
    private readonly principal: PrincipalService,
    public readonly fb: FormBuilder,
    public readonly dialog: MatDialog,
    private readonly loanService: LoanReviewService,
    private readonly dashboardService: DashboardService,
    private readonly authorizationService: AuthorizationService,
    private readonly router: Router,
    private readonly uiConfigService: UiConfigService,
    private readonly loanFilterService: LoanApplicationSearchFilterService,
    private readonly lenderService: AssociateLenderService,
    private readonly reviewStateService: ReviewStateManagementService
  ) {
    this.itemsPerPage = 20;
  }

  ngOnInit() {
    this.principal.identity().then((account) => {
      this.dashboardService.sendMessage("shownav");
      this.currentAccount = account;
      this.uiConfigService.getUiConfigurations().pipe(takeUntil(this.$destroyRef)).subscribe((configurations) => {
        let config = getProperty(configurations, UI_COMPONENTS.LOAN_ENTRY, {});
        this.fields = getProperty(config, "FIELDS", []);
        let filters: Array<string> = getProperty(config, "requiredFilters", []);
        this.requiredFilters.next(
          filters.map((filter) => this.loanFilterService.FILTERS[filter])
        );
        this.updateTableByStatus();
        let placeholder = getProperty(config, "searchPlaceholder", "");
        if (placeholder) {
          this.searchPlaceholder = placeholder;
        }
        const applicationStatus: Array<any> = getProperty(
          config,
          "applicationStatus",
          []
        );
        const showViewButton: boolean = get(config, "showViewButton", true);

        this.getApplicationStatus(applicationStatus);
        this.selectedApplicationStatus = getProperty(
          applicationStatus[0],
          "status",
          "incomplete"
        );
        this.authority = {
          search: this.authorizationService.hasAuthority(
            AUTHORITES.LOANENTRY_SEARCH
          ),
          viewAction: this.authorizationService.hasAuthority(
            AUTHORITES.LOANENTRY_ACTIONVIEW
          ),
        };
        this.actionFields = {
          all: [],
          incomplete: [],
          complete: [],
        };
        if (this.authority.viewAction && showViewButton) {
          this.addActionButton();
        }
        this.updateTableColumns(applicationStatus);
      });
      this.subscribeToLoanCount();
      this.updateTableByStatus();
      this.retriveLoanApplications();
    });
    this.reviewStateService.resetToBase();
  }

  ngOnDestroy(): void {
    if(this.$destroyRef) {
      this.$destroyRef.next()
      this.$destroyRef.complete()
    }
  }

  openLoanDetails(loanData: any = {}) {
    this.router.navigate([
      "/kcredit/entry/loan",
      getProperty(loanData, "id", ""),
    ]);
  }

  onFilterChange(filter: Array<any> = []) {
    this.updateFilter(this.searchParams, filter);
    this.retriveLoanApplications();
  }

  private onSuccess(data, headers) {
    const loanApplications = getProperty(data, "loanApplications", []);
    const loanCount = getProperty(data, "loanCounts", {});
    this.updateLoanApplicationCount(loanCount);
    this.links = this.parseLinks.parse(headers.get("link"));
    this.totalItems = headers.get("X-Total-Count");
    this.queryCount = this.totalItems;
    this.loanDetails = loanApplications;
  }

  updateFilter(searchBy: any = {}, filters: Array<any> = []) {
    if (filters) {
      filters.forEach((filter) => {
        searchBy[getProperty(filter, "type", "")] = getProperty(
          filter,
          "value",
          ""
        );
      });
    }
  }

  updateLoanApplicationCount(loanCount: any = {}) {
    const loanEntryPageMetrics = new LoanEntryStageMetrics(loanCount);
    this.loanIncompleteCount.next(loanEntryPageMetrics.incomplete);
    this.loanCompleteCount.next(loanEntryPageMetrics.complete);
    this.allLoanCount.next(loanEntryPageMetrics.all);
  }
  createRequestPayload() {
    return {
      page: this.page - 1,
      size: this.itemsPerPage,
      applicationStatus: this.selectedApplicationStatus,
      loanPhase: this.selectedLoanPhase,
      searchValues: this.searchValues || "",
      loanProduct: "kcredit",
    };
  }
  retriveLoanApplications() {
    let requestPayload = this.createRequestPayload();
    requestPayload = {
      ...this.searchParams,
      ...requestPayload,
    };
    this.loanService.fetchLoanApplications(requestPayload).subscribe(
      (response: HttpResponse<any>) => {
        this.onSuccess(
          getProperty(response, "body", []),
          getProperty(response, "headers", {})
        );
      },
      (error: HttpResponse<any>) => console.error(error)
    );
  }

  getApplicationStatus(applicationStatus: Array<any>): string[] {
    this.applicationStatuses = applicationStatus.map((status) => {
      const countLabel = getProperty(status, "fieldKey", "");
      status.count = this.loanCount[countLabel];
      return { ...status };
    });
    return this.applicationStatuses;
  }

  updateTableByStatus(status: string = this.selectedApplicationStatus) {
    this.tableData = this.fields.concat(this.actionFields[status]);
  }
  onApplicationStateSelection(status, i) {
    this.loanDetails = [];
    this.selectedApplicationStatus = getProperty(status, "status", "");
    this.selectedLoanPhase = getProperty(status, "loanPhase", "");
    this.selectedIndex = i;
    this.updateTableByStatus(getProperty(status, "fieldKey", ""));
    this.retriveLoanApplications();
  }
  transition() {
    this.retriveLoanApplications();
  }

  onSearch(condition: any) {
    this.searchValues = condition.searchBy.join(",");
    this.page = 0;
    if (condition.executeSearch) {
      this.retriveLoanApplications();
    }
  }

  loadPage(currentPage: number) {
    this.page = currentPage;
    if (currentPage !== this.previousPage) {
      this.previousPage = currentPage;
      this.transition();
    }
  }

  showIncompleteReasons(application: any = null) {
    if (
      !this.authorizationService.hasAuthority(
        AUTHORITES.LOANENTRY_REASONSINCOMPLETE
      )
    ) {
      return;
    }
    if (
      !application &&
      ["incomplete", ""].includes(get(application, "applicationStatus", ""))
    ) {
      return;
    }
    this.displayIncompleteReason(application);
  }

  displayIncompleteReason(application: any = null) {
    this.dialog.open(LoanIncompleteReasonDialogComponent, {
      width: "40vw",
      maxWidth: "100vw",
      data: {
        application: application,
        incompleteReasons: get(application, "invalidFields", ""),
        missingRequiredDocuments: get(
          application,
          "missingRequiredDocuments",
          ""
        ),
      },
    });
  }

  subscribeToLoanCount() {
    this.loanIncompleteCount.subscribe((value) => {
      this.loanCount["incomplete"] = value;
      this.applicationStatuses = this.getApplicationStatus(
        this.applicationStatuses
      );
    });
    this.loanCompleteCount.subscribe((value) => {
      this.loanCount["complete"] = value;
      this.applicationStatuses = this.getApplicationStatus(
        this.applicationStatuses
      );
    });
    this.allLoanCount.subscribe((value) => {
      this.loanCount["all"] = value;
      this.applicationStatuses = this.getApplicationStatus(
        this.applicationStatuses
      );
    });
  }

  addActionButton() {
    const ACTION_FIELD = {
      label: "Action",
      propertyKey: "",
      class: "review-button",
      type: "button",
      buttonText: "View",
      checkDisable: (loanDetails) => this.checkReviewDisable(loanDetails),
      handler: (loanData) => this.openLoanDetails(loanData),
    };
    Object.keys(this.actionFields).forEach((actionKey) =>
      this.actionFields[actionKey].unshift(ACTION_FIELD)
    );
  }

  updateTableColumns(applicationStatus: Array<any>) {
    const MISSING_DETAILS_FIELDS = {
      label: " ",
      propertyKey: "",
      value: "Missing Details",
      class: "",
      classWithProperty: "applicationStatus",
      type: "clickable",
      handler: (loanData) => this.showIncompleteReasons(loanData),
    };
    const ENTRY_STATUS_WITH_REASONS = {
      label: "Entry Status",
      propertyKey: "applicationStatus",
      value: "",
      class: "",
      classWithProperty: "applicationStatus",
      type: "staticText",
      handler: (loanData) => this.showIncompleteReasons(loanData),
      useViewMapper: true,
      viewMapper: {
        incomplete: "Incomplete",
        complete: this.getMapperValue(),
      },
    };
    applicationStatus.forEach((status) => {
      const showMissinDetails: boolean = get(
        status,
        "showMissingDetails",
        false
      );
      const showEntryStatusWithReasons: boolean = get(
        status,
        "showEntryStatusWithReasons",
        false
      );
      if (showMissinDetails) {
        this.actionFields[status?.fieldKey].push(MISSING_DETAILS_FIELDS);
      }
      if (showEntryStatusWithReasons) {
        this.actionFields[status?.fieldKey].push(ENTRY_STATUS_WITH_REASONS);
      }
    });
  }
  getMapperValue(): string {
    const label: boolean = this.applicationStatuses.some((value) => {
      const label: string = getProperty(value, "label", "");
      return label.toLowerCase() === "pending";
    });
    return label ? "Pending" : "Complete";
  }
  checkReviewDisable(loanDetails: any): boolean {
    const lenderCode: string = this.lenderService.getLenderCode();
    if (lenderCode.toUpperCase() !== "KCPL") return false;
    const loanReviewInfoDTO: any = getProperty(
      loanDetails,
      "loanReviewInfoDTO",
      {}
    );
    const reviewButon: string = getProperty(
      loanReviewInfoDTO,
      "reviewButton",
      "disable"
    );
    return reviewButon.toLowerCase() !== "enable";
  }
}
