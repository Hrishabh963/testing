import { Component, Input, Output, OnInit,EventEmitter } from '@angular/core';
import { KcreditLoanDetailsModel } from '../../kcredit-loanDetails.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../../services/customer/customer.service';

const jsonKeyMapper = {
  address: 'Address',
  contactPersonDetails: 'Contact Person details',
  contactNo: 'Contact no',
  direct: 'Direct Agri, Jhadi & Village industries  etc',
  nameOfEntity: 'Name of entity',
  relationshipWith: 'Relationship with'
};

@Component({
  selector: 'jhi-trade-references-item',
  templateUrl: './trade-references-item.component.html',
  styleUrls: ['../../kcredit-loan.css'],
})
export class TradeReferencesItemComponent implements OnInit {
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() disableEdit: boolean;
  @Input() tradeReference: string;
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
    const familyAssets = profileInfo[this.tradeReference] || {};
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
    const  newMapper = {};
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
    const formData =  this.reverseKeyMappingOnSave();
    let newObj = {};
    newObj[this.tradeReference] = formData
    const payload = {
        ...JSON.parse(this.loanDetails.customerDTO.profile),
        ...newObj
      };
    this.customerService.updateProfile(this.loanDetails.customerDTO.id, payload).subscribe(
        () => {
          this.isEditing = false;
          this.reloadAfterSave.emit('Trade Reference');
          this.snackBar.open('Remarks', 'Successfully Saved!', {
            duration: 3000,
          });
        },
        () => {
          this.snackBar.open('Error in saving record', 'Error', {
            duration: 3000,
          });
        }
    );
  }
}
