import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { getProperty } from "src/app/utils/app.utils";
import { CoApplicantKycDetail } from "../../../models/kyc-details.model";
import { CustomerService } from "../../../services/customer/customer.service";
import { ObligatorTypes } from "../../constant";
import { KcreditLoanService } from "../../kcredit-loan.service";
import { KcreditLoanDetailsModel } from "../../kcredit-loanDetails.model";

@Component({
  selector: "jhi-guarantor",
  templateUrl: "./guarantor.component.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class GuarantorComponent {
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() disableEdit: boolean;
  @Input() riskCategoryEnabled: boolean = false;
  @Input() coApplicantKycDetails: CoApplicantKycDetail[] = [];
  @Output() reloadAfterSave = new EventEmitter<any>();
  readonly ObligatorTypes = ObligatorTypes;
  guarantors: any[] = [];
  panelOpenState: boolean = true;
  error: boolean;
  editGuarantor: boolean[] = [];

  constructor(
    private readonly kcreditLoanService: KcreditLoanService,
    private readonly snackBar: MatSnackBar,
    private readonly customerService: CustomerService
  ) {}

  ngOnInit() {
    this.getGuarantor();
    this.extractGuarantorDocs();
  }

  onSuccess() {
    this.reloadAfterSave.emit("Guarantor Details");
  }

  getGuarantor() {
    let obligatorList = getProperty(
      this.loanDetails,
      "loanObligatorDTOList",
      []
    );
    if (getProperty(obligatorList, "length", 0)) {
      obligatorList?.forEach((guarantor) => {
        if (guarantor.type == ObligatorTypes.guarantor) {
          guarantor.dateOfBirth =
            this.customerService.convertLocalDateFromServer(
              guarantor.dateOfBirth
            );
          this.guarantors.push(guarantor);
        }
      });
    }
  }

  updateGuarantor() {
    let obligatorList = getProperty(
      this.loanDetails,
      "loanObligatorDTOList",
      []
    );
    if (getProperty(obligatorList, "length", 0)) {
      obligatorList?.forEach((guarantor) => {
        this.guarantors.forEach((oldGuarantor) => {
          if (oldGuarantor.id === guarantor.id) {
            oldGuarantor.version = guarantor.version;
          }
        });
      });
    }
  }

  reloadGuarantorAfterSave(entity) {
    this.kcreditLoanService
      .find(this.loanDetails?.loanApplicationDTO?.id)
      .subscribe(
        (res) => this.successfulReload(res, entity),
        (res) => this.onError(res)
      );
  }

  successfulReload(res, entity) {
    this.loanDetails = res;
    this.updateGuarantor();
    this.snackBar.open("Successfully updated ", entity, {
      duration: 4000,
    });
  }

  onError(res) {
    console.log("Error " + res);
  }

  extractGuarantorDocs(): void {
    this.guarantors = this.guarantors?.map((guarantor: any) => {
      const id: number = getProperty(guarantor, "id", null);
      const guarantorDoc: Array<CoApplicantKycDetail> =
        this.coApplicantKycDetails?.filter((doc) => {
          const entityId = doc?.entityId ?? null;
          return entityId === id;
        });
      return { ...guarantor, kycDetailsList: guarantorDoc };
    });
  }
}
