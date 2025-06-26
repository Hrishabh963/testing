import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { GenerateReportsService } from "../../../services/generate-reports.service";
import {
  MatSelectOption,
  REPORTS_PURPOSE_VALUES,
} from "../../../loan/constant";
import { DataItem } from "../../../genreport/DataItem.model";
import { Partner } from "../../../models/partner.model";
import { DownloadLoanReportPopupComponent } from "../../../genreport/download-loan-report-popup/download-loan-report-popup.component";
import { AssociateLenderService } from "../../../services/associate-lender/associate-lender.service";

@Component({
  selector: "app-generate-report-popup",
  templateUrl: "./generate-report-popup.component.html",
  styleUrls: ["./generate-report-popup.component.scss"],
  standalone: false
})
export class GenerateReportPopupComponent implements OnInit {
  reportForm: FormGroup;

  maxDate = new Date();
  dateErrorMessage: string = "";

  selectedStatus: any = [];

  purposeList: MatSelectOption[] = REPORTS_PURPOSE_VALUES;
  reportTypeOptions: DataItem[] = [];
  partnerList: Partner[] = [];
  loanTypes: string[] = [];
  isDCBMFI: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    public readonly dialogRef: MatDialogRef<GenerateReportPopupComponent>,
    public readonly generateReportsService: GenerateReportsService,
    private readonly dialog: MatDialog,
    private readonly associateLenderService: AssociateLenderService
  ) {
    this.reportForm = this.fb.group({
      purpose: [{}, [Validators.required]],
      reportType: [[], [Validators.required]],
      partner: [[], [Validators.required]],
      loanType: [[], [Validators.required]],
      startDate: [
        null,
        [Validators.required, this.validateDateRange.bind(this)],
      ],
      endDate: [null, [Validators.required, this.validateDateRange.bind(this)]],
    });
  }

  ngOnInit(): void {
    this.partnerList = this.generateReportsService.partnerList;
    this.loanTypes = this.generateReportsService.loanTypes;
    this.isDCBMFI = this.associateLenderService.getLenderCode().toUpperCase() === "DCBMFI";
  }
  validateDateRange() {
    const startDate = this.reportForm?.get("startDate")?.value;
    const endDate = this.reportForm?.get("endDate")?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const maxDuration = 91 * 24 * 60 * 60 * 1000;

      if (end < start) {
        this.dateErrorMessage = "End Date cannot be before Start Date.";
        return { dateRangeInvalid: true };
      }

      if (end.getTime() - start.getTime() > maxDuration) {
        this.dateErrorMessage =
          "The date range cannot exceed maximum of 3 months.";
        return { dateRangeInvalid: true };
      }

      this.dateErrorMessage = "";
      this.reportForm?.get("startDate").setErrors(null);
      this.reportForm?.get("endDate").setErrors(null);
      return null;
    }
    return null;
  }
  onCancel(): void {
    this.dialogRef.close();
  }

  onGenerateReport(): void {
    if (this.reportForm.valid) {
      if (this.enableStatusMenu(true)) {
        const dialogRef = this.dialog.open(DownloadLoanReportPopupComponent, {
          width: "40vw",
        });
        dialogRef.afterClosed().subscribe((reportsResponse: any = null) => {
          console.log(reportsResponse, "closed");
          if (reportsResponse) {
            let additionalParameters = {};
            additionalParameters["downloadReportType"] = reportsResponse;
            additionalParameters["status"] = this.selectedStatus
              .map((status: any) => status.value)
              .join(",");
            this.generateNewReport(additionalParameters);
          }
        });
      } else {
        this.generateNewReport();
      }
    }
  }

  generateNewReport(additionalParameters: any = {}) {
    this.generateReportsService
      .generateNewReport(this.reportForm, additionalParameters)
      .subscribe(() => {
        this.dialogRef.close(this.reportForm.value);
      });
  }
  onPurposeChange(event: any) {
    const purpose = event.value;
    this.generateReportsService.setPurpose(purpose);
    this.reportTypeOptions =
      this.generateReportsService.updateReportTypeOptions(purpose);
    this.reportForm.controls["reportType"].setValue([]);
  }
  updateSelectedStatus(status: any) {
    this.selectedStatus = status;
    this.generateReportsService.setLoanApplicationStatus(status);
  }
  enableStatusMenu(checkForSelectedStatus: boolean = false) {
    let reports: DataItem[] = this.reportForm.controls["reportType"].value;
    let purpose: MatSelectOption = this.reportForm.controls["purpose"].value;
    return this.generateReportsService.enableStatusMenu(
      purpose,
      reports,
      checkForSelectedStatus
    );
  }
}
