import { Component } from "@angular/core";
import { MatSelectOption } from "src/app/entities/kaleido-credit/loan/constant";
import { formatDate } from "src/app/shared/util/kicredit.utils";
import { getProperty } from "src/app/utils/app.utils";
import { DURATION } from "../../payment-mandate.constants";
import { PaymentMandateService } from "../../payment-mandate.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-download-search-filter",
  templateUrl: "./download-search-filter.component.html",
  styleUrls: [
    "../../payment-mandate.scss",
    "./download-search-filter.component.scss",
  ],
})
export class DownloadSearchFilterComponent {
  reportTypes: MatSelectOption[] = [
    { value: "SBM_MANDATE_DETAILS", viewValue: "SBM SI Mandate Details" },
    { value: "MANDATE_TRANSACTIONS", viewValue: "EMI Collection" },
  ];
  statuses: MatSelectOption[] = [];

  durationList = DURATION;

  selectedReportType: any = null;
  selectedStatus: any = {};
  selectedDuration: string;
  enableDateRange: boolean = false;

  fromDate: Date = null;
  toDate: Date = null;
  minDate: Date;
  maxDate: Date;

  constructor(
    private readonly paymentMandateService: PaymentMandateService,
    private readonly snackbar: MatSnackBar
  ) {
    this.minDate = new Date();
    this.minDate.setFullYear(this.minDate.getFullYear() - 3);
    this.maxDate = new Date();
  }
  onDurationChange() {
    this.fromDate = null;
    this.toDate = null;
    this.enableDateRange = this.selectedDuration === "dateRange";
  }
  onReportTypeChange(event: any = {}) {
    let value = getProperty(event, "value", "");
    this.selectedReportType = value;
    switch (value) {
      case "SBM_MANDATE_DETAILS":
        this.statuses = [
          { value: "ACTIVE", viewValue: "Active" },
          { value: "CLOSED", viewValue: "Closed" },
        ];
        break;
      case "MANDATE_TRANSACTIONS":
        this.statuses = [
          { value: "SUCCESS", viewValue: "Success" },
          { value: "FAIL", viewValue: "Failed" },
        ];
        break;
      default:
        break;
    }
  }

  generateMandateReport() {
    let payload: any = {
      status: [this.selectedStatus],
      reportType: this.selectedReportType,
      duration: this.selectedDuration,
    };
    if (this.selectedDuration === "dateRange") {
      payload = {
        ...payload,
        startDate: formatDate(this.fromDate),
        endDate: formatDate(this.toDate),
      };
    }

    this.paymentMandateService.generateMandateReports(payload).subscribe(
      () => {
        this.snackbar.open(
          "Report generation request successfully received.",
          "",
          { duration: 3000 }
        );
      },
      () => {
        this.snackbar.open("Error processing report generation request.", "", {
          duration: 3000,
        });
      }
    );
  }
}
