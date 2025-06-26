import {
  Component,
  EventEmitter,
  Input,
  Output
} from "@angular/core";
import { updateName } from "src/app/shared";
import { FamilyDetails } from "../../../models/customer/family-details.model";
import { CustomerService } from "../../../services/customer/customer.service";
import { getProperty } from "src/app/utils/app.utils";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "jhi-family-member",
  templateUrl: "./family-member.component.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class FamilyMemberComponent {
  @Input() disableEdit: boolean;
  @Output() reloadAfterSave = new EventEmitter<any>();
  @Input() familyMember: FamilyDetails;
  @Input() index: number;

  initialFamilyMember: FamilyDetails;
  editFamilyInfo: boolean = false;
  error: boolean;
  maxDate;
  minDate;
  year;
  month;
  day;

  constructor(
    private readonly customerService: CustomerService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.maxDate = new Date();
    this.maxDate = {
      year: this.maxDate.getFullYear(),
      month: this.maxDate.getMonth() + 1,
      day: this.maxDate.getDate(),
    };
    this.minDate = { year: 1930, month: 1, day: 1 };
    if (this.familyMember && typeof this.familyMember.dob === "string") {
      this.familyMember.dob = this.customerService.convertLocalDateFromServer(
        this.familyMember.dob
      );
    }
    this.initialFamilyMember = { ...this.familyMember };
  }

  enableEdit() {
    this.editFamilyInfo = true;
  }

  cancelEdit() {
    this.editFamilyInfo = false;
    this.familyMember = { ...this.initialFamilyMember };
  }

  closeEdit() {
    this.editFamilyInfo = false;
  }

  saveFamily(family) {
    family = updateName(family, "relationName");
    family["dob"] = family["dateOfBirth"];
    this.customerService.updateFamily(family).subscribe(
      (res) => this.onSuccess(res),
      (res) => this.onSaveError(res)
    );
  }

  private onSaveError(response: any) {
    const errors = getProperty(response, "error.errors", null);
    this.snackBar.open(errors?.join(", ") || "Error updating details", "Error", { duration: 3000 });
  }


  onSuccess(res) {
    this.closeEdit();
    this.reloadAfterSave.emit("Family Details");
  }

  toggleEditDetails() {
    this.editFamilyInfo = true;
  }
  cancel() {
    this.cancelEdit();
  }

  save(familyMember) {
    this.saveFamily(familyMember);
  }

  updateDate(dateObject = {}, instance = {}) {
    let date = dateObject["value"];
    instance["dateOfBirth"] = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }
}
