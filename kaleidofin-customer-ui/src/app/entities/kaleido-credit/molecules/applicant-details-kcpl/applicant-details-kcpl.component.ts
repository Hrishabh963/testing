import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { get } from "lodash";
import { updateName } from "src/app/shared";
import { getProperty } from "src/app/utils/app.utils";
import { DefaultErrorStateMatcher, Errors } from "../../loan/constant";
import { KcreditLoanDetailsModel } from "../../loan/kcredit-loanDetails.model";
import { Address } from "../../models/customer/address.model";
import { RiskCategorisation } from "../../models/customer/customer-risk-categorisation.model";
import { Customer } from "../../models/customer/customer.model";
import { FamilyDetails } from "../../models/customer/family-details.model";
import { KycDetailsForLoan } from "../../models/kyc-details.model";
import { AssociateLenderService } from "../../services/associate-lender/associate-lender.service";
import { CustomerReferenceCode } from "../../services/customer/customer.constants";
import { CustomerService } from "../../services/customer/customer.service";

@Component({
  selector: "app-applicant-details-kcpl",
  templateUrl: "./applicant-details-kcpl.component.html",
  styleUrls: ["./applicant-details-kcpl.component.scss"],
})
export class ApplicantDetailsKcplComponent implements OnInit, OnChanges {
  @Input() customer: Customer = {};
  @Input() kycDetailsList: KycDetailsForLoan[] = [];
  @Input() familyDetailsList: FamilyDetails[] = [];
  @Input() addressList: Address[];
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() loanId: number = null;
  @Input() riskCategoryEnabled: boolean = false;
  @Output() reloadAfterSave: EventEmitter<string> = new EventEmitter<string>();

  initialCustomerDetails: Customer = {};

  enableEdit: boolean = false;
  panelState: boolean = true;
  kycPanelState: boolean = true;
  isAadhaarVerificationNeeded: boolean = false;
  isPanVerificationNeeded: boolean = false;
  genders: CustomerReferenceCode[] = [];
  maritalStatuses: CustomerReferenceCode[] = [];
  readonly errorConstants = Errors;
  public errorMatcher: DefaultErrorStateMatcher;
  dateDisplay: Date;
  minDate: Date;
  maxDate: Date;
  docType: any = {};
  docId: any = {};
  riskProfile: RiskCategorisation = {};
  poiDoc: KycDetailsForLoan = {};
  poaDoc: KycDetailsForLoan = {};
  occupation: string = null;

  constructor(
    private readonly customerService: CustomerService,
    private readonly associateLenderService: AssociateLenderService,
    private readonly snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.customerService
      .getAllReferanceCodes(["Gender", "MaritalStatus"])
      .subscribe(
        (res: any) => {
          this.genders = getProperty(res, "Gender", []);
          this.maritalStatuses = getProperty(res, "MaritalStatus", []);
        },
        (error) => console.error(error)
      );
    this.associateLenderService
      .getLenderConfigurationSubject()
      .subscribe((lenderConfig: any) => {
        this.isAadhaarVerificationNeeded = getProperty(
          lenderConfig,
          "isAadhaarVerificationNeeded",
          false
        );
        this.isPanVerificationNeeded = getProperty(
          lenderConfig,
          "isPanVerificationNeeded",
          false
        );
      });
    this.errorMatcher = new DefaultErrorStateMatcher();
    this.dateDisplay = new Date(this.customer?.dateOfBirth);
    if (typeof this.customer?.dateOfBirth === "string") {
      this.customer["dateOfBirth"] =
        this.customerService.convertLocalDateFromServer(
          this.customer?.dateOfBirth
        );
    }
    this.maxDate = new Date();
    this.minDate = new Date(1930, 1, 1);
    this.customerService.extractDocData(
      this.docId,
      this.docType,
      this.kycDetailsList
    );
    this.poiDoc = this.kycDetailsList.find((docs: KycDetailsForLoan) => {
      return docs?.purpose?.toLowerCase() === "poi";
    });
    this.poaDoc = this.kycDetailsList.find((docs: KycDetailsForLoan) => {
      return docs?.purpose?.toLowerCase() === "poa";
    });
    this.updateFamilyName("Father", "fatherName", this.customer);
    this.updateFamilyName("Spouse", "spouseName", this.customer);
    this.initialCustomerDetails = JSON.parse(
      JSON.stringify(this.customer) || "{}"
    );
    this.getOccupation();
    const customerRiskProfiles = this.loanDetails?.customerRiskProfileDTO ?? [];
    this.riskProfile = this.customerService.getRiskCategoryData(
      customerRiskProfiles,
      this.customer?.id ?? null
    );
  }

