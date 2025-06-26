import { Component, Input, Output, OnInit,EventEmitter } from "@angular/core";
import { KcreditLoanDetailsModel } from "../../kcredit-loanDetails.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CustomerService } from "../../../services/customer/customer.service";

const jsonKeyMapper = {
  netWorth: "Net worth",
  netProfitAfterTax: "Net profit after tax",
  netSales: "Net sales",
  operatingProfit: "Operating profit",
};

@Component({
  selector: "jhi-financial-details-item",
  templateUrl: "./financial-details-item.component.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class FinancialDetailsItemComponent implements OnInit {
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() disableEdit: boolean;
  @Input() financialDetail: string;
  @Input() index: number;
  public profile: any;
  public initialProfile: any;
  public isEditing: boolean;
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
    const familyAssets = profileInfo[this.financialDetail] || {};
    for (const key in jsonKeyMapper) {
      if (jsonKeyMapper.hasOwnProperty(key)) {
        this.profile[key] = familyAssets[jsonKeyMapper[key]];
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

  public cancel(): void {
    this.isEditing = false;
    this.profile = {...this.initialProfile};
  }

  public edit(): void {
    this.isEditing = true;
  }

  public save(): void {
    const formData = this.reverseKeyMappingOnSave();
    let newObj = {};
    newObj[this.financialDetail] = formData;
   const payload = {
      ...JSON.parse(this.loanDetails.customerDTO.profile),
      ...newObj
    };
    this.customerService
      .updateProfile(this.loanDetails.customerDTO.id, payload)
      .subscribe(
        () => {
          this.isEditing = false;
          this.reloadAfterSave.emit("Financial Details");
        },
        (response) => {
          console.error(response);
          this.snackBar.open("Error in saving record", "Error", {
            duration: 3000,
          });
        }
      );
  }
}
