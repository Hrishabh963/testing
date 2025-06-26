import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import {
  BANK_VALIDATION_RETRIES,
  BANK_VALIDATION_RETRY_TIMEOUT,
} from "src/app/app.constants";
import { KCreditService } from "../../../kaleido-credit.service";
import { CustomerService } from "../../../services/customer/customer.service";
@Component({
  selector: "ig-loan-details-bank-validation",
  templateUrl: "./loan-details-bank-validation.component.html",
  styleUrls: ["./loan-details-bank-validation.component.scss"],
})
export class LoanDetailsBankValidation implements OnInit {
  @Input() modelData: any;
  bankDetail: any;
  bankDetailId: any;
  maxRetries: number;
  retry: number;
  status: string;
  customerSubscriptionId: any;
  messageTitle: string;
  messageDescription1: string;
  messageDescription2: string;
  bankValidationCode: string;
  errorMessage: string;
  bankValidationRetryTimeout: number;
  paymentMode: string;
  paymentModeRefCode: string;
  accountHolderNameList: Array<any>;
  resetCountbtn: boolean;
  constructor(
    public readonly activeModal: NgbActiveModal,
    private readonly kcreditService: KCreditService,
    private readonly customerService: CustomerService
  ) {}

  ngOnInit() {
    console.log(this.modelData);
    this.bankDetail = this.modelData.bankDetails;
    this.customerSubscriptionId = this.modelData.customerSubscriptionId;
    this.errorMessage = this.modelData.errorMsg;
    this.paymentMode = this.modelData.paymentMode;
    this.paymentModeRefCode = this.modelData.paymentModeRefCode;
    this.maxRetries = BANK_VALIDATION_RETRIES;
    this.resetCountbtn = false;
    this.bankValidationRetryTimeout = BANK_VALIDATION_RETRY_TIMEOUT;
    this.retry = 0;

    if (this.errorMessage != null && this.errorMessage != undefined) {
      this.setErrorMessage(this.errorMessage);
    } else if (
      this.bankDetail.accountVerificationDetailedStatus &&
      this.bankDetail.accountVerificationDetailedStatus !== "PENDING"
    ) {
      this.setMessage();
    } else {
      this.status = "InProgress";
      setTimeout(() => {
        this.getBankAccountVerficationStatus();
      }, this.bankValidationRetryTimeout);
    }
  }

  getBankAccountVerficationStatus() {
    this.kcreditService
      .getBankDetail(this.bankDetail.id, this.bankDetail.customerId)
      .subscribe(
        (value: any) => {
          this.bankDetail = value;
          console.log("The bank details");
          console.log(this.bankDetail);
          if (this.bankDetail?.providerResponseCode) {
            this.setMessage();
          } else if (this.retry < this.maxRetries) {
              this.retry++;
              setTimeout(() => {
                this.getBankAccountVerficationStatus();
              }, this.bankValidationRetryTimeout);
              this.bankValidationRetryTimeout += 3000;
            } else {
              this.status = "Pending";
              this.messageTitle =
                "Due to technical issues, We can't validate your account right now";
              this.messageDescription1 =
                "Please proceed, we will notify you in case of any issues";
            }
          },
        (error) => {
          let errMsg: string;
          errMsg = error.error;
          this.setErrorMessage(errMsg);
        }
      );
  }

  setErrorMessage(error) {
    if (error != null || error != "") {
      if (error === "zne10001") {
        this.messageTitle = "You have exhausted the number of tries available.";
        this.status = "Rejected";
        this.resetCountbtn = true;
      } else if (error === "zne10002") {
        this.messageTitle = "This account is closed or invalid";
        this.messageDescription1 = "Please retry with another account";
        this.status = "Rejected";
      } else if (error === "zne10003") {
        this.messageTitle =
          "This account is blocked/frozen. Please submit the bank details after 48 hours of last validation";
        this.status = "Rejected";
      } else {
        this.messageTitle = "Oops! Something went wrong";
        this.messageDescription1 = "Please retry";
        this.status = "Rejected";
      }
    }
  }

  finish() {
    if (
      this.status == "NameMismatch" &&
      this.bankDetail.accountHolderNameInBank
    ) {
      this.customerService.updateBankDetails(this.bankDetail).subscribe(
        () => {
          this.activeModal.close({ bankDetail: this.bankDetail });
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.activeModal.close({ bankDetail: this.bankDetail });
    }
  }

  resetAndRetry() {
    this.activeModal.close({
      bankDetail: this.bankDetail,
      forceRestCheck: true,
    });
  }

  setMessage() {
    if (
      this.bankDetail.accountVerificationDetailedStatus ===
      "SUCCESS_ACCOUNT_NAME_VALID"
    ) {
      this.status = "Success";
      this.messageTitle = "Account Validation Successfull ";
    } else if (
      this.bankDetail.accountVerificationDetailedStatus ===
      "SUCCESS_BUT_NAME_MISMATCH"
    ) {
      this.accountHolderNameList = [];
      this.accountHolderNameList.push(this.bankDetail.accountHolderName);
      this.accountHolderNameList.push(this.bankDetail.accountHolderNameInBank);
      this.status = "NameMismatch";
      this.messageTitle =
        "Account validated, but name as per bank records is " +
        this.bankDetail.accountHolderNameInBank;
      this.messageDescription2 =
        "It is advisable that you use the name as per bank records on your NACH form.Please select what name you would like to go with";
    } else if (
      this.bankDetail.accountVerificationDetailedStatus === "INVALID_ACCOUNT"
    ) {
      if (this.bankDetail.providerResponseCode === "ykR20009") {
        this.status = "Rejected";
        this.messageTitle = "This appears to be a NRE account";
        this.messageDescription1 = "Please retry with another account";
      } else if (this.bankDetail.providerResponseCode === "ykR20013") {
        this.status = "Rejected";
        this.messageTitle = "Your Bank Account does not support NACH mandates";
        this.messageDescription1 = "Please retry with another account.";
      } else {
        this.status = "Rejected";
        if (this.bankDetail.rejectedAccountCount == 3) {
          this.messageTitle = "This account is closed or invalid";
          this.messageDescription1 =
            "You have exhausted the number of tries available.Please contact us at our toll free number 18004197536 to get this resolved.";
        } else {
          this.messageTitle = "This account is closed or invalid";
          this.messageDescription1 = "Please retry with another account.";
        }
      }
    } else if (
      this.bankDetail.accountVerificationDetailedStatus === "BLOCKED"
    ) {
      this.status = "Rejected";
      this.messageTitle = "This account is blocked/frozen";
      this.messageDescription1 =
        "Please contact your bank to get this unblocked. You can retry with another account or get this account unblocked and try later.";
    } else if (
      this.bankDetail.accountVerificationDetailedStatus === "SERVICE_ERROR"
    ) {
      this.status = "Pending";
      this.messageTitle =
        "Due to technical issues, We can't validate your account right now";
      this.messageDescription1 =
        "Please proceed, we will notify you in case of any issues";
    }
  }

  close() {
    this.activeModal.close(this.bankDetail);
  }
}
