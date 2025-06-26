import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { isEmpty } from "lodash";
import { MatSelectOption } from "src/app/entities/kaleido-credit/loan/constant";
import { getProperty } from "src/app/utils/app.utils";
import { PaymentMandateService } from "../../payment-mandate.service";
import { ConfirmOtpComponent } from "./confirm-otp/confirm-otp.component";

@Component({
  selector: "app-close-mandate",
  templateUrl: "./close-mandate.component.html",
  styleUrls: ["../../payment-mandate.scss", "./close-mandate.component.scss"],
})
export class CloseMandateComponent {
  closeDialog: boolean = false;
  enableReports: boolean = false;
  selectedReason: string = "";
  remarks: string = "";
  mandateInfo: any = null;
  reasons: Array<MatSelectOption> = [
    {
      viewValue: "Loan closed due to Pre payment",
      value: "Loan closed due to Pre payment",
    },
    { viewValue: "Declared as NPA", value: "Declared as NPA" },
    {
      viewValue: "Loan transferred to another account",
      value: "Loan transferred to another account",
    },
    { viewValue: "Others", value: "Others" },
  ];
  constructor(
    public readonly dialogRef: MatDialogRef<CloseMandateComponent>,
    public readonly mandateStatusDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public readonly data: any,
    private readonly paymentMandateService: PaymentMandateService,
    private readonly snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.mandateInfo = getProperty(this.data, "mandateInfo", null);
  }
  confirmWithOtp() {
    this.paymentMandateService
      .closeMandate(this.mandateInfo, this.selectedReason, this.remarks)
      .toPromise()
      .then((response) => {
        const requestId = getProperty(response, "requestId", null);
        this.proceed(requestId);
      })
      .catch((error) => {
        console.error(error);
        this.snackbar.open(
          getProperty(
            error,
            "error.message",
            "Error while closing the Mandate"
          ),
          "",
          { duration: 3000 }
        );
      });
  }

  proceed(requestId: string = ""): void {
    const dialogRef = this.mandateStatusDialog.open(ConfirmOtpComponent, {
      width: "40vw",
      data: {
        requestId,
        mobileNumber: getProperty(this.mandateInfo, "mobileNo", null),
        mandateId: getProperty(this.mandateInfo, "mandateReferenceId", null),
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log("The dialog was closed");
    });
    this.cancel();
  }
  cancel(): void {
    this.dialogRef.close();
  }
  disableConfirmWithOtp() {
    if (this.selectedReason === "Others") {
      return isEmpty(this.remarks);
    }
    return isEmpty(this.selectedReason);
  }
}
