import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { cloneDeep, get, set } from "lodash";
import { getProperty } from "src/app/utils/app.utils";
import { ReviewEntity } from "../../models/customer-group/review-enum.model";
import { CustomerService } from "../../services/customer/customer.service";
import { UiConfigService } from "../../services/ui-config.service";
import { createRequestpayloadForDynamicSection } from "src/app/shared/util/kicredit.utils";
import { AuthorizationService } from "../../services/authorization.service";
import { SECTION_INFORMATION } from "src/app/constants/ui-config";
import { ApplicationStatus } from "../../loan/constant";
import { AssociateLenderService } from "../../services/associate-lender/associate-lender.service";

@Component({
  selector: "app-borrower-beneficiary-check",
  templateUrl: "./borrower-beneficiary-check.component.html",
  styleUrls: [
    "./borrower-beneficiary-check.component.scss",
    "../review-section-fields.scss",
  ],
})
export class BorrowerBeneficiaryCheckComponent implements OnInit {
  enableEdit: boolean = false;
  canEdit: boolean = false;
  isAgreementRecieved: boolean = true;
  toggleBankDetails: boolean = true;
  toggleSearchIFSC: boolean = true;

  @Input() beneficiaryData: any = {};
  @Input() loanId: number = null;
  @Input() customerId: number = null;
  @Input() editSections: boolean = false;
  @Input() applicationStatus: string = null;
  @Output() retryBeneficiaryCheck: EventEmitter<any> = new EventEmitter();
  initialData: any = {};
  beneficiaryFieldsMap: Array<any> = [];
  bankFieldsMap: Array<any> = [];

  statusMapper: any = {
    VERIFIED: {
      class: "beneficiary-success",
      message: "SUCCESS_NAMEMATCHED",
      icon: "assets/images/common/success-check-circle-outlined.svg",
    },
    NOT_VERIFIED: {
      class: "beneficiary-error",
      message: "Failed",
      icon: "assets/images/common/error.svg",
    },
    INITIATED: {
      class: "beneficiary-success",
      message: "INITIATED",
      icon: "assets/images/common/success-check-circle-outlined.svg",
    },
    FAILED: {
      class: "beneficiary-error",
      message: "SUCCESS_NAMEMISMATCHED",
      icon: "assets/images/common/error.svg",
    },
  };

  constructor(
    private readonly uiConfigService: UiConfigService,
    private readonly customerService: CustomerService,
    private readonly associateLenderService: AssociateLenderService,
    private readonly snackbar: MatSnackBar,
    private readonly authorizationService: AuthorizationService
  ) {
    this.canEdit = this.authorizationService.hasAuthority(
      SECTION_INFORMATION.BANK_DETAILS.authority
    );
  }

  ngOnInit(): void {
    const lenderCode: string = this.associateLenderService.getLenderCode();
    if (lenderCode.toLowerCase() === "dcb") {
      this.isAgreementRecieved =
        this.applicationStatus &&
        [ApplicationStatus.agreementreceived].includes(this.applicationStatus);
    }
    this.uiConfigService
      .getUiConfigBySection(SECTION_INFORMATION.BANK_DETAILS.sectionKey)
      .subscribe((response: any) => {
        const uiConfiguration: any =
          this.uiConfigService.getUiConfigurationsBySection(
            response,
            SECTION_INFORMATION.BANK_DETAILS.sectionKey,
            true
          );
        this.beneficiaryFieldsMap = getProperty(
          uiConfiguration,
          "beneficiaryDetails",
          []
        );
        this.bankFieldsMap = getProperty(
          uiConfiguration,
          "bankBranchDetails",
          []
        );
        this.toggleBankDetails = get(uiConfiguration, "showBankBranch", true);
        this.toggleSearchIFSC = get(uiConfiguration, "showSearchIFSC", true);
      });
  }

  mapIfscCodeResponse(ifscCodeResponse: any = {}) {
    set(
      this.beneficiaryData,
      "bankBranch.value",
      getProperty(ifscCodeResponse, "branch", "")
    );
    set(
      this.beneficiaryData,
      "bankName.value",
      getProperty(ifscCodeResponse, "bank", "")
    );
    set(
      this.beneficiaryData,
      "bankCode.value",
      getProperty(ifscCodeResponse, "bankcode", "")
    );
    set(
      this.beneficiaryData,
      "micrCode.value",
      getProperty(ifscCodeResponse, "micr", "")
    );
    set(
      this.beneficiaryData,
      "bankAddress.value",
      getProperty(ifscCodeResponse, "address", "")
    );
    set(
      this.beneficiaryData,
      "bankContact.value",
      getProperty(ifscCodeResponse, "contact", "")
    );
    set(
      this.beneficiaryData,
      "bankCity.value",
      getProperty(ifscCodeResponse, "city", "")
    );
    set(
      this.beneficiaryData,
      "bankDistrict.value",
      getProperty(ifscCodeResponse, "district", "")
    );
    set(
      this.beneficiaryData,
      "bankState.value",
      getProperty(ifscCodeResponse, "state", "")
    );
  }

  searchIfsc() {
    let ifscCode = getProperty(this.beneficiaryData, "ifscCode.value", "");
    this.customerService
      .searchIFSC(
        ifscCode,
        ReviewEntity.LoanApplication,
        this.loanId,
        this.customerId
      )
      .subscribe(
        (response) => {
          let message = getProperty(response, "message", null);
          if (message) {
            this.snackbar.open(message, "", { duration: 3000 });
          } else {
            this.mapIfscCodeResponse(response);
          }
        },
        (err) => console.error(err)
      );
  }

  toggleEditDetails() {
    this.initialData = cloneDeep(this.beneficiaryData);
    this.enableEdit = !this.enableEdit;
  }

  cancelEditDetails(): void {
    this.enableEdit = false;
    this.beneficiaryData = cloneDeep(this.initialData);
  }

  saveDetails() {
    this.uiConfigService
      .updateUiFields(
        "bank-detail",
        createRequestpayloadForDynamicSection(this.beneficiaryData),
        this.loanId
      )
      .subscribe(
        (response) => {
          let updatedDetails = getProperty(
            response,
            "fields",
            this.beneficiaryData
          );
          this.beneficiaryData = cloneDeep(updatedDetails);
          this.initialData = cloneDeep(updatedDetails);
          this.snackbar.open("Bank Details saved successfully!", "", {
            duration: 3000,
          });
          this.cancelEditDetails();
          location.reload();
        },
        (error) => {
          console.error(error);
          this.snackbar.open("Error while saving Beneficiary Details", "", {
            duration: 3000,
          });
        }
      );
  }

  retryCheck(): void {
    this.retryBeneficiaryCheck.emit();
  }
}
