import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KcreditLoanDetailsModel } from '../../kcredit-loanDetails.model';


@Component({
    selector: 'jhi-existing-loans',
    templateUrl: './existing-loans.component.html',
    styleUrls: ['../../kcredit-loan.css'],
})
export class ExistingLoansComponent {
    @Input() loanDetails: KcreditLoanDetailsModel;
    @Input() disableEdit: boolean;
    @Output() reloadAfterSave = new EventEmitter<any>();
    public existingLoans: any[] = [];
    error: boolean;

    ngOnInit() {
        this.existingLoans = this.loanDetails.existingLoansDTOList;
    }

    onSuccess(res){
        this.reloadAfterSave.emit('Existing Loans');
    }
}

