import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { get } from "lodash";
import { determineStatus, getProperty } from "src/app/utils/app.utils";
import { ApplicationStatus } from "../../loan/constant";
import { LoanApplicationSearchFilterService } from "../../services/loan-application-search-filter.service";

@Component({
  selector: "app-loan-application-table",
  templateUrl: "./loan-application-table.component.html",
  styleUrls: ["./loan-application-table.component.scss"],
})
export class LoanApplicationTableComponent implements OnChanges {
  @Input() tableData: Array<any> = [];
  @Input() loanDetails: Array<any> = [];

  @Input() queryCount: number = 0;
  @Input() page: number = 0;
  @Input() previousPage: number = 0;
  @Input() checkAll: boolean = false;

  @Input() itemsPerPage: number = 0;
  @Input() totalItems: number = 0;
  @Output() loadPage: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateFilter = new EventEmitter<any>();
  localLoanDetails: any = {};

  selectAllFormControl: FormControl = new FormControl();

  constructor(
    private readonly loanFilterService: LoanApplicationSearchFilterService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.checkAndUpdateChanges("tableData", changes);
    this.checkAndUpdateChanges("loanDetails", changes);
    this.checkAndUpdateChanges("queryCount", changes);
    this.checkAndUpdateChanges("page", changes);
    this.checkAndUpdateChanges("itemsPerPage", changes);
  }

  checkAndUpdateChanges(key: string = "", changes: SimpleChanges = {}) {
    if (
      getProperty(changes, key + ".currentValue", "") !==
      getProperty(changes, key + ".previousValue", "")
    ) {
      this[key] = getProperty(changes, key + ".currentValue", "");
      this.localLoanDetails = this.loanDetails;
      if (key === "loanDetails") {
        let mapper = null;
        this.tableData.forEach((column) => {
          if (column.type === "applicationStatus") {
            mapper = column.useViewMapper ? column.viewMapper : null;
          }
        });
        this.localLoanDetails.forEach((data) => {
          data.applicationStatus =
            mapper !== null
              ? mapper[this.getReviewStatus(data)]
              : determineStatus(data.applicationStatus, data.workflow, false);

          data.hasResentIndicator = this.checkResentIndicator(data);
        });
      }
    }
  }

  checkResentIndicator(data: any) {
    try {
      const additionalData = JSON.parse(
        getProperty(data, "additionalData", "{}")
      );
      return getProperty(additionalData, "resentForBooking", false);
    } catch (e) {
      return false;
    }
  }

  onLoadPage(page) {
    if (page !== this.previousPage) {
      this.loadPage.emit(page);
    }
  }

  handleAll(event: Event, options: Array<any>): void {
    event.stopPropagation();
    const optionValues = options.map((option) => option?.value);
    this.selectAllFormControl.setValue(optionValues);
  }

  onFilterChange(event: any = {}, filterType: string = "") {
    const filter = this.loanFilterService.FILTERS[filterType];
    if (!filter) {
      return;
    }
    const key = getProperty(filter, "propertyKey", {});
    const value = getProperty(event, "value", "");

    this.updateFilter.emit([{ type: key, value }]);
  }
  getReviewStatus(loanApplication: any = {}): string {
    const reviewStatus: string = getProperty(
      loanApplication,
      "applicationStatus",
      ""
    );
    const rejectPhase: string = getProperty(
      loanApplication,
      " rejectPhase",
      ""
    );

    if (reviewStatus === "conditionalapprove") {
      return "approved";
    } else if (
      reviewStatus === ApplicationStatus.reject ||
      reviewStatus === ApplicationStatus.retry
    ) {
      if (rejectPhase !== null) {
        switch (rejectPhase) {
          case ApplicationStatus.disbursed:
            return "rejected post disbursal";
          case ApplicationStatus.pendingdisbursal:
            return "rejected pre disbursal";
          case ApplicationStatus.booked:
            return "rejected post booking";
          case ApplicationStatus.pendingbooking:
            return "rejected pre booking";
          case ApplicationStatus.pendingagreement:
            return "rejected pre agreement";
          default:
            return "rejected";
        }
      }
    }
    return reviewStatus;
  }

  disableCheck(column: any = {}, rowData: any = {}): boolean {
    const checkForDisable = get(column, "checkForDisable", false);
    return checkForDisable ? column?.checkDisable(rowData) : false;
  }
}
