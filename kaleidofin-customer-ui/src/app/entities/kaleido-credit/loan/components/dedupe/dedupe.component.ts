import { Component, Input, Output, EventEmitter } from '@angular/core';
import { KcreditLoanDetailsModel } from '../../kcredit-loanDetails.model';
@Component({
  selector: 'jhi-dedupe',
  templateUrl: './dedupe.component.html',
  styleUrls: ['../../kcredit-loan.css'],
})
export class DedupeComponent {
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() disableEdit: boolean;
  @Input() dedupeData: any;
  public initialData: any;
  public isEditing: boolean;
  
  @Output() reloadAfterSave = new EventEmitter<any>();
  @Output() saveProfileChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this.isEditing = false;
    this.saveProfileChange = new EventEmitter();
  }

  public cancel(): void {
    this.isEditing = false;
  }

  public edit(): void {
    this.isEditing = true;
  }

  


}