  getOccupation(): void {
    const profile: any = JSON.parse(this.customer?.profile ?? "[]");
    const additionalData: any = JSON.parse(
      this.loanDetails?.loanApplicationDTO?.additionalData ?? "[]"
    );
    this.occupation = profile?.Profession || additionalData?.Profession || get(this.customer,'occupationType',null);
  }

  ngOnChanges(changes: SimpleChanges): void {
    let familyDetailsChanges = changes["familyDetailsList"];
    const previousObject = JSON.stringify(familyDetailsChanges?.previousValue);
    const currentObject = JSON.stringify(familyDetailsChanges?.currentValue);

    if (previousObject !== currentObject && !familyDetailsChanges?.firstChange) {
      this.updateFamilyName("Father", "fatherName", this.customer);
      this.updateFamilyName("Spouse", "spouseName", this.customer);
    }
  }

  updateDate(dateObject: any = {}): void {
    let date = dateObject["value"];
    this.customer["dateOfBirth"] = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }
  updateFamilyName(
    relationshipType = "Spouse",
    instanceKey = "fatherName",
    instance = this.customer,
    relationshipKey = "relationName"
  ) {
    if (get(this.familyDetailsList, "length")) {
      let familyDto = this.familyDetailsList.find(
        (familyDetail) => familyDetail.relationship === relationshipType
      );
      if (familyDto) {
        if (get(familyDto, relationshipKey)) {
          instance[instanceKey] = `${get(familyDto, relationshipKey)}`;
          if (get(familyDto, "middleName", null)) {
            instance[instanceKey] += ` ${get(familyDto, "middleName", "")}`;
          }
          if (get(familyDto, "lastName", null)) {
            instance[instanceKey] += ` ${get(familyDto, "lastName", "")}`;
          }
        }
      }
    }
  }

  cancel(event: Event): void {
    event.stopPropagation();
    this.enableEdit = false;
    this.customer = JSON.parse(JSON.stringify(this.initialCustomerDetails));
  }

  toggleEditDetails(event: Event): void {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
  }

  onSuccess() {
    this.reloadAfterSave.emit("Applicant Details");
  }

  save(event: Event): void {
    event.stopPropagation();
    this.saveFamilyDetails("Father", this.customer, "fatherName");
    this.saveFamilyDetails("Spouse", this.customer, "spouseName");
    delete(this.customer["version"])
    this.customerService.update(this.customer).subscribe(
      (res) => {
        this.enableEdit = false;
        this.reloadAfterSave.emit("Applicant Details");
        this.initialCustomerDetails = JSON.parse(JSON.stringify(this.customer));
      },
      (errorResponse) => {
        console.error(errorResponse);
        const errors: Array<string> = getProperty(
          errorResponse,
          "error.errors",
          []
        );
        this.snackbar.open(errors.join(", "), "Error", { duration: 3000 });
      }
    );
  }

  saveFamilyDetails(
    relationshipType = "Father",
    instance = {},
    instanceKey = "fatherName"
  ) {
    if (get(this.familyDetailsList, "length")) {
      let familyDto = {
        ...this.familyDetailsList.find(
          (familyDetail) => familyDetail.relationship === relationshipType
        ),
      };
      if (familyDto && instance[instanceKey] && familyDto["relationName"]) {
        familyDto["relationName"] = instance[instanceKey];
        familyDto = updateName(familyDto, "relationName");
        this.customerService.updateFamily(familyDto).subscribe();
      }
    }
  }
}
