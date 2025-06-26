import { Component, OnInit, Input } from "@angular/core";
import { KcreditLoanDetailsModel } from "../../../loan/kcredit-loanDetails.model";
import { get } from "lodash";
import { ApplicationStatus } from "../../../loan/constant";
import { copyToClipboard } from "src/app/shared/util/kicredit.utils";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CustomToastMessageComponent } from "../../custom-toast-message/custom-toast-message.component";
@Component({
  selector: "app-loan-incomplete-reason",
  templateUrl: "./loan-incomplete-reason.component.html",
  styleUrls: ["./loan-incomplete-reason.component.scss"],
})
export class LoanIncompleteReasonComponent implements OnInit {
  @Input() loanDetails: KcreditLoanDetailsModel = undefined;
  title: string = "";
  reasons: string[] = [];

  constructor(
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.updateSectionTitle();
    this.updateReasons();
  }

  updateSectionTitle() {
    let applicationStatus = get(
      this.loanDetails,
      "loanApplicationDTO.applicationStatus",
      ""
    );
    if (
      [ApplicationStatus.retry, ApplicationStatus.agreementretry].includes(
        applicationStatus
      )
    ) {
      this.title = "Reasons for Retry";
    } else if (ApplicationStatus.reject) {
      this.title = "Reasons for Retry";
    } else {
      this.title = "Incomplete Reasons";
    }
  }
  updateReasons() {
    let invalidFields =
      get(this.loanDetails, "loanApplicationDTO.remarks", "") || "";
    this.reasons = invalidFields
      .split(",")
      .map((reason) => reason.trim())
      .filter(Boolean);
  }
  copy() {
    const textToCopy = `
Application id: ${
      get(this.loanDetails, "loanApplicationDTO.applicationNumber") || ""
    }
Name: ${get(this.loanDetails, "customerDTO.name") || ""}
Mobile number: ${get(this.loanDetails, "customerDTO.primaryMobileNumber") || ""}
Customer id: ${
      get(this.loanDetails, "loanApplicationDTO.partnerCustomerId") || ""
    }
Loan amount: ${get(this.loanDetails, "loanApplicationDTO.loanAmount") || ""}

Reason for incomplete
${this.reasons.join("\n")}
`;

    if (copyToClipboard(textToCopy)) {
      this.dialog.open(CustomToastMessageComponent, {
        hasBackdrop: false,
        width: "25vw",
        height: "5vh",
        position: { bottom: "8vh" },
        data: { message: "Reasons copied on the clipboard" },
      });
    } else {
      this.snackBar.open("Copy Failed");
    }
  }
}
