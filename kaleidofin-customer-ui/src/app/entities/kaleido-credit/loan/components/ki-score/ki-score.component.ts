import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { differenceInDays } from "date-fns";
import { get, isEmpty } from "lodash";
import { getProperty } from "src/app/utils/app.utils";
import { KiScoreAlertsComponent } from "../../../molecules/ki-score-alerts/ki-score-alerts.component";
import {
  CB_DATA_EXPIRED_ALERT,
  CB_DATA_NOT_AVAILABLE,
} from "../../../report/ki-credit-popup-constants";
import { KiScoreService } from "../../../services/ki-score.service";
import { KcreditLoanDetailsModel } from "../../kcredit-loanDetails.model";
@Component({
  selector: "jhi-ki-score",
  templateUrl: "./ki-score.component.html",
  styleUrls: ["../../kcredit-loan.css", "./ki-score.scss"],
})
export class KiScoreComponent implements OnInit {
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() disableEdit: boolean;
  loanId: number = null;
  eligibilityStatus: string = null;
  VIEW_MAPPER = {
    false: "Fail",
    true: "Pass",
    FAIL: "Fail",
    PASS: "Pass",
    ERROR: "Error",
  };

  eligibilityResults: Array<any> = [];
  kiScoreEligibilityResult: any = { comment: "", result: null };
  hideKiScoreReport: boolean = true;
  kiScoreReport: any = {};
  disableKiScoreRetryEligibility: boolean = true;
  constructor(
    private readonly kiScoreService: KiScoreService,
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loanId = get(this.loanDetails, "loanApplicationDTO.id", null);
    this.loadKiScoreReport(this.loanId);
  }

  loadKiScoreReport(loanId: number = null) {
    if (!loanId) {
      return;
    }
    this.kiScoreService.fetchKiScoreReport(loanId).subscribe(
      (report) => {
        this.kiScoreReport = report;
        this.calculateDaysAgo(this.kiScoreReport);
        if (!isEmpty(report)) {
          this.hideKiScoreReport = ["ntc", ""].includes(
            (get(report, "customerType") || "").toLowerCase()
          );
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  updateEligibilityRules(eligibilityRules: Array<any> = []) {
    this.eligibilityResults = eligibilityRules.filter(
      (rule) => rule?.eligibilityRule !== "KISCORE"
    );
    if (this.eligibilityResults?.length > 0) {
      this.eligibilityStatus = this.eligibilityResults.some(
        (rule) => rule?.result === "FAIL"
      )
        ? "FAIL"
        : "PASS";
    }
  }

  async retryKiScore() {
    let cbAnalysis = getProperty(this.kiScoreReport, "cbAnalysis", false);
    let isCbDataExpired = getProperty(
      this.kiScoreReport,
      "isCbDataExpired",
      false
    );
    let isExternalCbDataAvailable = getProperty(
      this.kiScoreReport,
      "isExternalCbDataAvailable",
      false
    );
    let message = "";
    if (cbAnalysis && isCbDataExpired) {
      message = CB_DATA_EXPIRED_ALERT;
    } else if (cbAnalysis && !isExternalCbDataAvailable) {
      message = CB_DATA_NOT_AVAILABLE;
    }
    let loanId = get(this.loanDetails, "loanApplicationDTO.id", null);
    if (message) {
      const dialogRef = this.dialog.open(KiScoreAlertsComponent, {
        width: "40vw",
        data: {
          message,
          loanId,
        },
      });
      dialogRef.afterClosed().subscribe((response: any = null) => {
        this.kiScoreReport = response?.errorMessage
          ? this.kiScoreReport
          : response || this.kiScoreReport;
        this.calculateDaysAgo(this.kiScoreReport);

      });
    } else {
      const response: any = await this.kiScoreService.retryKiScore({ loanId });
      this.kiScoreReport = response?.errorMessage
        ? this.kiScoreReport
        : response || this.kiScoreReport;
        this.calculateDaysAgo(this.kiScoreReport);
    }
  }
  onErrorHandler(error: any = {}, type: string = "Eligibility") {
    this.snackbar.open(
      getProperty(error, "error.message", `Error while Retrying ${type}`),
      "",
      { duration: 4000 }
    );
    console.error(error);
  }

  openKiScoreReport() {
    let loanId = get(
      this.loanDetails,
      "loanApplicationDTO.applicationNumber",
      null
    );
    let partnerApplicationId = get(
      this.loanDetails,
      "loanApplicationDTO.partnerLoanId",
      null
    );
    let partnerCustomerId = get(
      this.loanDetails,
      "loanApplicationDTO.partnerCustomerId",
      null
    );
    const serializedData = window.btoa(
      encodeURIComponent(
        JSON.stringify({
          kiScoreReport: this.kiScoreReport,
          loanId: loanId,
          partnerLoanId: partnerApplicationId,
          partnerCustomerId: partnerCustomerId,
        })
      )
    );
    const queryParams = new URLSearchParams();
    queryParams.set("data", serializedData);
    queryParams.set("loanId", loanId);
    const currentUrl = new URL(window.location.href);
    const targetUrl = new URL(
      `${currentUrl.href}/ki-score-report?${queryParams.toString()}`
    );

    if (targetUrl.origin === currentUrl.origin) {
      window.open(targetUrl.toString(), "_blank");
    } else {
      console.error("Attempted open redirect detected and prevented.");
    }
  }
  calculateDaysAgo(kiscoreReport: any = {}) {
    this.formatDates("cbFetchedDate", "formattedCbDate", kiscoreReport);
    this.formatDates("kiscoredDate", "formattedKiScoreDate", kiscoreReport);
  }
  formatDates(
    inputKey: string = "",
    targetkey: string = "",
    instance: any = this.kiScoreReport
  ) {
    let days = differenceInDays(new Date(), instance[inputKey]);
    instance[targetkey] = days;
    if (days > 15) {
      this.disableKiScoreRetryEligibility = false;
      instance[`${targetkey}Class`] = "expired";
    }
  }
}
