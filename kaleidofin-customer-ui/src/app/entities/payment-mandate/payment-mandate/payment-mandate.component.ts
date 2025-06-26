import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { PageEvent } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { PrincipalService } from "src/app/core";
import { TopNavService } from "src/app/layouts/navbar/topnav.service";
import { getProperty } from "src/app/utils/app.utils";
import { DashboardService } from "../../dashboard/dashboard.service";
import { MatSelectOption } from "../../kaleido-credit/loan/constant";
import {
  PaymentMandateData,
  SEARCH_ENTITY_MAP,
} from "../payment-mandate.constants";
import { PaymentMandateService } from "../payment-mandate.service";

@Component({
  selector: "app-payment-mandate",
  templateUrl: "./payment-mandate.component.html",
  styleUrls: ["./payment-mandate.component.scss", "../payment-mandate.scss"],
})
export class PaymentMandateComponent implements OnInit {
  searchInputWidth: boolean = false;
  nameFilter = new FormControl();
  openDateRangeComponent: boolean = false;

  disableSearch: boolean = false;
  disableDownloadBtn: boolean = false;

  searchText: string = "";
  payload: any = { resetPage: true };
  searchEntities: MatSelectOption[] = [];
  selectedSearchEntity: string = "NAME";
  searchPlaceholder: string = "";
  /* Pagination */
  page: number = 0;
  pageSize = 5;
  currentPage = 0;
  resultsLength = 0;

  dataSource: MatTableDataSource<PaymentMandateData>;
  tableData: Array<PaymentMandateData>;
  displayedColumns: string[] = [
    "customerName",
    "startDate",
    "endDate",
    "loanId",
    "emiAmount",
    "frequency",
    "status",
    "action",
  ];

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private readonly principalService: PrincipalService,
    private readonly dashboardService: DashboardService,
    private readonly topNavService: TopNavService,
    private readonly router: Router,
    private readonly paymentMandateService: PaymentMandateService,
    private readonly snackbar: MatSnackBar
  ) {
    const users: PaymentMandateData[] = [];

    this.dataSource = new MatTableDataSource(users);
  }

  ngOnInit(): void {
    this.principalService.identity().then(() => {
      this.dashboardService.sendMessage("shownav");
      this.topNavService.topNav$.next("paymentMandate");
      this.searchEntities = [
        { value: "NAME", viewValue: "Name" },
        { value: "MOBILE_NUMBER", viewValue: "Mobile No" },
        { value: "MANDATE_ID", viewValue: "Mandate ID" },
        { value: "LOAN_ID", viewValue: "Loan ID" },
      ];
      this.searchPlaceholder = SEARCH_ENTITY_MAP[this.selectedSearchEntity];
      this.getPartnerMandates();
    });
  }

  onSearchEntityChange(entity: any) {
    this.searchPlaceholder =
      SEARCH_ENTITY_MAP[getProperty(entity, "value", "")];
  }

  getMandateParameter(payload) {
    let { startDate = null, endDate = null } = payload;

    if (startDate !== null && endDate !== null) {
      return "DATE_RANGE";
    } else if (startDate !== null) {
      return "START_DATE";
    } else if (endDate !== null) {
      return "END_DATE";
    }
    return this.selectedSearchEntity;
  }

  searchMandate(payload: any = this.payload, resetPage: boolean = true) {
    this.payload = {
      ...payload,
      mandateSearchParameter: this.getMandateParameter(payload),
      searchText: this.searchText,
    };
    if (resetPage) {
      this.page = 0;
      this.currentPage = 0;
    }
    this.paymentMandateService
      .searchPaymentMandates(this.payload, this.page, this.pageSize)
      .subscribe(
        (response) => this.handleMandateSuccess(response),
        (error) => this.handleMandateErrors(error)
      );
  }
  getPartnerMandates() {
    this.paymentMandateService
      .getPartnerPaymentMandates(this.page, this.pageSize)
      .subscribe(
        (response) => this.handleMandateSuccess(response),
        (err) => this.handleMandateErrors(err)
      );
  }

  handleMandateSuccess(response: any = {}) {
    this.tableData = getProperty(response, "mandateDtoPage.content", []);
    this.paymentMandateService.modifyData(this.tableData);
    this.dataSource = new MatTableDataSource(this.tableData);
    this.resultsLength = getProperty(
      response,
      "mandateDtoPage.totalElements",
      0
    );
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case "customerName":
          return item.customerName;
        case "emiAmount":
          return item.amount;
        default:
          return item[property];
      }
    };
  }

  handleMandateErrors(err) {
    console.error(err);
    this.snackbar.open(
      getProperty(err, "error.message", "Error while Fetching SI Mandates"),
      "",
      { duration: 4000 }
    );
  }

  getRowClass(index: number): string {
    console.log(index);
    return index % 2 === 0 ? "row-even" : "row-odd";
  }
  updateDateRange() {
    this.searchText = "";
    this.disableSearch = false;
    this.disableDownloadBtn = false;
    this.openDateRangeComponent = !this.openDateRangeComponent;
    this.selectedSearchEntity = "NAME";
    this.searchPlaceholder = SEARCH_ENTITY_MAP[this.selectedSearchEntity];
  }
  onSearchClick() {
    this.disableSearch = true;
    this.disableDownloadBtn = true;
    this.openDateRangeComponent = false;
    this.selectedSearchEntity = "NAME";
    this.searchPlaceholder = SEARCH_ENTITY_MAP[this.selectedSearchEntity];
  }
  onSearchCloseBtn() {
    if (this.searchText) {
      this.searchText = null;
    } else {
      this.disableSearch = false;
      this.disableDownloadBtn = false;
      this.reset();
    }
  }

  reset() {
    this.selectedSearchEntity = "NAME";
    this.searchPlaceholder = SEARCH_ENTITY_MAP[this.selectedSearchEntity];
    if (this.searchText === null) {
      this.searchText = "";
      this.page = 0;
      this.currentPage = 0;
      this.getPartnerMandates();
    }
  }
  openMandate(mandateInfo: PaymentMandateData) {
    this.router.navigate(
      [`/paymentMandate/mandate/${mandateInfo.mandateReferenceId}`],
      { state: mandateInfo }
    );
  }

  onPageChange(pageEvent: PageEvent) {
    this.currentPage = pageEvent.pageIndex;
    this.page = pageEvent.pageIndex;
    if (this.openDateRangeComponent || this.disableSearch) {
      this.searchMandate(undefined, false);
    } else {
      this.getPartnerMandates();
    }
  }
}
