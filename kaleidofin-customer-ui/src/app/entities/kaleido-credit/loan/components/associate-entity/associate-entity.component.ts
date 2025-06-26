import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CustomerService } from "../../../services/customer/customer.service";
import { KcreditLoanDetailsModel } from "../../kcredit-loanDetails.model";
import { getProperty } from "src/app/utils/app.utils";

const jsonKeyMapper = {
  idProofNo: "ID Proof no",
  idProofType: "ID Proof type",
  nameOfEntity: "Name of entity",
  natureOfBusiness: "Nature of business",
  netSales: "Net sales",
  netWorth: "Net worth",
  netProfit: "Net profit",
};

@Component({
  selector: "jhi-associate-entity",
  templateUrl: "./associate-entity.component.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class AssociateEntityComponent implements OnInit {
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() disableEdit: boolean;
  public profile: any;
  public initialProfile: any;
  public isEditing: boolean;
  @Output() reloadAfterSave = new EventEmitter<any>();
  panelOpenState: boolean = true;

  @Output()
  saveProfileChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private readonly customerService: CustomerService,
    private readonly snackBar: MatSnackBar
  ) {
    this.isEditing = false;
    this.saveProfileChange = new EventEmitter();
    this.profile = {};
    this.initialProfile = {};
  }

  ngOnInit() {
    const profileInfo = JSON.parse(getProperty(this.loanDetails,'customerDTO.profile',{}));
    this.updateInitialProfileData(profileInfo);
  }

  updateInitialProfileData(profileInfo = {}) {
    const businessInfo = profileInfo["Associate Entity"] || {};
    for (const key in jsonKeyMapper) {
      if (jsonKeyMapper.hasOwnProperty(key)) {
        this.profile[key] = businessInfo[jsonKeyMapper[key]];
      }
    }
    this.initialProfile = { ...this.profile };
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    this.updateInitialProfileData();
  }

  reverseKeyMappingOnSave() {
    const newMapper = {};
    for (const key in jsonKeyMapper) {
      if (jsonKeyMapper.hasOwnProperty(key)) {
        newMapper[jsonKeyMapper[key]] = this.profile[key];
      }
    }
    return newMapper;
  }
  toggleEditDetails(event) {
    event.stopPropagation();
    this.isEditing = !this.isEditing;
  }
  cancel(event: Event): void {
    event.stopPropagation();
    this.cancelEdit();
  }
  save(event) {
    event.stopPropagation();
    this.saveInformation();
  }

  public cancelEdit(): void {
    this.isEditing = false;
    this.profile = { ...this.initialProfile };
  }

  public saveInformation(): void {
    const formData = this.reverseKeyMappingOnSave();
    const payload = {
      ...JSON.parse(this.loanDetails.customerDTO.profile),
      "Associate Entity": formData,
    };
    this.customerService
      .updateProfile(this.loanDetails.customerDTO.id, payload)
      .subscribe(
        (response) => {
          this.isEditing = false;
          this.reloadAfterSave.emit("Associate Entity");
          this.snackBar.open("Remarks", "Successfully Saved!", {
            duration: 3000,
          });
          const profileInfo = JSON.parse(getProperty(response,'profile',{}));
          this.updateInitialProfileData(profileInfo);

        },
        (response) => {
          this.snackBar.open("Error in saving record", "Error", {
            duration: 3000,
          });
        }
      );
  }
}
