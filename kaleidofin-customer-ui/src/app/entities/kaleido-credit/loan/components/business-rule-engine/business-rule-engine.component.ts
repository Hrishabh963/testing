import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { get } from "lodash";
import { AUTHORITES } from "../../../constants/authorization.constants";
import { LoanReviewService } from "../../../report/loan-review.service";
import { AuthorizationService } from "../../../services/authorization.service";
import { BusinessRuleEngineService } from "../../../services/business-rule-engine/business-rule-engine.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-business-rule-engine",
  templateUrl: "./business-rule-engine.component.html",
  styleUrls: ["./business-rule-engine.component.scss"],
})
export class BusinessRuleEngineComponent implements OnInit, OnDestroy {
  @Input() partnerApplicationId: any = undefined;
  @Input() loanApplicationId: any = undefined;
  @Input() partnerCustomerId: any = undefined;
  @Input() breNeeded: boolean = false;
  breData: any = {};
  breAction: string = "";
  enableViewReport: boolean = false;
  authority = { viewReport: false };
  breSubscription: Subscription = new Subscription();
  constructor(
    private readonly breService: BusinessRuleEngineService,
    private readonly authorizationService: AuthorizationService,
    private readonly loanService: LoanReviewService
  ) {}

  ngOnDestroy(): void {
    this.breSubscription.unsubscribe();
  }

  async ngOnInit() {
    this.authority.viewReport = this.authorizationService.hasAuthorityByStage(
      AUTHORITES.UNDERWRITINGSCREEN_VIEWBREREPORT,
      this.loanService.getLoanStatus()
    );
    if (!this.breNeeded) return;
    let response: any = {};
    try {
      response = await this.breService
        .fetchBreCondition(this.partnerCustomerId, this.partnerApplicationId)
        .toPromise();
      this.breService.setBreResponse(response);
      this.subscribeReport();
    } catch (e) {
      console.error(e);
      this.breData = { decision: "FAILED" };
      this.breAction = get(e, "error.message", "FAILED");
      this.enableViewReport = false;
    }
  }

  subscribeReport(): void {
    this.breSubscription = this.breService.getBreResponse().subscribe(
      (response) => {
        this.breData = response;
        this.breAction = get(this.breData, "overallDecision", "FAILED") || "";
        this.enableViewReport = !["PENDING", "FAILED"].includes(this.breAction);
      },
      (error) => {
        console.error(error);
        this.breData = { decision: "FAILED" };
        this.breAction = get(error, "error.message", "FAILED");
        this.enableViewReport = false;
      }
    );
  }

  openBreReport() {
    const applicantName: string = this.loanService.getApplicantName();
    this.breData = {
      ...this.breData,
      applicantName: applicantName,
      loanId: this.loanApplicationId,
      partnerLoanId: this.partnerApplicationId,
      partnerCustomerId: this.partnerCustomerId,
    };

    const validateAndSanitize = (input: string): string => {
      return encodeURIComponent(input);
    };

    const partnerApplicationId = validateAndSanitize(this.partnerApplicationId);
    const partnerCustomerId = validateAndSanitize(this.partnerCustomerId);
    const loanApplicationId = validateAndSanitize(this.loanApplicationId);

    const serializedData = window.btoa(
      encodeURIComponent(JSON.stringify(this.breData))
    );
    const queryParams = new URLSearchParams();
    queryParams.set("partnerLoanId", partnerApplicationId);
    queryParams.set("partnerCustomerId", partnerCustomerId);
    queryParams.set("loanId", loanApplicationId);
    queryParams.set("data", serializedData);

    const currentUrl = new URL(window.location.href);
    const targetUrl = new URL(
      `${currentUrl.href}/bre-report?${queryParams.toString()}`
    );

    if (targetUrl.origin === currentUrl.origin) {
      window.open(targetUrl.toString(), "_blank");
    } else {
      console.error("Attempted open redirect detected and prevented.");
    }
  }
}
