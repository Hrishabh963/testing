import { Component, Input, Output, OnInit,EventEmitter } from "@angular/core";
import { KcreditLoanDetailsModel } from "../../kcredit-loanDetails.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CustomerService } from "../../../services/customer/customer.service";

const jsonKeyMapper = {
  livestock: "Livestock",
  agricultureImplements: "Agrl. Implements",
  vehicles: "Vehicles",
  factoryPremise: "Factory Premise",
  house: "House",
  jewellery: "Jewellery",
  lands: "Lands",
  others: "Others",
  residential: "Residential",
};

@Component({
  selector: "jhi-family-assets",
  templateUrl: "./family-assets.component.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class FamilyAssetsComponent implements OnInit {
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() disableEdit: boolean;
  public profile: any;
  public initialProfile: any;
  public isEditing: boolean;
  panelOpenState: boolean = true;

  @Output() reloadAfterSave = new EventEmitter<any>();

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
    this.initialMappingOfField();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    this.initialMappingOfField();
  }

  initialMappingOfField() {
    const profileInfo = JSON.parse(this.loanDetails.customerDTO.profile);
    const familyAssets = profileInfo["Family Assets"] || {};
    for (const key in jsonKeyMapper) {
      if (jsonKeyMapper.hasOwnProperty(key)) {
        this.profile[key] = familyAssets[jsonKeyMapper[key]];
      }
    }
    this.initialProfile = {...this.profile};
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
    this.profile = {...this.initialProfile};
  }

  public saveInformation(): void {
    const formData = this.reverseKeyMappingOnSave();
    const payload = {
      ...JSON.parse(this.loanDetails.customerDTO.profile),
      "Family Assets": formData
    };
    this.customerService
      .updateProfile(this.loanDetails.customerDTO.id, payload)
      .subscribe(
        () => {
          this.isEditing = false;
          this.reloadAfterSave.emit("Family Assets");
        },
        (response) => {
          this.snackBar.open("Error in saving record", "Error", {
            duration: 3000,
          });
        }
      );
  }
}
