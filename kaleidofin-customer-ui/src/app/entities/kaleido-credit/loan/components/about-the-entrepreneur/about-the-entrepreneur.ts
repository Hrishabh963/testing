import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";
import { KcreditLoanDetailsModel } from "../../kcredit-loanDetails.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CustomerService } from "../../../services/customer/customer.service";

const jsonKeyMapper = {
  coverage: "Coverage under PMSBY/ PMJJBY/ APY",
  validity: "Validity period of PMSBY/ PMJJBY/ APY",
  educationalQualification: "Educational Qualification",
  caste: "Caste",
  landHolding: "Land Holding",
  houseType: "House Type",
  profession: "Profession",
};

@Component({
  selector: "jhi-about-the-entrepreneur",
  templateUrl: "./about-the-entrepreneur.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class AboutTheEntrepreneurComponent implements OnInit {
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() disableEdit: boolean;
  public profile: any;
  public isEditing: boolean;
  public initialProfile: any;
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

  initialMappingOfField() {
    const profileInfo = JSON.parse(this.loanDetails.customerDTO.profile);
    for (const key in jsonKeyMapper) {
      if (jsonKeyMapper.hasOwnProperty(key)) {
        this.profile[key] = profileInfo[jsonKeyMapper[key]];
      }
    }
    this.initialProfile = { ...this.profile };
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

  public cancelEdit(): void {
    this.isEditing = false;
    this.profile = { ...this.initialProfile };
  }

  ngOnChanges() {
    this.initialMappingOfField();
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

  public saveInformation(): void {
    const formData = this.reverseKeyMappingOnSave();
    const payload = {
      ...JSON.parse(this.loanDetails.customerDTO.profile),
      ...formData,
    };
    this.customerService
      .updateProfile(this.loanDetails.customerDTO.id, payload)
      .subscribe(
        () => {
          this.isEditing = false;
          this.initialProfile = { ...this.profile };
          this.reloadAfterSave.emit("About the entrepreneur");
          this.snackBar.open("Remarks", "Successfully Saved!", {
            duration: 3000,
          });
        },
        () => {
          this.snackBar.open("Error in saving record", "Error", {
            duration: 3000,
          });
        }
      );
  }
}
