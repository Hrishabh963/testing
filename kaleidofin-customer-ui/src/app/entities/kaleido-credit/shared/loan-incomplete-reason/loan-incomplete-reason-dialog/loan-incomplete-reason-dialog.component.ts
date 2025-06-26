import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { get } from "lodash";
import { copyToClipboard } from "src/app/shared/util/kicredit.utils";
import { CustomToastMessageComponent } from "../../custom-toast-message/custom-toast-message.component";
import { AuthorizationService } from "../../../services/authorization.service";
import { AUTHORITES } from "../../../constants/authorization.constants";

@Component({
  selector: "app-loan-incomplete-reason-dialog",
  templateUrl: "./loan-incomplete-reason-dialog.component.html",
  styleUrls: ["./loan-incomplete-reason-dialog.component.scss"],
})
export class LoanIncompleteReasonDialogComponent implements OnInit {
  incompleteReasons: string[] = [];
  missingRequiredDocuments: string[] = [];
  application: any = undefined;

  authority = {
    copy: false,
  };
  constructor(
    public readonly dialogRef: MatDialogRef<LoanIncompleteReasonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly dialogData: any,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly authorizationService:AuthorizationService
  ) {}

  ngOnInit(): void {
    this.authority.copy = this.authorizationService.hasAuthority(AUTHORITES.LOANENTRY_COPYREASONSINCOMPLETE);
    this.application = get(this.dialogData, "application", "") || "";
    let reasons: string = get(this.dialogData, "incompleteReasons", "") || "";
    let missingRequiredDocuments: string =
      get(this.dialogData, "missingRequiredDocuments", "") || "";
    this.incompleteReasons = this.getTrimmedReasons(reasons);
    this.missingRequiredDocuments = this.getTrimmedReasons(
      missingRequiredDocuments
    );

  }

  cancel(): void {
    this.dialogRef.close();
  }
  copy() {
    let textToCopy = `
Application id: ${this.application.applicationNumber}
Name: ${this.application.customerName}
Mobile number: ${this.application.secondaryMobileNumber}
Customer id: ${this.application.partnerCustomerId}
Loan amount: ${this.application.loanAmount}

Reason for incomplete
`;
    if (get(this.incompleteReasons, "length")) {
      textToCopy += `Invalid Fields:
${this.incompleteReasons.join("\n")}
`;
    }

    if (get(this.missingRequiredDocuments, "length")) {
      textToCopy += `Missing Required Documents:
${this.missingRequiredDocuments.join("\n")}
`;
    }

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

  getTrimmedReasons(reasons: string = "") {
    return reasons
      .split(",")
      .map((reason) => reason.trim())
      .filter(Boolean);
  }
}
