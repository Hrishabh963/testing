import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { cloneDeep } from "lodash";
import { getProperty } from "src/app/utils/app.utils";
import { Errors } from "../../loan/constant";
import { KcreditLoanService } from "../../loan/kcredit-loan.service";
import { KcreditLoanDetailsModel } from "../../loan/kcredit-loanDetails.model";
import { RiskCategorisation } from "../../models/customer/customer-risk-categorisation.model";
import { KycDetailsForLoan } from "../../models/kyc-details.model";
import { CustomerService } from "../../services/customer/customer.service";

@Component({
  selector: "app-co-applicant-details",
  templateUrl: "./co-applicant-details.component.html",
  styleUrls: ["./co-applicant-details.component.scss"],
})
export class CoApplicantDetailsComponent implements OnInit {
  @Input() coApplicant: any = {};
  @Input() disableEdit: boolean;
  @Input() title: any = "";
  @Input() loanId: number = null;
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() riskCategoryEnabled: boolean = false;
  @Input() coApplicants = [];
  @Input() index: number = 0;

  panelOpenState: boolean = true;

  readonly errorConstants = Errors;

  public errorMatcher = null;
  editCoApplicantDetails: boolean = false;
  initialCoApplicant: any = {};
  maxDate: Date;
  minDate: Date;
  entityId: number = null;
  coApplicantRiskProfile: RiskCategorisation = {};
  coApplicantDocType: any = {};
  coApplicantDocId: any = {};
  poiDoc: KycDetailsForLoan = {};
  poaDoc: KycDetailsForLoan = {};

  constructor(
    private readonly datePipe: DatePipe,
    private readonly kcreditLoanService: KcreditLoanService,
    private readonly customerService: CustomerService,
    private readonly snackBar: MatSnackBar
  ) {
    this.maxDate = new Date();
    this.minDate = new Date(1930, 1, 1);
  }

  ngOnInit(): void {
    this.initialCoApplicant = JSON.parse(JSON.stringify(this.coApplicant));
    this.entityId = getProperty(this.coApplicant, "id", null);
    const riskProfiles = this.loanDetails?.customerRiskProfileDTO ?? [];
    this.coApplicantRiskProfile = this.customerService.getRiskCategoryData(
      riskProfiles,
      this.entityId
    );
    this.customerService.extractDocData(
      this.coApplicantDocId,
      this.coApplicantDocType,
      this.coApplicant?.kycDocuments ?? []
    );
    this.poiDoc = this.coApplicant?.kycDocuments?.find(
      (doc: KycDetailsForLoan) => {
        return doc?.purpose?.toLowerCase() == "poi";
      }
    );
    this.poaDoc = this.coApplicant?.kycDocuments?.find(
      (doc: KycDetailsForLoan) => {
        return doc?.purpose?.toLowerCase() == "poa";
      }
    );
  }

  updateDate(dateObj = {}): void {
    if (dateObj["value"]) {
      const date: Date = new Date(dateObj["value"]);
      const dateString = this.datePipe.transform(date, "yyyy-MM-dd");
      this.coApplicant["dateOfBirth"] = dateString;
    }
  }

  saveCoApplicant(event): void {
    event.stopPropagation();
    this.saveCoApplicantDetails(this.coApplicant);
  }

  saveCoApplicantDetails(updatedCoApplicant: any = {}): void {
    this.coApplicants[this.index] = cloneDeep(updatedCoApplicant);

    this.kcreditLoanService
      .updateCoApplicantDetails(this.coApplicants)
      .subscribe(
        () => {
          this.snackBar.open(
            "Successfully updated details",
            "Co-applicant details",
            {
              duration: 3000,
            }
          );
          this.initialCoApplicant = this.coApplicant;
          this.closeCoApplicantEdit();
        },
        () => {
          this.snackBar.open("Error in updating", "Co-applicant details", {
            duration: 3000,
          });
        }
      );
  }

  enableCoApplicantEdit(event): void {
    event.stopPropagation();
    this.editCoApplicantDetails = true;
  }

  closeCoApplicantEdit(): void {
    this.editCoApplicantDetails = false;
    this.coApplicant = { ...this.initialCoApplicant };
  }

  cancelCoApplicantEdit(event): void {
    event.stopPropagation();
    this.closeCoApplicantEdit();
  }
}
