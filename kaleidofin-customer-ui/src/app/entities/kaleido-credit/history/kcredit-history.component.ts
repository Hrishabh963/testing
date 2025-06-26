import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";

import { ActivatedRoute } from "@angular/router";
import {
  JhiAlertService,
  JhiLanguageService,
  JhiParseLinks,
} from "ng-jhipster";
import { PrincipalService } from "src/app/core";
import { LoanDetails } from "../models/krediline/loan-details.model";
import { DashboardService } from "../../dashboard/dashboard.service";
import { AssociateLenderService } from "../services/associate-lender/associate-lender.service";
import { ReviewStateManagementService } from "../services/review-state-management.service";
import { LoanReviewService } from "../report/loan-review.service";

@Component({
  selector: "jhi-kcredit-history",
  templateUrl: "./kcredit-history.component.html",
  styleUrls: ["./kcredit-history.css"],
})
export class KCreditLoanHistoryComponent implements OnInit, OnDestroy {
  isSelected: boolean = false;
  currentAccount: any;
  errorObject: any;
  success: any;
  routeData: any;
  links: any;
  totalItems: any;
  queryCount: any;
  page: any = 4;
  itemsPerPage: any;
  status: any = "";
  predicate: any;
  previousPage: any;
  reverse: any;
  languageKey;

  applicationStatus: string[];
  selectedLoanPhase: string = "";
  SearchBy;
  selectedCustomerTypes: string = "All";
  customerType = new FormControl();
  customerTypeList: string[] = [];
  loanDetails: LoanDetails[];
  searchValues: string;
  searchPlaceholder: string = "Search by Application/Mobile Numbers";
  loanAppStatus = new FormControl();
  loanAppStatusList: string[] = [
    "Loan Review",
    "Loan Agreement",
    "Loan Booking",
    "Disbursal",
  ];

  isDCBMFI: boolean = false;

  constructor(
    private readonly parseLinks: JhiParseLinks,
    private readonly jhiLanguageService: JhiLanguageService,
    private readonly alertService: JhiAlertService,
    private readonly principal: PrincipalService,
    private readonly activatedRoute: ActivatedRoute,
    public readonly fb: FormBuilder,
    public readonly dialog: MatDialog,
    private readonly loanReviewService: LoanReviewService,
    private readonly dashboardService: DashboardService,
    private readonly associateLenderService: AssociateLenderService,
    private readonly reviewStateService: ReviewStateManagementService
  ) {
    this.itemsPerPage = 20;
  }

  ngOnInit() {
    this.customerType.setValue(["All"]);
    this.routeData = this.activatedRoute.data.subscribe((data) => {
      if (data !== undefined) {
        this.page = data["pagingParams"].page;
        this.previousPage = data["pagingParams"].page;
        this.reverse = data["pagingParams"].ascending;
        this.predicate = data["pagingParams"].predicate;
      }
    });
    this.principal.identity().then((account) => {
      this.dashboardService.sendMessage("shownav");
      this.currentAccount = account;
      this.languageKey = this.currentAccount.langKey;
      this.jhiLanguageService.changeLanguage(this.languageKey);
      this.retriveLoanApplications();
    });

    this.customerTypeList = this.associateLenderService.currentLenderLoanTypes;
    this.customerTypeList.unshift("All");
    this.isDCBMFI =
      this.associateLenderService.getLenderCode().toUpperCase() === "DCBMFI";
    this.reviewStateService.resetToBase();
  }

  ngOnDestroy() {
    this.routeData?.unsubscribe();
  }

  inputChange(value: string, type: string = "customerType") {
    this[type].setValue(value);
    this.retriveLoanApplications();
  }

  private onSuccess(data, headers) {
    this.links = this.parseLinks.parse(headers.get("link"));
    this.totalItems = headers.get("X-Total-Count");
    this.queryCount = this.totalItems;
    this.loanDetails = data?.loanApplications || [];
  }
  private onError(error) {
    this.alertService.error(error.error, null, null);
  }
  private onSucessReview(msg) {
    this.alertService.success("Review Successful", null, null);
  }
  retriveLoanApplications() {
    this.SearchBy = {};
    this.SearchBy.selectAny = "";
    this.SearchBy.applicationStatus = "";
    this.SearchBy.loanPhase = this.selectedLoanPhase;
    if (!"All".includes(this.customerType.value)) {
      this.SearchBy.loanType = this.customerType.value;
    }

    if (this.loanAppStatus.value === "Loan Review")
      this.SearchBy.loanPhase = "review";
    if (this.loanAppStatus.value === "Loan Agreement")
      this.SearchBy.loanPhase = "agreement";
    if (this.loanAppStatus.value === "Loan Booking")
      this.SearchBy.loanPhase = "booking";
    if (this.loanAppStatus.value === "Disbursal")
      this.SearchBy.loanPhase = "disbursal";

    this.loanReviewService
      .getKcreditApplications({
        page: this.page - 1,
        size: this.itemsPerPage,
        applicationStatus: "",
        loanPhase: this.selectedLoanPhase,
        search: this.SearchBy,
        searchValues: this.searchValues,
      })
      .subscribe(
        (res) => this.onSuccess(res.body, res.headers),
        (res) => this.onError(res)
      );
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

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }
}
