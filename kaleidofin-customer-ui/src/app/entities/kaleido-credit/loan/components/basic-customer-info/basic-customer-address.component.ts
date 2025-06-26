import { Component, EventEmitter, Input, Output } from "@angular/core";
import { JhiAlertService } from "ng-jhipster";
import { Address } from "../../../models/customer/address.model";
import { CustomerService } from "../../../services/customer/customer.service";

@Component({
  selector: "jhi-basic-customer-address",
  templateUrl: "./basic-customer-address.component.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class BasicCustomerAddressComponent {
  @Input() address: Address;
  @Input() disableEdit: boolean;
  @Output() reloadAfterSave = new EventEmitter<any>();
  public initialAddress: any;
  error: boolean;
  editCurrentAddress: boolean = false;

  constructor(
    private readonly customerService: CustomerService,
    private readonly alertService: JhiAlertService,
    
  ) {}

  ngOnInit() {
    this.initialAddress = { ...this.address };
  }

  enableEdit() {
    this.editCurrentAddress = true;
  }

  cancelEdit() {
    this.editCurrentAddress = false;
    this.address = { ...this.initialAddress };
  }

  closeEdit() {
    this.editCurrentAddress = false;
  }

  saveCurrentAddress(address) {
    this.customerService.updateAddress(address).subscribe(
      (res) => this.onSuccess(res, "Address"),
      (res) => this.onSaveError(res)
    );
  }

  getAddressHeading() {
    return (
      this.capitalizeFirstLetter(
        this.address.addressType.toString().replace("_", " ").toLowerCase()
      ) + " Address"
    );
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
    this.closeEdit();
    this.reloadAfterSave.emit(entity);
  }
}
