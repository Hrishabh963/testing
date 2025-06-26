import { Component, Input, OnInit } from "@angular/core";
import { KcreditLoanDetailsModel } from "../../loan/kcredit-loanDetails.model";
import { KcreditLoanService } from "../../loan/kcredit-loan.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { getProperty } from "src/app/utils/app.utils";
import { ApplicationStatus } from "../../loan/constant";
import { AuthorizationService } from "../../services/authorization.service";
import { get } from "lodash";

@Component({
  selector: "app-eligibility-rules",
  templateUrl: "./eligibility-rules.component.html",
  styleUrls: ["./eligibility-rules.component.scss", "./../../loan/kcredit-loan.css"],
})
export class EligibilityRulesComponent implements OnInit {
  @Input() loanDetails: KcreditLoanDetailsModel = {};
  eligibilityResults: Array<any> = [];
  eligibilityStatus: string = null;
  readonly VIEW_MAPPER = {
    false: "Fail",
    true: "Pass",
    FAIL: "Fail",
    PASS: "Pass",
    ERROR: "Error",
  };

  disableKiScoreRetryEligibility: boolean = false;

  constructor(
    private readonly kcreditLoanService: KcreditLoanService,
    private readonly snackbar: MatSnackBar,
    private readonly authorityService: AuthorizationService
  ) {}

  ngOnInit(): void {
    const results: Array<any> = JSON.parse(
      this.loanDetails?.loanApplicationDTO?.eligibilityResult ?? "[]"
    );
    this.updateEligibilityRules(results);
    this.disableKiScoreRetryEligibility = this.disableRetryEligibility();
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

  retryEligibilityRule(): void {
    this.kcreditLoanService
      .eligibilityCheck(this.loanDetails.loanApplicationDTO.id)
      .subscribe(
        (eligibilityRules: Array<any>) => {
          this.updateEligibilityRules(eligibilityRules);
        },
        (error) => {
          this.snackbar.open(
            getProperty(error, "error.message", `Error while Retrying Eligibility`),
            "",
            { duration: 4000 }
          );
          console.error(error);
        }
      );
  }

  disableRetryEligibility() {
    return (
      [
        ApplicationStatus.retry,
        ApplicationStatus.pendingdisbursal,
        ApplicationStatus.disbursed,
      ].includes(
        get(this.loanDetails, "loanApplicationDTO.applicationStatus", "")
      ) || !this.authorityService.validateEditAccess()
    );
  }

}
