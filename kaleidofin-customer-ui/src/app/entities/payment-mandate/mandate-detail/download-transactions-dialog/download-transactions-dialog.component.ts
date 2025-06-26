import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { PaymentMandateService } from "../../payment-mandate.service";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-download-transactions-dialog",
  templateUrl: "./download-transactions-dialog.component.html",
  styleUrls: ["./download-transactions-dialog.component.scss"],
})
export class DownloadTransactionsDialogComponent {
  closeDialog: boolean = false;
  enableReports: boolean = false;

  constructor(
    public readonly dialogRef: MatDialogRef<DownloadTransactionsDialogComponent>,
    private readonly paymentMandateService: PaymentMandateService,
    @Inject(MAT_DIALOG_DATA) private readonly dialogData,
    private readonly router: Router
  ) {}

  proceed(): void {
    const payload = {
      status: ["FAILED", "READY", "IN_PROGRESS"],
      reportType: "MANDATE_TRANSACTIONS",
      mandateReferenceId: getProperty(
        this.dialogData,
        "mandateReferenceId",
        null
      ),
        customerName: getProperty(this.dialogData, "customerName", null),
    };

    this.paymentMandateService.generateMandateReports(payload).subscribe(
      () => {
        this.enableReports = true;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  cancel(): void {
    this.dialogRef.close();
  }

  goToReports(): void {
    this.router.navigate(["paymentMandate/download"]);
    this.dialogRef.close();
  }
}
