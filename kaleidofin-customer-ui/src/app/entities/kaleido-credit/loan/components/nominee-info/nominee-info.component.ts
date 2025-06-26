import { Component, EventEmitter, Input, Output } from "@angular/core";
import get from "lodash/get";
import { JhiAlertService } from "ng-jhipster";
import { Address } from "../../../models/customer/address.model";
import { NomineeDetails } from "../../../models/customer/nominee-details.model";
import { CustomerService } from "../../../services/customer/customer.service";
import { KcreditLoanDetailsModel } from "../../kcredit-loanDetails.model";
import { cloneDeep } from "lodash";
import { CoApplicantKycDetail } from "../../../models/kyc-details.model";

@Component({
  selector: "jhi-nominee-info",
  templateUrl: "./nominee-info.component.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class NomineeInfoComponent {
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() coApplicantKYCDetailsList: CoApplicantKycDetail[] = [];
  @Input() disableEdit: boolean;
  @Output() reloadAfterSave = new EventEmitter<any>();
  nomineeDetails: NomineeDetails;
  guardianAddress: Address;
  initialNomineeDetails: NomineeDetails;
  nomineeAddress: Address = {};
  initialNomineeAddress: Address = {};
  initialGuardianAddress: Address;
  addressList: Address[];
  editNomineeDetails: boolean = false;
  editGuardianAddress: boolean = false;
  error: boolean;
  maxDate;
  minDate;
  year;
  month;
  day;

  //to be worked on
  public dateDisplay = undefined;
  public guardianDOBDateDisplay = undefined;

  constructor(
    private readonly alertService: JhiAlertService,
    private readonly customerService: CustomerService
  ) {}

  ngOnInit() {
    this.nomineeDetails = get(this.loanDetails, "nomineeDetails", {}) || {};
    this.addressList = this.loanDetails?.addressDTOList;
    this.addressList.forEach((address) => {
      if (
        this.nomineeDetails &&
        address &&
        this.nomineeDetails.guardianAddressId &&
        address.id === this.nomineeDetails.guardianAddressId
      ) {
        this.guardianAddress = address;
      }
    });

    this.nomineeAddress = this.nomineeDetails?.nomineeAddress ?? {};
    this.initialNomineeAddress = {...this.nomineeAddress};
    this.maxDate = new Date();
    this.minDate = new Date(1930, 1, 1);
    this.updateDates();
    this.initialGuardianAddress = { ...this.guardianAddress };
    this.initialNomineeDetails = { ...this.nomineeDetails };
  }

  updateDates() {
    this.dateDisplay = this.customerService.updateDateObjects(
      this.nomineeDetails,
      "dateOfBirth"
    );
    this.guardianDOBDateDisplay = this.customerService.updateDateObjects(
      this.nomineeDetails,
      "guardianDOB"
    );
  }
  enableGuardianEdit() {
    this.editGuardianAddress = true;
  }

  enableNomineeEdit() {
    this.editNomineeDetails = true;
  }

  cancelGuardianEdit() {
    this.editGuardianAddress = false;
    this.guardianAddress = { ...this.initialGuardianAddress };
    this.updateDates();
  }

  cancelNomineeEdit() {
    this.editNomineeDetails = false;
    this.nomineeDetails = { ...this.initialNomineeDetails };
    this.nomineeAddress = {...this.initialNomineeAddress};
    this.updateDates();
  }

  closeGuardianEdit() {
    this.editGuardianAddress = false;
  }

  closeNomineeEdit() {
    this.editNomineeDetails = false;
  }

  saveNomineeDetails(nomineeDetails) {
    const payload: any = {...nomineeDetails, nomineeAddress: this.nomineeAddress}
    this.customerService.updateNomineeDetails(payload).subscribe(
      (res) => this.onSuccess(res, "Nominee Details"),
      (res) => this.onSaveError(res)
    );
  }

  saveGuardianAddress(address) {
    this.customerService.updateAddress(address).subscribe(
      (res) => this.onSuccess(res, "Guardian Address"),
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

  onSuccess(res, entity) {
    if (entity === "Nominee Details") {
      this.initialNomineeDetails = cloneDeep(res);
      this.nomineeDetails = cloneDeep(res);
      this.closeNomineeEdit();
    } else if (entity === "Guardian Address") {
      this.initialGuardianAddress = cloneDeep(res);
      this.guardianAddress = cloneDeep(res);
      this.closeGuardianEdit();
    }
    this.updateDates();
    this.reloadAfterSave.emit(entity);
  }

  getDateString(dateObj) {
    let dateString = null;
    if (dateObj && typeof dateObj === "object") {
      dateString = dateObj.day + "-" + dateObj.month + "-" + dateObj.year;
    }
    return dateString;
  }

  getNomineeAge() {
    let dateString = this.nomineeDetails.dateOfBirth;
    if (dateString && typeof dateString === "object") {
      dateString =
        dateString.year + "-" + dateString.month + "-" + dateString.day;
    }
    let today = new Date();
    let birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age || "--";
  }

  updateDate(dateObject = {}, key = "") {
    let date = dateObject["value"];
    this.nomineeDetails[key] = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }
}
