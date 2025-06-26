import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { splitAndUpdateNames, updateName } from "src/app/shared";
import { Customer } from "../../../models/customer/customer.model";
import { FamilyDetails } from "../../../models/customer/family-details.model";
import { CustomerService } from "../../../services/customer/customer.service";
import { getProperty } from "src/app/utils/app.utils";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "jhi-family-info",
  templateUrl: "./family-info.component.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class FamilyInfoComponent implements OnInit, OnChanges {
  @Input() disableEdit: boolean;
  @Input() customer: Customer;
  @Output() reloadAfterSave = new EventEmitter<any>();
  @Input() familyDetailsList: FamilyDetails[];
  initialOtherFamilyMembers: FamilyDetails[] = [];
  otherFamilyMembers: FamilyDetails[] = [];
  editCustomerInfo: boolean = false;
  error: boolean;
  maxDate;
  minDate;
  year;
  month;
  day;
  editFamilyInfo: boolean[] = [];
  fatherInfo: FamilyDetails;
  spouseInfo: FamilyDetails;
  primaryRelationship: FamilyDetails;
  initialPrimaryRelationship: FamilyDetails;
  editPrimaryRelationship: boolean = false;
  initialCustomer: Customer;
  panelOpenState: boolean = true;
  public isEditing: boolean;

  constructor(
    private readonly customerService: CustomerService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.validateChanges(changes)) {
      this.initialSetup();
    }
  }

  validateChanges(changes: SimpleChanges): boolean {
    let allChanges = Object.keys(changes || {});
    return allChanges.some((change) => {
      if (change) {
        const previousObject = JSON.stringify(changes[change]["previousValue"]);
        const currentObject = JSON.stringify(changes[change]["currentValue"]);
        return (
          previousObject !== currentObject && !changes[change]["firstChange"]
        );
      }
      return false;
    });
  }

  ngOnInit() {
    this.maxDate = new Date();
    this.minDate = new Date(1930, 0, 1);
    this.initialSetup();
  }
  initialSetup() {
    if (this.familyDetailsList) {
      this.familyDetailsList.forEach((familyDetail, index) => {
        this.editFamilyInfo[index] = false;
        if (typeof familyDetail.dob === "string") {
          familyDetail["dateDisplay"] = new Date(familyDetail?.dob);
          familyDetail.dob = this.customerService.convertLocalDateFromServer(
            familyDetail.dob
          );
        }
        if (familyDetail.relationship === "Father") {
          this.fatherInfo = familyDetail;
        } else if (familyDetail.relationship === "Spouse") {
          this.spouseInfo = familyDetail;
        }
        splitAndUpdateNames(familyDetail, "relationName");
      });
    }

    if (this.spouseInfo) {
      this.otherFamilyMembers = this.familyDetailsList.filter(
        (familyDetail) => familyDetail.relationship !== "Spouse"
      );
    } else if (this.fatherInfo) {
      this.otherFamilyMembers = this.familyDetailsList.filter(
        (familyDetail) => familyDetail.relationship !== "Father"
      );
    }

    this.initialOtherFamilyMembers = JSON.parse(
      JSON.stringify(this.otherFamilyMembers)
    );
    this.primaryRelationship = this.spouseInfo || this.fatherInfo;
    this.initialPrimaryRelationship = { ...this.primaryRelationship };
    this.initialCustomer = { ...this.customer };
  }

  enablePrimaryEdit() {
    this.editPrimaryRelationship = true;
  }

  cancelPrimaryEdit() {
    this.editPrimaryRelationship = false;
    this.primaryRelationship = { ...this.initialPrimaryRelationship };
    this.customer = { ...this.initialCustomer };
    this.isEditing = false;
  }

  closePrimaryEdit() {
    this.editPrimaryRelationship = false;
  }

  savePrimary(family) {
    this.saveFamily(family);
  }

  async saveFamily(familyPayload = {}) {
    let family = { ...familyPayload };
    delete(family["version"]);
    family = updateName(family, "relationName");
    try {
      await this.customerService.updateFamily(family).toPromise();
      this.onSuccess();
      this.editPrimaryRelationship = false;
      this.isEditing = false;
    } catch (error) {
      this.onSaveError(error);
    }
  }

  private onSaveError(response: any) {
    const errors = getProperty(response, "error.errors", null);
    this.snackBar.open(errors?.join(", ") || "Error updating details", "Error", { duration: 3000 });
  }

  onSuccess(reload = true) {
    this.closePrimaryEdit();
    if (reload) {
      this.reloadAfterSave.emit("Family Details");
    }
  }

  toggleEditDetails(event) {
    event.stopPropagation();
    this.isEditing = true;
    this.enablePrimaryEdit();
  }
  cancel(event: Event): void {
    event.stopPropagation();

    this.cancelPrimaryEdit();
  }
  save(event) {
    event.stopPropagation();
    this.savePrimary(this.primaryRelationship);
  }

  updateDate(dateObject = {}, instance: any = {}, instanceKey = "dateOfBirth") {
    let date = dateObject["value"];
    instance[instanceKey] = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
    instance["dateDisplay"] = date;
  }

}
