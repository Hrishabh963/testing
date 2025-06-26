import { HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { cloneDeep, get, isEmpty } from "lodash";
import { JhiParseLinks } from "ng-jhipster";
import { BehaviorSubject } from "rxjs";
import { UI_COMPONENTS } from "src/app/constants/ui-config";
import { PrincipalService } from "src/app/core";
import { getProperty } from "src/app/utils/app.utils";
import { DashboardService } from "../../dashboard/dashboard.service";
import { AUTHORITES } from "../constants/authorization.constants";
import { KcreditInterDataService } from "../kcredit-inter-data.service";
import {
  ApplicationStatus,
  getLoanApplicationStageValues,
} from "../loan/constant";
import { AssociateLender } from "../models/associate-lender.model";
import { LoanDetails } from "../models/krediline/loan-details.model";
import { AssociateLenderService } from "../services/associate-lender/associate-lender.service";
import { AuthorizationService } from "../services/authorization.service";
import { UiConfigService } from "../services/ui-config.service";
import { LoanApplicationReviewDialogComponent } from "./kcredit-confirmation-dialog";
import { LoanApplicationReviewRejectDialogComponent } from "./kcredit-confirmation-reject-dialog";
import { LoanReviewPopupService } from "./kcredit-popup-service";
import { LoanReviewService } from "./loan-review.service";
import {
  LoanAgreementStageMetrics,
  LoanBookingStageMetrics,
  LoanDisbursalStageMetrics,
  LoanReviewStageMetrics,
} from "../models/loan-overview/loan-application-status-metric";
import { LoanApplicationSearchFilterService } from "../services/loan-application-search-filter.service";
import { ReviewStateManagementService } from "../services/review-state-management.service";
import { ConfirmationPopupComponent } from "../molecules/confirmation-popup/confirmation-popup.component";
import { CustomSnackbarComponent } from "../molecules/custom-snackbar/custom-snackbar.component";

const FIELDS = {
  LOANREVIEW: [
    { label: "Date & Time", propertyKey: "createdDate", pipe: "date" },
    { label: "Application ID", propertyKey: "partnerLoanId" },
    { label: "Center Id", propertyKey: "centerId" },
    { label: "Group Id", propertyKey: "groupId" },
    { label: "Name", propertyKey: "customerName" },
    { label: "Mobile Number", propertyKey: "secondaryMobileNumber" },
    { label: "Customer ID", propertyKey: "partnerCustomerId" },
    { label: "Partner ID", propertyKey: "partnerId" },
    { label: "Penny Drop", propertyKey: "partnerCustomerId" },
    { label: "Review Status", propertyKey: "partnerCustomerId" },
    { label: "Rule", propertyKey: "rule" },
  ],
  LOANAGREEMENT: [
    { label: "Date & Time", propertyKey: "createdDate", pipe: "date" },
    { label: "Application ID", propertyKey: "partnerLoanId" },
    { label: "Name", propertyKey: "customerName" },
    { label: "Mobile Number", propertyKey: "secondaryMobileNumber" },
    { label: "Customer ID", propertyKey: "partnerCustomerId" },
  ],
  LOANBOOKING: [
    { label: "Date & Time", propertyKey: "createdDate", pipe: "date" },
    { label: "Application ID", propertyKey: "partnerLoanId" },
    { label: "Name", propertyKey: "customerName" },
    { label: "Mobile Number", propertyKey: "secondaryMobileNumber" },
    { label: "Customer ID", propertyKey: "partnerCustomerId" },
    { label: "Remarks", propertyKey: "remarks" },
  ],
  LOANDISBURSAL: [
    { label: "Date & Time", propertyKey: "createdDate", pipe: "date" },
    { label: "Application ID", propertyKey: "partnerLoanId" },
    { label: "Name", propertyKey: "customerName" },
    { label: "Mobile Number", propertyKey: "secondaryMobileNumber" },
    { label: "Customer ID", propertyKey: "partnerCustomerId" },
    { label: "Loan Amount", propertyKey: "loanAmount", pipe: "currency" },
    { label: "Loan Account Number", propertyKey: "applicationNumber" },
  ],
};

@Component({
  selector: "jhi-kcredit-report",
  templateUrl: "./kcredit-report.component.html",
  styleUrls: ["./kcredit-report.css"],
})
export class KCreditReportComponent implements OnInit {
  isSelected: boolean = false;
  selectedFirstLevelIndex: number = null;
  selectedSecondLevelIndex: number = null;
  selectedIndex: number = null;
  selectedReviewIndex: number = null;
  selectedAgreementIndex: number = null;
  selectedBookingIndex: number = null;
  selectedDisburmentIndex: number = null;
  checkAll: boolean = false;

  currentAccount: any;
  errorObject: any;
  success: any;
  routeData: any;
  links: any;
  totalItems: number = 0;
  queryCount: number = 0;
  page: number = 0;
  itemsPerPage: number = 0;
  status: any = "";
  predicate: any;
  previousPage: number = 0;
  reverse: boolean = false;
  languageKey;
  isLoanReviewSubmit: boolean = false;
  checkedList: any[];
  selectedApplicationId: any[];
  loanListCheck: any[];
  check: boolean = false;
  modalRef: NgbModalRef;
  loanCounts: BehaviorSubject<any> = new BehaviorSubject<any>({});
  isLoanReview: boolean = false;
  isLoanAgreement: boolean = false;
  isLoanBooking: boolean = false;
  isLoanDisbursal: boolean = false;
  jlgMinimumSizeBreachedList: any[];
  groupJlgRejectMap = new Map();
  showMoreFilter: boolean = false;
  isDCBLender: boolean = false;
  enableDisbursalAuthorisation: boolean = false;

  isReviewSubmitted: boolean = false;

  checkedListWithEligibilityPassed: any[];
  checkedListWithEligibilityFailed: any[];

  loanEntryCount: number = 0;
  loanIncompleteCount: number = 0;
  loanCompleteCount: number = 0;

  loanReviewCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  loanPendingCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  loanApprovedCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  loanRejectCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  loanReviewCancelledCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  loanRetryCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  loanAgreementsCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  loanAgreementPendingCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  loanAgreementReceivedCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  loanAgreementApprovedCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  loanAgreementRetryCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  loanBookingCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  loanBookingPendingCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  loanBookingRejectedCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  loanBookingApprovedCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  loanBookingReceivedCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  loanBookingRetryCount: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );

  loanDisbursalCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  loanDisbursalPendingCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  loanDisbursalExternalPendingCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  loanDisbursedCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  loanDisbursalAuthorizedCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  loanExternalDisbursalCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  selectedLoanStatusMap: any = {};

  applicationStatus: string[] = [];
  loanReviewStates: string[] = [];
  loanAgreementStates: string[] = [];
  loanBookingStates: string[] = [];
  loanDisbursalStates: string[] = [];

  selectedLoanStatus: string = "LOANREVIEW";

  selectedApplicationStatus: any = "";
  selectedSubstage: any = {};

  loanDetails: LoanDetails[] = [];

  searchValues: string;
  searchParams: any = {};

  searchPlaceholder: string =
    "Search by Application ID/Mobile Number/Customer Name";
  associateLenderList: AssociateLender[];
  selectedOptionForLendingPartnerFilter: string = "";

  loanStages: Array<any> = [];

  enableLoanReportDownload: boolean = false;

  authority: any = {};
  requiredFilters: BehaviorSubject<Array<string>> = new BehaviorSubject<
    Array<string>
  >([]);

  loanBookingRecieved = {
    label: "Received",
    count: this.loanBookingReceivedCount,
    tableData: [],
    applicationStatus: [ApplicationStatus.bookingReceived],
  };
  loanBookingRework = {
    label: "Rework",
    count: this.loanBookingRetryCount,
    tableData: [],
    applicationStatus: [ApplicationStatus.bookingRetry],
  };

  checkboxField = {
    label: "",
    propertyKey: "",
    class: "",
    type: "checkbox",
    headerHandler: ($event) => this.onSelectAll($event),
    handler: (loanData, $event) => this.onCheckboxChange(loanData, $event),
  };

  statusField = {
    label: "Entry Status",
    propertyKey: "applicationStatus",
    value: "",
    class: "",
    classWithProperty: "applicationStatus",
    type: "staticText",
  };
  actionField: any = {
    id: "actionField",
    label: "Action",
    propertyKey: "",
    class: "review-button",
    type: "buttonWithNotification",
    buttonText: "Review",
    checkDisable: (loanDetails) => this.checkReviewDisable(loanDetails),
    handler: (loanData) => this.openLoanDetails(loanData),
    disableHoverText: "System check in Progress",
    checkForDisable: true,
  };

  retryBookingField: any = {
    id: "retryBookingField",
    label: "",
    propertyKey: "",
    class: "review-button",
    type: "button",
    buttonText: "Retry Booking",
    handler: (loanData) => this.retryBooking(loanData),
    checkForDisable: false,
  };

  SUBSTAGE_MAP = {
    LOANREVIEW: [
      {
        label: "Pending",
        count: this.loanPendingCount,
        tableData: [this.checkboxField],
        applicationStatus: [
          ApplicationStatus.pending,
          ApplicationStatus.externalpending,
        ],
      },
      {
        label: "Rejected",
        count: this.loanRejectCount,
        tableData: [],
        applicationStatus: [ApplicationStatus.reject],
      },
      {
        label: "Rework",
        count: this.loanRetryCount,
        tableData: [],
        applicationStatus: [ApplicationStatus.retry],
      },
      {
        label: "Approved",
        count: this.loanApprovedCount,
        tableData: [],
        applicationStatus: [ApplicationStatus.conditionalapprove],
      },
      {
        label: "Cancelled",
        count: this.loanReviewCancelledCount,
        tableData: [],
        applicationStatus: [ApplicationStatus.cancelled],
      },
      {
        label: "All",
        count: this.loanReviewCount,
        tableData: [],
        applicationStatus: [
          ApplicationStatus.pending,
          ApplicationStatus.externalpending,
          ApplicationStatus.retry,
          ApplicationStatus.reject,
          ApplicationStatus.conditionalapprove,
          ApplicationStatus.cancelled,
        ],
      },
    ],
    LOANAGREEMENT: [
      {
        label: "Pending",
        count: this.loanAgreementPendingCount,
        tableData: [this.checkboxField],
        applicationStatus: [ApplicationStatus.pendingagreement],
      },
      {
        label: "Received",
        count: this.loanAgreementReceivedCount,
        tableData: [this.checkboxField],
        applicationStatus: [ApplicationStatus.agreementreceived],
      },
      {
        label: "Rework",
        count: this.loanAgreementRetryCount,
        tableData: [],
        applicationStatus: [ApplicationStatus.agreementretry],
      },
      {
        label: "Approved",
        count: this.loanAgreementApprovedCount,
        tableData: [],
        applicationStatus: [ApplicationStatus.approve],
      },
      {
        label: "All",
        count: this.loanAgreementsCount,
        tableData: [],
        applicationStatus: [
          ApplicationStatus.pendingagreement,
          ApplicationStatus.agreementreceived,
          ApplicationStatus.agreementretry,
          ApplicationStatus.approve,
        ],
      },
    ],
    LOANBOOKING: [
      {
        label: "Pending",
        count: this.loanBookingPendingCount,
        tableData: [this.checkboxField],
        applicationStatus: [
          ApplicationStatus.pendingbooking,
          ApplicationStatus.externalbooking,
        ],
      },
      {
        label: "Booked",
        count: this.loanBookingApprovedCount,
        tableData: [],
        applicationStatus: [ApplicationStatus.booked],
      },
      {
        label: "Rejected",
        count: this.loanBookingRejectedCount,
        tableData: [],
        applicationStatus: [
          ApplicationStatus.rejectedbooking,
          ApplicationStatus.rejectedexternalbooking,
        ],
      },
      {
        label: "All",
        count: this.loanBookingCount,
        tableData: [],
        applicationStatus: [
          ApplicationStatus.rejectedbooking,
          ApplicationStatus.rejectedexternalbooking,
          ApplicationStatus.pendingbooking,
          ApplicationStatus.externalbooking,
          ApplicationStatus.booked,
        ],
      },
    ],
    LOANDISBURSAL: [
      {
        label: "Pending",
        count: this.loanDisbursalPendingCount,
        tableData: [],
        applicationStatus: [
          ApplicationStatus.pendingdisbursal,
          ApplicationStatus.externaldisbursal,
        ],
      },
      {
        label: "Disbursed",
        count: this.loanDisbursedCount,
        tableData: [],
        applicationStatus: [ApplicationStatus.disbursed],
      },
      {
        label: "All",
        count: this.loanDisbursalCount,
        tableData: [],
        applicationStatus: [
          ApplicationStatus.externaldisbursal,
          ApplicationStatus.disbursed,
          ApplicationStatus.pendingdisbursal,
        ],
      },
    ],
  };

  loanDisbursalAuthorized = {
    label: "Authorized",
    count: this.loanDisbursalAuthorizedCount,
    tableData: [],
    applicationStatus: [ApplicationStatus.AUTHORIZE],
  };

  checkboxFields: any = {};

  tableData: Array<any> = [];
  fields: Array<any> = [];
  tableUpdated: boolean = false;
  openLoanDetails(loanData: any = {}) {
    this.router.navigate(["/kcredit/loan", getProperty(loanData, "id", "")]);
  }
  constructor(
    private readonly parseLinks: JhiParseLinks,
    private readonly snackbar: MatSnackBar,
    private readonly principal: PrincipalService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    public readonly fb: FormBuilder,
    public readonly dialog: MatDialog,
    private readonly loanReviewService: LoanReviewService,
    private readonly loanApplicationReviewService: LoanReviewService,
    private readonly loanReviewPopupService: LoanReviewPopupService,
    private readonly kcreditInterDataService: KcreditInterDataService,
    private readonly dashboardService: DashboardService,
    private readonly associateLenderService: AssociateLenderService,
    private readonly authorizationService: AuthorizationService,
    private readonly loanFilterService: LoanApplicationSearchFilterService,
    private readonly uiConfigService: UiConfigService,
    private readonly reviewStateService: ReviewStateManagementService
  ) {
    this.itemsPerPage = 20;
  }

  ngOnInit() {
    this.routeData = this.activatedRoute.data.subscribe((data) => {
      if (data !== undefined) {
        this.page = data["pagingParams"].page;
        this.previousPage = data["pagingParams"].page;
        this.reverse = data["pagingParams"].ascending;
        this.predicate = data["pagingParams"].predicate;
      }
    });
    this.isDCBLender = this.associateLenderService
      .getLenderCode()
      .toLowerCase()
      .includes("dcb");

    this.authority = {
      ...this.authority,
      search: this.authorizationService.hasAuthority(
        AUTHORITES.LOANREVIEW_SEARCH
      ),
      loanReviewAction: this.authorizationService.hasAuthority(
        AUTHORITES.LOANREVIEW_ACTIONREVIEW
      ),
      loanAgreementAction: this.authorizationService.hasAuthority(
        AUTHORITES.LOANAGREEMENT_ACTIONREVIEW
      ),
      loanBookingAction: this.authorizationService.hasAuthority(
        AUTHORITES.LOANBOOKING_ACTIONREVIEW
      ),
      loanDisbursalAction: this.authorizationService.hasAuthority(
        AUTHORITES.LOANDISBURSAL_ACTIONREVIEW
      ),
      downloadReportView: AUTHORITES.DOWNLOADLOANAPPDOCS,
    };

    this.principal.identity().then(() => {
      this.dashboardService.sendMessage("shownav");
      this.resetValues();
      this.selectedFirstLevelIndex =
        this.reviewStateService.$selectedFirstLevelIndex;
      this.enableLoanReportDownload =
        this.associateLenderService.enableDownloadReports;
      this.tableData = FIELDS.LOANREVIEW;
      this.uiConfigService.getUiConfigurations().subscribe((configurations) => {
        let config: Object = getProperty(
          configurations,
          UI_COMPONENTS.LOAN_APPLICATIONS_REVIEW,
          {}
        );
        if (!isEmpty(config) && !this.tableUpdated) {
          this.fields = getProperty(config, "FIELDS", []);
          let filters: Array<string> = getProperty(
            config,
            "requiredFilters",
            []
          );
          let enableRetryBooking = get(config, "enableRetryBooking", false);
          this.enableDisbursalAuthorisation = get(
            config,
            "enableDisbursalAuthorisation",
            false
          );
          this.requiredFilters.next(
            filters.map((filter) => this.loanFilterService.FILTERS[filter])
          );
          this.requiredFilters.subscribe((value) => {
            if (value.length > 2) {
              this.showMoreFilter = true;
            }
          });
          if (this.enableDisbursalAuthorisation) {
            this.addDisbursalAuthorized();
          }
          this.updateTableByStatus();
          let placeholder = getProperty(config, "searchPlaceholder", "");
          if (placeholder) {
            this.searchPlaceholder = placeholder;
          }
          this.updateLoanStages(enableRetryBooking);
          this.retriveLoanApplications();
          this.tableUpdated = true;
        }
      });
    });
    const lender: string = this.associateLenderService.getLenderCode();

    if (lender === "ICICI") {
      this.addBookingRecieved(this.loanBookingRecieved);
      this.addBookingRecieved(
        this.loanBookingRework,
        this.SUBSTAGE_MAP.LOANBOOKING.length - 1
      );
    }
    if (lender === "DCBMFI") {
      this.addBookingRecieved(this.loanBookingRecieved);
    }
  }

  updateTableByStatus() {
    let fields = Object.keys(this.fields);
    fields.forEach((field) => {
      let sections: Array<any> = this.SUBSTAGE_MAP[field];
      sections.forEach((section) => {
        let tableData: Array<any> = section["tableData"] || [];
        let fields = cloneDeep(this.fields[field]);
        if (!section["label"].includes("All")) {
          let statusIndex = fields.findIndex(
            (x) => !x.label.includes("PDD") && x.label.includes("Status")
          );
          if (statusIndex !== -1) {
            fields.splice(statusIndex, 1);
          }
        }
        if (section["label"].includes("Authorized")) {
          let pddStatusIndex = fields.findIndex((x) => x.label.includes("PDD"));
          if (pddStatusIndex !== -1) {
            fields.splice(pddStatusIndex, 1);
          }
        }
        if (!section["label"].includes("Authorized")) {
          let statusIndex = fields.findIndex((x) =>
            x.label.includes("Bank Status")
          );
          if (statusIndex !== -1) {
            fields.splice(statusIndex, 1);
          }
        }
     
        section["tableData"] = tableData.concat(fields);
      });
    });
    this.tableUpdated = true;
  }

  onFilterChange(filter: Array<any> = []) {
    this.updateFilter(this.searchParams, filter);
    this.reviewStateService.$searchParams = this.searchParams;
    this.retriveLoanApplications();
  }
  updateFilter(searchBy: any = {}, filters: Array<any> = []) {
    if (filters) {
      filters.forEach((filter) => {
        let value = getProperty(filter, "value", "");
        let type = getProperty(filter, "type", "");
        if (value) {
          searchBy[type] = value;
        } else {
          delete searchBy[type];
        }
      });
    }
  }
  private updateCount(
    countSubject: BehaviorSubject<number>,
    status: string,
    loanCount: any = {}
  ) {
    countSubject.next(loanCount[status] || 0);
  }

  private updateCombinedCount(
    countSubject: BehaviorSubject<number>,
    statuses: string[],
    loanCount: any = {}
  ) {
    const combinedCount = statuses.reduce(
      (acc, status) => acc + (loanCount[status] || 0),
      0
    );
    countSubject.next(combinedCount);
  }

  private onSuccessCounts(loanCount: any = {}) {
    // loan review
    const reviewPhaseMetrics = new LoanReviewStageMetrics(loanCount);
    this.loanPendingCount.next(reviewPhaseMetrics.pending);
    this.loanReviewCancelledCount.next(reviewPhaseMetrics.cancelled);
    this.loanApprovedCount.next(reviewPhaseMetrics.approved);
    this.loanRetryCount.next(reviewPhaseMetrics.rework);
    this.loanRejectCount.next(reviewPhaseMetrics.rejected);
    this.loanReviewCount.next(reviewPhaseMetrics.all);

    // agreement
    const agreementPhaseMetrics = new LoanAgreementStageMetrics(loanCount);
    this.loanAgreementPendingCount.next(agreementPhaseMetrics.pending);
    this.loanAgreementReceivedCount.next(agreementPhaseMetrics.received);
    this.loanAgreementRetryCount.next(agreementPhaseMetrics.rework);
    this.loanAgreementApprovedCount.next(agreementPhaseMetrics.approved);
    this.loanAgreementsCount.next(agreementPhaseMetrics.all);

    // booking
    const bookingPhaseMetrics = new LoanBookingStageMetrics(loanCount);
    this.loanBookingPendingCount.next(bookingPhaseMetrics.pending);
    this.loanBookingReceivedCount.next(bookingPhaseMetrics.recieved);
    this.loanBookingApprovedCount.next(bookingPhaseMetrics.booked);
    this.loanBookingRejectedCount.next(bookingPhaseMetrics.rejected);
    this.loanBookingRetryCount.next(bookingPhaseMetrics.retry);
    this.loanBookingCount.next(bookingPhaseMetrics.all);

    // disbursal
    const disbursalPhaseMetrics = new LoanDisbursalStageMetrics(loanCount);
    this.loanDisbursalPendingCount.next(disbursalPhaseMetrics.pending);
    this.loanDisbursedCount.next(disbursalPhaseMetrics.disbursed);
    this.loanDisbursalCount.next(disbursalPhaseMetrics.all);
    this.loanDisbursalAuthorizedCount.next(disbursalPhaseMetrics.authorize);
  }

  private onSuccess(data, headers) {
    const loanApplications = getProperty(data, "loanApplications", []);
    const loanCount = getProperty(data, "loanCounts", {});
    this.onSuccessCounts(loanCount);
    this.links = this.parseLinks?.parse(headers?.get("link"));
    this.totalItems = headers?.get("X-Total-Count");
    this.queryCount = this.totalItems;
    this.loanDetails = loanApplications;
    this.loanDetails.forEach((i) => {
      i.isLoanSelected = this.isSelected;
      i.showWarningIcon = this.getWarningIconDisplay(i);
      i.notificationCount = this.getNotificationCount(i);
    });
  }
  private onError(error) {
    this.resetValues();
    this.snackbar.open(error, "", { duration: 5000 });
  }

  retriveLoanApplications() {
    if (!this.selectedApplicationStatus) {
      return null;
    }
    this.checkedList = [];
    this.searchParams = this.reviewStateService.$searchParams;
    this.searchValues = this.reviewStateService.$searchValues;
    let requestPayload = {
      page: this.page - 1,
      size: this.itemsPerPage,
      applicationStatus: this.selectedApplicationStatus,
      searchValues: this.searchValues || "",
      loanProduct: "kcredit",
      ...this.searchParams,
    };
    this.loanReviewService.fetchLoanApplications(requestPayload).subscribe(
      (response: HttpResponse<any>) => {
        this.onSuccess(
          getProperty(response, "body", []),
          getProperty(response, "headers", {})
        );
      },
      (error: HttpResponse<any>) => console.error(error)
    );
  }

  updateLoanStages(
    enableRetryBooking: boolean = false,
  ) {
    try {
      const lenderData = this.associateLenderService.getLenderData();
      const loanStages = Object.values(getProperty(lenderData, "loanStageConfig", {}));
      let loanStates = getLoanApplicationStageValues(loanStages);
      loanStates = loanStates.filter((state) =>
        this.authorizationService.hasAuthority(state?.actionAuthority)
      );
      this.loanStages = loanStates.map((loan) => ({
        ...loan,
        count: this[loan?.property],
      }));
      let stage = this.reviewStateService.$selectedLoanStatus;
      this.loanStages.forEach((loanStage) => {
        let stage = getProperty(
          loanStage,
          `substagePropertyKey`,
          "LOANAGREEMENT"
        );
        let actionAuthority = getProperty(loanStage, "actionAuthority", "");
        this.updateActionFields(stage, actionAuthority);
      });

      this.selectedLoanStatusMap = {
        stage,
        substages: this.SUBSTAGE_MAP[stage],
      };
      this.selectedSubstage =
        this.reviewStateService.$selectedSubstage ||
        this.SUBSTAGE_MAP[stage][0];
      this.selectedSecondLevelIndex =
        this.reviewStateService.$selectedSecondLevelIndex || 0;
      this.selectedApplicationStatus = getProperty(
        this.selectedSubstage,
        "applicationStatus",
        []
      );

      if (enableRetryBooking) {
        this.updateRetryBookingField();
      }

      this.updateTable();
    } catch (e) {
      console.error(e);
    }
  }
  updateTable() {
    this.tableData = getProperty(this.selectedSubstage, "tableData", []);
  }

  updateActionFields(stage: string = "LOANAGREEMENT", authority: string = "") {
    let subStages: Array<any> = this.SUBSTAGE_MAP[stage];
    subStages.forEach((subStage) => {
      if (authority && this.authorizationService.hasAuthority(authority)) {
        subStage["tableData"].push(this.actionField);
      }
    });
  }

  updateRetryBookingField(): void {
    let subStages: Array<any> = this.SUBSTAGE_MAP["LOANBOOKING"];
    subStages.forEach((subStage) => {
      if (subStage.label === "Rejected") {
        subStage["tableData"].push(this.retryBookingField);
      }
    });
  }

  onCheckboxChange(option, event) {
    if (event.checked) {
      this.checkedList.push(option.id);
      this.selectedApplicationId.push(option.applicationNumber);
      if (this.disableLoanSelection(option)) {
        this.addSubtractCheckedListWithPassedOrFailed(option, true);
      }
    } else {
      this.checkedList.splice(this.checkedList.indexOf(option.id), 1);
      this.selectedApplicationId.splice(
        this.selectedApplicationId.indexOf(option.applicationNumber),
        1
      );
      this.loanListCheck.splice(this.loanListCheck.indexOf(option.status), 1);
      this.check = false;
      this.addSubtractCheckedListWithPassedOrFailed(option, false);
    }
    this.checkAllSelected();
    this.isLoanReviewSubmit = this.checkedList.length > 0;
  }

  addSubtractCheckedListWithPassedOrFailed(option, checked) {
    if (checked) {
      this.handleCheckedOption(option);
    } else {
      this.handleUncheckedOption(option);
    }
  }

  handleCheckedOption(option) {
    if (option.eligibility === true) {
      this.checkedListWithEligibilityPassed.push(option.id);
    } else if (option.eligibility === false) {
      this.checkedListWithEligibilityFailed.push(option.id);
    }

    if (option.groupId) {
      if (this.groupJlgRejectMap.has(option.groupId)) {
        let subGroupJlgRejectMap = this.groupJlgRejectMap.get(option.groupId);
        subGroupJlgRejectMap.set(
          "noOfSelected",
          subGroupJlgRejectMap.get("noOfSelected") + 1
        );
        this.groupJlgRejectMap.set(option.groupId, subGroupJlgRejectMap);
      } else {
        let subGroupJlgRejectMap = new Map();
        subGroupJlgRejectMap.set("noOfSelected", 1);
        subGroupJlgRejectMap.set("minJlgSize", option.minJlgSize);
        subGroupJlgRejectMap.set("currentGroupSize", option.currentGroupSize);
        this.groupJlgRejectMap.set(option.groupId, subGroupJlgRejectMap);
      }
    }
  }

  handleUncheckedOption(option) {
    if (option.eligibility === true)
      this.checkedListWithEligibilityPassed.splice(
        this.checkedListWithEligibilityPassed.indexOf(option.id),
        1
      );
    else if (option.eligibility === false)
      this.checkedListWithEligibilityFailed.splice(
        this.checkedListWithEligibilityFailed.indexOf(option.id),
        1
      );

    if (option.groupId) {
      if (this.groupJlgRejectMap.has(option.groupId)) {
        let subGroupJlgRejectMap = this.groupJlgRejectMap.get(option.groupId);
        subGroupJlgRejectMap.set(
          "noOfSelected",
          subGroupJlgRejectMap.get("noOfSelected") - 1
        );
        if (
          this.jlgMinimumSizeBreachedList.indexOf(option.groupId) >= 0 &&
          subGroupJlgRejectMap.get("currentGroupSize") -
            subGroupJlgRejectMap.get("noOfSelected") >=
            subGroupJlgRejectMap.get("minJlgSize")
        ) {
          this.jlgMinimumSizeBreachedList.splice(
            this.jlgMinimumSizeBreachedList.indexOf(option.groupId),
            1
          );
        }
        this.groupJlgRejectMap.set(option.groupId, subGroupJlgRejectMap);
      }
    }
  }

  loanSubstageHandler(data: any = {}) {
    this.page = 1;
    this.selectedSecondLevelIndex = getProperty(data, "index", 0);
    this.reviewStateService.$selectedSecondLevelIndex =
      this.selectedSecondLevelIndex;
    this.previousPage = this.page;
    this.selectedSubstage = getProperty(data, "status", {});
    this.reviewStateService.$selectedSubstage = this.selectedSubstage;
    this.updateTable();

    this.selectedApplicationStatus = getProperty(
      data,
      "status.applicationStatus",
      []
    );
    this.retriveLoanApplications();
  }
  loanStageChangehandler(data: any = {}) {
    let status = getProperty(data, "status.label", "");
    let i = getProperty(data, "index", 0);
    let stage = getProperty(data, "status.substagePropertyKey", "");
    this.selectedLoanStatus = stage;
    this.reviewStateService.$selectedLoanStatus = this.selectedLoanStatus;
    this.selectedLoanStatusMap = {
      stage,
      substages: this.SUBSTAGE_MAP[stage],
    };

    this.page = 1;
    this.selectedFirstLevelIndex = i;
    this.reviewStateService.$selectedFirstLevelIndex =
      this.selectedFirstLevelIndex;
    this.selectedSecondLevelIndex = 0;
    this.reviewStateService.$selectedSecondLevelIndex = 0;
    this.selectedSubstage = this.SUBSTAGE_MAP[stage][0];
    this.reviewStateService.$selectedSubstage = this.selectedSubstage;
    this.selectedApplicationStatus = getProperty(
      this.selectedSubstage,
      "applicationStatus",
      []
    );
    this.updateTable();
    switch (status) {
      case "Loan Review":
        this.authority = {
          ...this.authority,
          search: this.authorizationService.hasAuthority(
            AUTHORITES.LOANREVIEW_SEARCH
          ),
        };
        break;
      case "Loan Agreement":
        this.authority = {
          ...this.authority,
          search: this.authorizationService.hasAuthority(
            AUTHORITES.LOANAGREEMENT_SEARCH
          ),
        };
        break;
      case "Loan Booking":
        this.authority = {
          ...this.authority,
          search: this.authorizationService.hasAuthority(
            AUTHORITES.LOANBOOKING_SEARCH
          ),
        };
        break;
      case "Disbursal":
        this.authority = {
          ...this.authority,
          search: this.authorizationService.hasAuthority(
            AUTHORITES.LOANDISBURSAL_SEARCH
          ),
        };
        break;
      default:
        break;
    }
    this.retriveLoanApplications();
  }

  transition() {
    this.retriveLoanApplications();
  }

  confirmSubmit(status, comment: string = "") {
    this.loanApplicationReviewService
      .bulkStatusUpdate(this.checkedListWithEligibilityPassed, status, comment)
      .subscribe(
        () => this.updateStatus(),
        (error: Response) => this.onError(get(error, "error.message", ""))
      );
    this.retriveLoanApplications();
  }
  confirmReject(
    status: string = "",
    rejectionReason: string = "",
    actionRequired: string[] = []
  ) {
    this.loanApplicationReviewService
      .bulkStatusUpdate(
        this.checkedList,
        status,
        rejectionReason,
        actionRequired
      )
      .subscribe(
        () => this.updateStatus(),
        (error: Response) => this.onError(get(error, "error.message", ""))
      );
    this.retriveLoanApplications();
  }
  loadPage(currentPage: number) {
    this.page = currentPage;
    if (currentPage !== this.previousPage) {
      this.previousPage = currentPage;
      this.transition();
    }
  }

  resetValues() {
    this.isLoanReviewSubmit = false;
    this.checkedList = [];
    this.selectedApplicationId = [];
    this.checkedListWithEligibilityPassed = [];
    this.checkedListWithEligibilityFailed = [];
    this.jlgMinimumSizeBreachedList = [];
  }
  updateStatus() {
    this.resetValues();
    this.retriveLoanApplications();
  }
  onSelectAll(e: any): void {
    this.checkedList = [];
    this.selectedApplicationId = [];
    this.checkedListWithEligibilityPassed = [];
    this.checkedListWithEligibilityFailed = [];
    this.jlgMinimumSizeBreachedList = [];
    this.loanListCheck = [];
    this.check = false;
    this.loanDetails.forEach((loanDetail) => {
      if (this.disableLoanSelection(loanDetail)) {
        this.addSubtractCheckedListWithPassedOrFailed(loanDetail, e);
      }
      loanDetail["showWarningIcon"] = this.getWarningIconDisplay(loanDetail);
      loanDetail["isLoanSelected"] = e.checked;
      if (loanDetail["isLoanSelected"]) {
        this.checkedList.push(get(loanDetail, "id"));
        this.selectedApplicationId.push(get(loanDetail, "applicationNumber"));
        this.loanListCheck.push(loanDetail);
      }
    });
    this.checkAllSelected();
  }
  getEligibility(loanApplication: LoanDetails): string {
    let eligibilityStatus = get(loanApplication, "eligibility", false);
    let breDecision = loanApplication.breDecision;
    if (
      eligibilityStatus === false ||
      (breDecision && breDecision !== "ACCEPT")
    ) {
      return "Fail";
    } else if (
      breDecision &&
      eligibilityStatus === true &&
      breDecision === "ACCEPT"
    ) {
      return "Pass";
    } else if (eligibilityStatus) {
      return "Pass";
    }
    return "";
  }

  getBankValidationStatus(loanApplication: any): any {
    if (loanApplication !== undefined && loanApplication !== null) {
      if (loanApplication.bankValidationStatus === "VERIFIED") {
        return "Verified";
      } else if (loanApplication.bankValidationStatus === "INITIATED") {
        return "Initiated";
      } else if (loanApplication.bankValidationStatus === "FAILURE") {
        return "Failure";
      } else if (
        loanApplication.bankValidationStatus === "RE_VERIFY" ||
        (loanApplication.bankValidationStatus === "RE_VERIFY_BANK_STATEMENT" &&
          loanApplication.applicationStatus ===
            ApplicationStatus.agreementreceived)
      ) {
        return "ReVerify";
      } else {
        return "NotVerified";
      }
    }
  }

  getNotificationCount(loanApplication: any): number {
    if (loanApplication !== undefined && loanApplication !== null) {
      if (
        loanApplication.bankValidationStatus === "RE_VERIFY" ||
        (loanApplication.bankValidationStatus === "RE_VERIFY_BANK_STATEMENT" &&
          loanApplication.applicationStatus ===
            ApplicationStatus.agreementreceived) ||
        loanApplication.adrProcessingStage === "REVIEW_PROCESSED"
      ) {
        return 1;
      }
    }
    return 0;
  }

  getAgreementStatus(applicationStatus: string, approvePhase: string): string {
    if (applicationStatus === ApplicationStatus.approve) {
      switch (approvePhase) {
        case ApplicationStatus.disbursed:
          return "approved post disbursal";
        case ApplicationStatus.pendingdisbursal:
          return "approved pre disbursal";
        case ApplicationStatus.booked:
          return "approved post booking";
        case ApplicationStatus.pendingbooking:
          return "approved pre booking";
        case ApplicationStatus.pendingagreement:
          return "approved pre agreement";
        case ApplicationStatus.agreementreceived:
          return "approved post agreement";
        default:
          return null;
      }
    }
    if (applicationStatus === ApplicationStatus.pendingagreement) {
      return "pending";
    }
    if (applicationStatus === ApplicationStatus.agreementreceived) {
      return "agreement received";
    }
    return "approved";
  }

  openConfirmDialog(status) {
    if (status === "conditionalapprove") {
      this.modalRef = this.loanReviewPopupService.open(
        <Component>LoanApplicationReviewDialogComponent,
        this.checkedList.length,
        this.checkedListWithEligibilityPassed.length,
        this.checkedListWithEligibilityFailed.length,
        false,
        0
      );
      this.modalRef.result.then(
        (result) => {
          if (result.event === "confirm") {
            if (
              ApplicationStatus.agreementreceived ===
              get(this.selectedApplicationStatus, "[0]", "")
            ) {
              status = "approve";
            }
            this.confirmSubmit(status, result.comment);
          }
        },
        (error) => {
          const a = false;
        }
      );
    } else {
      this.groupJlgRejectMap.forEach((subGroupJlgRejectMap: any, key: any) => {
        if (
          subGroupJlgRejectMap.get("currentGroupSize") -
            subGroupJlgRejectMap.get("noOfSelected") <
          subGroupJlgRejectMap.get("minJlgSize")
        ) {
          this.jlgMinimumSizeBreachedList.push(key);
        }
      });

      this.modalRef = this.loanReviewPopupService.open(
        <Component>LoanApplicationReviewRejectDialogComponent,
        this.checkedList.length,
        this.checkedListWithEligibilityPassed.length,
        this.checkedListWithEligibilityFailed.length,
        false,
        this.jlgMinimumSizeBreachedList.length,
        this.associateLenderService.getPopupConstant(
          this.selectedApplicationStatus
        )
      );
      this.modalRef.result.then(
        (result) => {
          if (result.event === "confirm") {
            this.confirmReject(
              result.rejectionType,
              result.rejectionReason,
              result.actionRequired
            );
          }
        },
        (error) => {
          const a = false;
        }
      );
    }
  }

  onSearch(condition: any) {
    this.searchValues = condition.searchBy.join(",");
    this.reviewStateService.$searchValues = this.searchValues;
    this.page = 0;
    if (condition.executeSearch) {
      this.retriveLoanApplications();
    }
  }

  // @author Yoharaj, @description Task - #13734: Adding a Warning Icon
  getWarningIconDisplay(loanApplication = null) {
    let showWarningIcon = false;
    if (loanApplication && !loanApplication.eligibility) {
      showWarningIcon =
        loanApplication.loanType === "JLG" &&
        loanApplication.minJlgSize &&
        loanApplication.rulePassedGroupSize &&
        loanApplication.rulePassedGroupSize < loanApplication.minJlgSize;
    }
    return showWarningIcon;
  }

  dedupe(loanApplication) {
    this.kcreditInterDataService.setLoanReviewDedupe(true);
    this.loanReview(loanApplication, false);
  }

  loanReview(loanApplication: any, resetDedupe: boolean) {
    if (resetDedupe) {
      this.kcreditInterDataService.setLoanReviewDedupe(false);
    }
    this.router.navigate(["/kcredit/loan/" + loanApplication.id]);
  }

  disableLoanSelection(loanApplication: LoanDetails) {
    const disableLoanSelect: boolean = [
      "conditionalapprove",
      "reject",
      "retry",
    ].includes(loanApplication?.applicationStatus);
    return this.isDCBLender
      ? !disableLoanSelect
      : !(disableLoanSelect || loanApplication.kiscore == null);
  }

  validateDownloadReports(): boolean {
    return (
      get(this.selectedApplicationId, "length", 0) > 0 &&
      this.enableLoanReportDownload &&
      this.checkValidStatusForDownload()
    );
  }

  checkValidStatusForDownload() {
    return (
      [
        ApplicationStatus.pending,
        ApplicationStatus.agreementreceived,
        ApplicationStatus.externalpending,
      ].includes(get(this.selectedApplicationStatus, "[0]", "")) ||
      (this.enableLoanReportDownload &&
        [
          ApplicationStatus.pendingagreement,
          ApplicationStatus.pendingbooking,
          ApplicationStatus.externalbooking,
        ].includes(get(this.selectedApplicationStatus, "[0]", "")))
    );
  }

  enableUserActions() {
    return (
      !["LOANBOOKING", "LOANDISBURSAL"].includes(this.selectedLoanStatus) &&
      [ApplicationStatus.pending, ApplicationStatus.agreementreceived].includes(
        get(this.selectedApplicationStatus, "[0]", "")
      ) &&
      this.checkedList.length
    );
  }

  checkAllSelected() {
    this.checkAll = this.loanDetails.length === this.loanListCheck.length;
  }

  retryBooking(loanData: any = {}) {
    const loanId = getProperty(loanData, "id", null);
    this.loanApplicationReviewService.retryLoanBooking(loanId).subscribe(
      (response) => {
        this.snackbar.open(
          getProperty(
            response,
            "message",
            "Loan booking retried successfully."
          ),
          "",
          { duration: 3000 }
        );
      },
      (error) => {
        this.snackbar.open(
          getProperty(error, "error.message", "Error while Retry Booking"),
          "",
          { duration: 3000 }
        );
      }
    );
  }

  addBookingRecieved(substage = this.loanBookingRecieved, index = 1) {
    this.SUBSTAGE_MAP.LOANBOOKING.splice(index, 0, substage);
  }

  addDisbursalAuthorized(): void {
    this.SUBSTAGE_MAP.LOANDISBURSAL[0].tableData.push(this.checkboxField);
    this.SUBSTAGE_MAP.LOANDISBURSAL.splice(1, 0, this.loanDisbursalAuthorized);
  }

  authorizeLoans(): void {
    this.loanApplicationReviewService
      .authorizeLoanApplications(this.checkedList)
      .subscribe(
        () => {
          this.snackbar.openFromComponent(CustomSnackbarComponent, {
            data: {
              message: `${this.checkedList?.length} selected applications have been authorized.`,
            },
            duration: 3000,
          });
          this.retriveLoanApplications();
        },
        (error) => {
          const errorMessage = getProperty(
            error,
            "error.message",
            "Error while authorising applications."
          );
          this.snackbar.openFromComponent(CustomSnackbarComponent, {
            data: {
              message: errorMessage,
              type: "failure",
            },
            duration: 3000,
          });
        }
      );
  }

  openAuthorizePopup(): void {
    if (this.checkedList?.length) {
      const text: string = `Are you sure you want to proceed with disbursing the selected ${this.checkedList?.length} applications?`;
      const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
        data: {
          popupStyle: "approve",
          title: "Authorize",
          popupText: text,
          confirmButtonText: "Yes, Authorize",
          enableTextField: false,
        },
      });
      dialogRef.afterClosed().subscribe((data) => {
        const forceClosed: boolean = get(data, "forceClosed", false);
        if (forceClosed) {
          return;
        } else {
          this.authorizeLoans();
        }
      });
    }
  }

  checkReviewDisable(loanDetails: any): boolean {
    const lenderCode: string = this.associateLenderService.getLenderCode();
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
