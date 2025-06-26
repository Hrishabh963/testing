import { Component, Input, OnInit } from "@angular/core";
import { Customer } from "../../../models/customer/customer.model";
import { KcreditLoanService } from "../../kcredit-loan.service";
import { KCreditLoanApplication } from "../../../report/kcredit-loan-application.model";
import { KycDetailsForLoan } from "../../../models/kyc-details.model";
import { KycVerificationService } from "../../../services/kyc-verification.service";

@Component({
  selector: "jhi-aadhaar-idfy",
  templateUrl: "./aadhaar-idfy.component.html",
  styleUrls: ["../../kcredit-loan.css", "./aadhaar-idfy.component.scss"],
})
export class AadhaarIdfyComponent implements OnInit {
  @Input() customer: Customer;
  @Input() loanApplicationDTO: KCreditLoanApplication;
  @Input() isPoaPoi: boolean = false;
  @Input() customerType: string = null;
  @Input() loanId: number = null;
  @Input() doc: KycDetailsForLoan = {};
  @Input() entityId: number = null;
  @Input() isPan: boolean = false;
  verificationStatus: string = "";

  constructor(
    private readonly kcreditLoanService: KcreditLoanService,
    private readonly kycVerificationService: KycVerificationService
  ) {}

  ngOnInit(): void {
    this.extractStatus();
  }

  extractStatus(): void {
    if (this.isPan) {
      this.verificationStatus =
        this.loanApplicationDTO?.panVerificationStatus ?? null;
    } else if (this.isPoaPoi) {
      this.verificationStatus = this.doc?.idNoVerificationStatus ?? null;
    } else {
      this.verificationStatus =
        this.loanApplicationDTO?.aadhaarVerificationStatus ?? null;
    }
  }

  verifyAadhaar() {
    if (this.isPan) {
      this.kcreditLoanService.verifyPan(this.loanApplicationDTO).subscribe(
        (res) => {
          this.loanApplicationDTO = res;
          this.extractStatus();
        },
        (error) => this.onSaveError(error)
      );
    } else if (this.isPoaPoi) {
      const requestPayload = {
        loanApplicationId: this.loanId,
        documentType: this.doc?.documentType,
        documentIdNo: this.doc?.idNo ?? "",
        entityId: this.entityId,
        customerType: this.customerType,
        purpose: this.doc?.purpose,
      };
      this.kycVerificationService.verifyKyc(requestPayload).subscribe(()=> {
        location.reload();
      },(error)=> this.onSaveError(error));
    } else {
      this.kcreditLoanService.verifyAadhaar(this.loanApplicationDTO).subscribe(
        (res) => this.successfulVerification(res),
        (res) => this.onSaveError(res)
      );
    }
  }

  successfulVerification(res) {
    this.loanApplicationDTO = res;
    this.extractStatus();
    if (this.loanApplicationDTO.aadhaarVerificationStatus === "IN_PROGRESS") {
      this.kcreditLoanService
        .checkAadhaarVerificationStatus(this.loanApplicationDTO)
        .subscribe(
          (res) =>
            this.successfulVerificationCheckForInProgressAadhaarIdfy(res),
          (res) => this.onSaveError(res)
        );
    }
  }

  successfulVerificationCheckForInProgressAadhaarIdfy(res) {
    this.loanApplicationDTO = res;
    this.extractStatus();
  }

  private onSaveError(error) {
    try {
      error = error.json();
    } catch (exception) {
      error.message = error.text();
    }
  }
}
