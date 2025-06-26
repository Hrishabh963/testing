import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Address } from "../../../models/customer/address.model";
import { Customer } from "../../../models/customer/customer.model";
import { FamilyDetails } from "../../../models/customer/family-details.model";
import { CoApplicantKycDetail, KycDetailsForLoan } from "../../../models/kyc-details.model";
import { KCreditLoanApplication } from "../../../report/kcredit-loan-application.model";
import { KcreditLoanDetailsModel } from "../../kcredit-loanDetails.model";
import { KycVerificationService } from "../../../services/kyc-verification.service";
import { getProperty } from "src/app/utils/app.utils";
import { get } from "lodash";
@Component({
  selector: "jhi-basic-customer-info",
  templateUrl: "./basic-customer-info.component.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class BasicCustomerInfoComponent implements OnInit {
  @Input() addressList: Address[];
  @Input() familyDetailsList: FamilyDetails[];
  @Input() disableEdit: boolean;
  @Input() customer: Customer;
  @Input() kycDetailsList: KycDetailsForLoan[];
  @Input() loanApplicationDTO: KCreditLoanApplication;
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() loanId: number = null;
  @Input() coApplicants: any = [];
  @Input() coApplicantKycDetails: CoApplicantKycDetail[] = [];
  @Output() reloadAfterSave = new EventEmitter<any>();

  panelOpenState: boolean = true;
  isAadhaarVerificationNeeded: boolean = false;
  riskCategoryEnabledForApplicant: boolean = false;
  riskCategoryEnabledForCoApplicant: boolean = false;
  riskCategoryEnabledForGuarantor: boolean = false;

  constructor(private readonly kycVerificationService: KycVerificationService) {}

  ngOnInit() {
    this.kycVerificationService
      .getKycVerificationConfig(this.loanId)
      .subscribe((response: any) => {
        const riskCategoryEnabled: any = getProperty(
          response,
          "riskCatgeoryEnabled",
          {}
        );
        this.riskCategoryEnabledForApplicant = get(
          riskCategoryEnabled,
          "riskCategoryRequiredForApplicant",
          false
        );
        this.riskCategoryEnabledForCoApplicant = get(
          riskCategoryEnabled,
          "riskCategoryRequiredForCoApplicant",
          false
        );
        this.riskCategoryEnabledForGuarantor = get(
          riskCategoryEnabled,
          "riskCategoryRequiredForGuarantor",
          false
        );
      });
  }
}
