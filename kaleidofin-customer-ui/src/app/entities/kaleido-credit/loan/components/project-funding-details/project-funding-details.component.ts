import { Component, Input, Output, OnInit,EventEmitter } from "@angular/core";
import { KcreditLoanDetailsModel } from "../../kcredit-loanDetails.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CustomerService } from "../../../services/customer/customer.service";

const jsonKeyMapper = {
  ltvInPer: "LTV %",
  bankFund: "Loan (Bank fund)",
  ownFunds: "Own funds",
  pslClassification: "PSL Classification",
  total: "Total",
};

@Component({
  selector: "jhi-project-funding-details",
  templateUrl: "./project-funding-details.component.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class ProjectFundingDetailsComponent implements OnInit {
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() disableEdit: boolean;
  public profile: any;
  public initialProfile: any;
  public isEditing: boolean;
  @Output() reloadAfterSave = new EventEmitter<any>();

  @Output()
  saveProfileChange: EventEmitter<any> = new EventEmitter<any>();
  panelOpenState: boolean = true;

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
    const businessInfo = profileInfo["Project Funding Details"] || {};
    for (const key in jsonKeyMapper) {
      if (jsonKeyMapper.hasOwnProperty(key)) {
        this.profile[key] = businessInfo[jsonKeyMapper[key]];
      }
    }
    this.initialProfile = {...this.profile};
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    this.initialMappingOfField();
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
        "Project Funding Details": formData
      };
    this.customerService
      .updateProfile(this.loanDetails.customerDTO.id, payload)
      .subscribe(
        () => {
          this.isEditing = false;
          this.reloadAfterSave.emit("Project Funding Details");
          this.snackBar.open("Remarks", "Successfully Saved!", {
            duration: 3000,
          });
        },
        (response) => {
          this.snackBar.open("Error in saving record", "Error", {
            duration: 3000,
          });
        }
      );
  }
}
