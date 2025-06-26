import { Component, Input, OnInit } from "@angular/core";
import { FraudCheckService } from "../../services/fraud-check.service";
import { getProperty } from "src/app/utils/app.utils";
import { IMAGE_PATH } from "src/app/shared/constants/imagePath.constants";
@Component({
  selector: "app-fraud-check",
  templateUrl: "./fraud-check.component.html",
  styleUrls: [
    "./fraud-check.component.scss",
    "../../molecules/review-section-fields.scss",
  ],
})
export class FraudCheckComponent implements OnInit {
  @Input() partnerCustomerId: any = "";
  @Input() partnerLoanId: any = "";
  @Input() loanApplicationId: any = "";

  fraudCheckData: any = {};
  scores: any = {};
  imagePaths: any = {};

  constructor(private readonly fraudCheckService: FraudCheckService) {}

  ngOnInit(): void {
    this.fraudCheckService
      .initiateFraudCheck(this.partnerCustomerId, this.partnerLoanId)
      .subscribe(
        (response) => {
          this.fraudCheckData = {...response};
          this.scores = getProperty(response, "scores", {});
        },
        (error) => {
          console.error(error);
        }
      );
    this.imagePaths = {...IMAGE_PATH};
  }

  showInitiate(): boolean {
    const status: string = getProperty(this.fraudCheckData, "status", "failed");
    return status.toLowerCase() === "failed";
  }

  showRetry(): boolean {
    const status: string = getProperty(this.fraudCheckData, "status", "failed");
    return status.toLowerCase() === "in progress";
  }

  initiateCheck(): void {
    this.fraudCheckService
      .initiateFraudCheck(this.partnerCustomerId, this.partnerLoanId)
      .subscribe(
        (response) => {
          this.fraudCheckData = {...response};
          this.scores = getProperty(response, "scores", {});
        },
        (error) => console.error(error)
      );
  }

  fetchDecisionIcon() {
    const decision: string = getProperty(this.fraudCheckData, "decision", "");
    if (decision.toLowerCase() === "approved") {
      return this.imagePaths.SUCCESS_CHECK_CIRCLE_OUTLINED;
    } else if (decision.toLowerCase() === "refer") {
      return this.imagePaths.YELLOW_INFO_ICON;
    } else {
      return this.imagePaths.CLOSE_CIRCLE;
    }
  }

  fetchDecision(): string {
    const decision: string = getProperty(this.fraudCheckData, "decision", "");
    if (decision.toLowerCase() !== "refer") {
      return decision.toLowerCase();
    }
    return "";
  }

  verifyFraudCheck(): void {
    let verification: string = getProperty(
      this.fraudCheckData,
      "verification",
      ""
    );
    if (
      verification.toLowerCase() === "" ||
      verification.toLowerCase() === "verified"
    ) {
      return;
    }
    this.fraudCheckService.verifyCheck(this.loanApplicationId).subscribe(
      () => {
        this.fraudCheckData.verification = "Verified";
      },
      (error) => console.error(error)
    );
  }

  openFraudCheckReport(): void {
    const serializedData = window.btoa(
      encodeURIComponent(JSON.stringify(this.fraudCheckData))
    );
    const queryParams = new URLSearchParams();
    queryParams.set("data", serializedData);
    const currentUrl = new URL(window.location.href);
    const targetUrl = new URL(`${currentUrl.href}/fraud-check-report?${queryParams.toString()}`);
    if (targetUrl.origin === currentUrl.origin) {
      window.open(targetUrl.toString(), "_blank");
    } else {
      console.error("Attempted open redirect detected and prevented.");
    }
  }
  
}
