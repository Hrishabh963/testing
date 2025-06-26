import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { JhiAlertService } from "ng-jhipster";
import { PropertyDetails } from "../../../models/property-details.model";
import { CustomerService } from "../../../services/customer/customer.service";
import { KcreditLoanDetailsModel } from "../../kcredit-loanDetails.model";

@Component({
  selector: "jhi-property-details",
  templateUrl: "./property-details.component.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class PropertyDetailsComponent implements OnInit {
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() disableEdit: boolean;
  @Output() reloadAfterSave = new EventEmitter<any>();
  bankDetails: PropertyDetails;
  initialBankDetails: PropertyDetails;
  editBankDetails: boolean = false;
  error: boolean;

  constructor(
    private readonly alertService: JhiAlertService,
    private readonly customerService: CustomerService
  ) {}

  ngOnInit() {
    this.bankDetails = {...this.loanDetails.propertyDetails};
    this.initialBankDetails = { ...this.loanDetails.propertyDetails };
  }

  enableEdit() {
    this.editBankDetails = true;
  }

  cancelEdit() {
    this.editBankDetails = false;
    this.bankDetails = {...this.initialBankDetails};
  }

  closeEdit() {
    this.editBankDetails = false;
  }

  saveBankDetails(bankDetails) {
    this.customerService.updateBankDetails(bankDetails).subscribe(
      (res) => this.onSuccess(res, "Bank Details"),
      (res) => this.onSaveError(res)
    );
  }

  private onSaveError(error) {
    try {
      error = error.json();
      this.editBankDetails = false;
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
    this.closeEdit();
    this.reloadAfterSave.emit(entity);
  }
}
