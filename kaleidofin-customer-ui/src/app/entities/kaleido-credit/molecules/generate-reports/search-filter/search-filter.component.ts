import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { GenerateReportsService } from "../../../services/generate-reports.service";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { AssociateLenderService } from "../../../services/associate-lender/associate-lender.service";

@Component({
  selector: "app-search-filter",
  templateUrl: "./search-filter.component.html",
  styleUrls: ["./search-filter.component.scss"],
})
export class SearchFilterComponent implements OnInit {
  maxDate = new Date();
  userName: string = "";
  startDate: Date | null = null;
  endDate: Date | null = null;
  dateErrorMessage: string = "";
  isDCBMFI: boolean = false;

  @Output() loadKiCreditReport: EventEmitter<any>;

  constructor(
    public readonly reportService: GenerateReportsService,
    private readonly associatelenderService: AssociateLenderService
  ) {
    this.loadKiCreditReport = new EventEmitter();
  }

  ngOnInit(): void {
    this.isDCBMFI =
      this.associatelenderService.getLenderCode().toUpperCase() === "DCBMFI";
  }

  search() {
    // Logic to perform search with selected filters
    let searchParams = {
      selectedReport: this.reportService.selectedReport,
      selectedPartners: this.reportService.selectedPartners,
      selectedLoanType: this.reportService.selectedLoanType,
      searchValue: this.userName,
      fromDate: this.startDate,
      toDate: this.endDate,
    };
    this.reportService.setSearchParams(searchParams);
    this.loadKiCreditReport.emit();
  }
  onDateChange(event: MatDatepickerInputEvent<Date>, dateKey: string = "") {
    if (this.startDate && this.endDate && this.endDate < this.startDate) {
      this.dateErrorMessage = "End Date cannot be before Start Date.";
    } else {
      this.dateErrorMessage = "";
    }
    this[dateKey] = event.value;
  }
  cancel() {
    this.startDate = null;
    this.endDate = null;
    this.reportService.resetStates();
  }
  clearUserName() {
    this.userName = "";
  }
}
