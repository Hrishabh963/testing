import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { PrincipalService } from "src/app/core";
import { TopNavService } from "src/app/layouts/navbar/topnav.service";
import { getProperty } from "src/app/utils/app.utils";
import { DashboardService } from "../../dashboard/dashboard.service";
import { PaymentMandateData } from "../payment-mandate.constants";
import { PaymentMandateService } from "../payment-mandate.service";
import { CloseMandateComponent } from "./close-mandate/close-mandate.component";
import { DownloadTransactionsDialogComponent } from "./download-transactions-dialog/download-transactions-dialog.component";
@Component({
  selector: "app-mandate-detail",
  templateUrl: "./mandate-detail.component.html",
  styleUrls: ["../payment-mandate.scss", "./mandate-detail.component.scss"],
})
export class MandateDetailComponent implements OnInit {
  hideCloseMandate: boolean = false;
  mandateInfo: PaymentMandateData = null;
  mandateTransactions: any = {};
  mandateReferenceId: string = null;

  constructor(
    public readonly dialog: MatDialog,
    private readonly principalService: PrincipalService,
    private readonly dashboardService: DashboardService,
    private readonly topNavService: TopNavService,
    private readonly snackbar: MatSnackBar,
    private readonly router: ActivatedRoute,
    private readonly paymentMandateService: PaymentMandateService
  ) {}

  ngOnInit() {
    this.principalService.identity().then(() => {
      this.dashboardService.sendMessage("shownav");
      this.topNavService.topNav$.next("paymentMandate");
    });

    this.mandateInfo = window.history.state;
    this.hideCloseMandate =
      getProperty(this.mandateInfo, "status", "") === "CLOSED";
    this.router.params.subscribe((params) => {
      this.mandateReferenceId = params["id"];
    });
  }
  downloadTransactions(): void {
    const dialogRef = this.dialog.open(DownloadTransactionsDialogComponent, {
      width: "35vw",
      data: {
        mandateReferenceId: getProperty(
          this.mandateInfo,
          "mandateReferenceId",
          null
        ),
        customerName: getProperty(this.mandateInfo, "customerName", ""),
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log("The dialog was closed");
    });
  }
  closeMandate(): void {
    const dialogRef = this.dialog.open(CloseMandateComponent, {
      width: "35vw",
      data: {
        mandateInfo: this.mandateInfo,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log("The dialog was closed");
    });
  }

  fetchMandateTransactions(payload: any = {}) {
    let page = getProperty(payload, "page", 0);
    let pageSize = getProperty(payload, "pageSize");
    this.paymentMandateService
      .getMandateTransactions(this.mandateReferenceId, page, pageSize)
      .subscribe(
        (response) => {
          this.mandateInfo = getProperty(response, "mandateDto", {});
          this.mandateTransactions = getProperty(
            response,
            "mandateTransactionDtoPage",
            {}
          );
        },
        (err) => {
          console.error(err);
          this.snackbar.open("Error while fetching Mandate Transactions.", "", {
            duration: 3000,
          });
        }
      );
  }
}
