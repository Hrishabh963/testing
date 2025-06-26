import { Component, Input, OnInit } from "@angular/core";
import { getProperty } from "src/app/utils/app.utils";
import { BeneficiaryCheckService } from "../../services/beneficiary-check-service";
import { UiConfigService } from "../../services/ui-config.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-beneficiary-check-details",
  templateUrl: "./beneficiary-check-details.component.html"
})
export class BeneficiaryCheckDetailsComponent implements OnInit {
  @Input() editSections: boolean = false;
  @Input() loanDetails: any;

  applicationStatus: string = null;

  beneficiaryData: any = {};

  constructor(
    private readonly uiConfigService: UiConfigService,
    private readonly beneficiaryCheckService: BeneficiaryCheckService,
    private readonly snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const loanId = getProperty(this.loanDetails, "loanApplicationDTO.id", null);
    this.uiConfigService
      .getUiInformationBySections("BANK_DETAILS", loanId)
      .subscribe(
        (response: any) => {
          this.beneficiaryData = getProperty(response, "fields", {});
        },
        (error) => {
          console.error(error);
        }
      );
      this.applicationStatus = getProperty(this.loanDetails, "loanApplicationDTO.applicationStatus", "");
  }

  retryBeneficiaryCheck(): void {
    const loanId = getProperty(this.loanDetails, "loanApplicationDTO.id", null);

    this.beneficiaryCheckService.retryBeneficiaryCheck(loanId).subscribe(
      (response) => {
        this.beneficiaryData = getProperty(response, "fields", {});
        this.snackbar.open("Beneficiary Check Successful.", "", {
          duration: 3000,
        });
      },
      (error) => {
        console.error(error);
        this.snackbar.open("Beneficiary Check Failed.", "", { duration: 3000 });
      }
    );
  }
}
