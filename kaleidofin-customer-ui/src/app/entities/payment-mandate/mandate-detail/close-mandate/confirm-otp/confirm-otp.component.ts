import { MAT_DIALOG_DATA, MatDialog ,MatDialogRef } from "@angular/material/dialog";
import { Component, Inject, OnInit } from "@angular/core";
import { CloseMandateStatusComponent } from "../close-mandate-status/close-mandate-status.component";
import { getProperty } from "src/app/utils/app.utils";
import { PaymentMandateService } from "../../../payment-mandate.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-confirm-otp",
  templateUrl: "./confirm-otp.component.html",
  styleUrls: [
    "../close-mandate.component.scss",
    "./confirm-otp.component.scss",
  ],
})
export class ConfirmOtpComponent implements OnInit {
  closeDialog: boolean = false;

  durationInSeconds: number = 60;
  minutes: string = "00";
  seconds: string = "00";
  isExpired: boolean = false;
  requestId: string = "";
  mobileNumber: string = "";
  otp: string = "";
  otpFailureMsg: string = "";

  private timerId: any;

  constructor(
    public readonly dialogRef: MatDialogRef<ConfirmOtpComponent>,
    public readonly mandateStatusDialog: MatDialog,
    private readonly paymentMandateService: PaymentMandateService,
    private readonly snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public readonly data: any
  ) {}

  ngOnInit() {
    this.requestId = getProperty(this.data, "requestId", null);
    this.mobileNumber = getProperty(this.data, "mobileNumber", null);
    this.startTimer();
  }

  proceed() {
    this.otpFailureMsg = "";
    this.paymentMandateService.validateOtp(this.requestId, this.otp).subscribe(
      (otpResponse) => {
        const otpError = getProperty(otpResponse, "message", "");
        if (otpError) {
          this.otp = "";
          this.otpFailureMsg = otpError;
        } else {
          const isMandateClosed = getProperty(
            otpResponse,
            "deletionSuccessful",
            false
          );
          this.showResults(isMandateClosed);
        }
      },
      (error) => console.error(error)
    );
  }

  showResults(success: boolean = false): void {
    const dialogRef = this.mandateStatusDialog.open(
      CloseMandateStatusComponent,
      {
        width: "30vw",
        data: {
          success,
          mandateId: getProperty(this.data, "mandateId", ""),
          route: "/paymentMandate",
        },
      }
    );
    dialogRef.afterClosed().subscribe(() => {
      console.log("The dialog was closed");
    });
    this.cancel();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.otpFailureMsg = "";
    this.stopTimer();
  }

  private startTimer() {
    let duration = this.durationInSeconds;
    this.updateTimer(duration);
    this.timerId = setInterval(() => {
      duration--;
      this.updateTimer(duration);
      if (duration <= 0) {
        this.stopTimer();
        this.isExpired = true;
      }
    }, 1000);
  }

  private stopTimer() {
    clearInterval(this.timerId);
  }

  resendOtp() {
    this.otp = "";
    this.otpFailureMsg = "";
    this.paymentMandateService.resendOtp(this.requestId).subscribe(
      () => {
        this.restartTimer();
        this.snackbar.open("OTP Sent Successfully", "", { duration: 4000 });
      },
      (error) => {
        console.error(error);
        this.snackbar.open("Error while sending OTP", "", { duration: 4000 });
      }
    );
  }

  restartTimer() {
    this.isExpired = false;
    this.startTimer();
  }

  private updateTimer(duration: number) {
    const minutes = Math.floor(duration / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (duration % 60).toString().padStart(2, "0");
    this.minutes = minutes;
    this.seconds = seconds;
  }
}
