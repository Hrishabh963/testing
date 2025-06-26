import { Component, Input, OnChanges } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AuthorizationService } from "../../../services/authorization.service";
import { CustomConfirmationModalComponent } from "../../../shared/custom-confirmation-modal/custom-confirmation-modal.component";
import { LOAN_REPORTS_DOWNLOAD_TYPES } from "../../constant";

@Component({
  selector: "app-download-loan-report",
  templateUrl: "./download-loan-report.component.html",
  styleUrls: ["./download-loan-report.component.scss"],
})
export class DownloadLoanReportComponent implements OnChanges {
  downloadMenus = LOAN_REPORTS_DOWNLOAD_TYPES;
  authority = { view: false };
  @Input() loanIds;
  @Input() inputAuthority;
  @Input() loanStage;
  constructor(
    public readonly dialog: MatDialog,
    private readonly authorizationService: AuthorizationService
  ) {}
  openDialog = (menu): void => {
    const dialogRef = this.dialog.open(CustomConfirmationModalComponent, {
      width: "40vw",
      data: {
        reportsRouteUrl: "kcredit/genreport",
        ...menu,
        loanIds:
          this.loanIds instanceof Array ? this.loanIds.join(",") : this.loanIds,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  };

  ngOnChanges(): void {
    this.authority.view = this.authorizationService.hasAuthorityByStage(
      this.inputAuthority,
      this.loanStage
    );
  }
}
