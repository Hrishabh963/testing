import { Component, EventEmitter, Input, Output } from "@angular/core";
import { cloneDeep } from "lodash";
import { JhiAlertService } from "ng-jhipster";
import { getFormattedDate } from "src/app/shared/util/kicredit.utils";
import { RiskCategorisation } from "../../../models/customer/customer-risk-categorisation.model";
import { KycDetailsForLoan } from "../../../models/kyc-details.model";
import { CustomerService } from "../../../services/customer/customer.service";
import { KcreditLoanService } from "../../kcredit-loan.service";
import { KcreditLoanDetailsModel } from "../../kcredit-loanDetails.model";
@Component({
  selector: "jhi-guarantor-member",
  templateUrl: "./guarantor-member.component.html",
  styleUrls: ["../../kcredit-loan.css", "./guarantor-member.component.scss"],
})
export class GuarantorMemberComponent {
  @Input() disableEdit: boolean;
  @Input() guarantor: any;
  @Input() index: number;
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() riskCategoryEnabled: boolean = false;
  maxDate;
  minDate;
  year;
  month;
  day;
  @Output() reloadGuarantorAfterSave = new EventEmitter<any>();
  error: boolean;
  editGuarantor: boolean = false;
  initialGuarantor: any = {};
  panelState: boolean = true;
  riskProfile: RiskCategorisation = {};
  guarantorDocType: any = {};
  guarantorDocId: any = {};
  poiDoc: KycDetailsForLoan = {};
  poaDoc: KycDetailsForLoan = {};

  constructor(
    private readonly alertService: JhiAlertService,
    private readonly kcreditLoanService: KcreditLoanService,
    private readonly customerService: CustomerService
  ) {}

  ngOnInit() {
    this.maxDate = new Date();
    this.minDate = new Date(
      this.getDateString({ year: 1930, month: 1, day: 1 })
    );
    this.guarantor.dateOfBirth = new Date(
      this.getDateString(this.guarantor.dateOfBirth)
    );
    this.initialGuarantor = cloneDeep(this.guarantor);
    
    this.customerService.extractDocData(
      this.guarantorDocId,
      this.guarantorDocType,
      this.guarantor?.kycDetailsList ?? []
    );
    this.poiDoc = this.guarantor?.kycDetailsList?.find(
      (doc: KycDetailsForLoan) => {
        return doc?.purpose?.toLowerCase() === "poi";
      }
    );
    this.poaDoc = this.guarantor?.kycDetailsList?.find(
      (doc: KycDetailsForLoan) => {
        return doc?.purpose?.toLowerCase() === "poa";
      }
    );
    const riskProfiles: Array<RiskCategorisation> =
      this.loanDetails?.customerRiskProfileDTO ?? [];
    this.riskProfile = this.customerService.getRiskCategoryData(
      riskProfiles,
      this.guarantor?.id ?? null
    );
  }

  enableEdit(event) {
    event.stopPropagation();
    this.editGuarantor = true;
  }

  cancelEdit(event) {
    event.stopPropagation();
    this.editGuarantor = false;
    this.guarantor = cloneDeep(this.initialGuarantor);
  }

  closeEdit() {
    this.editGuarantor = false;
  }

  save(event, obligator) {
    event.stopPropagation();
    let payload = cloneDeep(obligator);
    payload["dateOfBirth"] = getFormattedDate(payload["dateOfBirth"]);
    this.kcreditLoanService.updateLoanObligator(payload).subscribe(
      () => this.onSuccess(),
      (res) => this.onSaveError(res)
    );
  }

  private onSaveError(error) {
    try {
      error = error.json();
    } catch (exception) {
      error.message = error.text();
    }
    this.onError(error);
  }

  private onError(error) {
    this.error = false;
    setTimeout(() => {
      this.alertService.error(error.error, null, null);
    }, 100);
  }

  onSuccess() {
    this.closeEdit();
    this.initialGuarantor = this.guarantor;
    this.reloadGuarantorAfterSave.emit("Guarantor");
  }
  updateDate(dateObj = {}) {
    this.guarantor["dateOfBirth"] = dateObj["value"];
  }
  getDateString(dateObj: any = {}): string {
    return `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
  }
}
