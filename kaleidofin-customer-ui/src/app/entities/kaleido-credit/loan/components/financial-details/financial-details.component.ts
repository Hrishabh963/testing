import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KcreditLoanDetailsModel } from '../../kcredit-loanDetails.model';


@Component({
    selector: 'jhi-financial-details',
    templateUrl: './financial-details.component.html',
    styleUrls: ['../../kcredit-loan.css'],
})
export class FinancialDetailsComponent {
    @Input() loanDetails: KcreditLoanDetailsModel;
    @Input() disableEdit: boolean;
    @Output() reloadAfterSave = new EventEmitter<any>();
    error: boolean;
    public financialDetails: any[];

    ngOnInit() {
        const profileInfo = JSON.parse(this.loanDetails.customerDTO.profile);
       this.financialDetails = ['Financial details of applicant for Year 1',
       'Financial details of applicant for Year 2',
       'Financial details of applicant for Year 3'].filter((i) => profileInfo[i]);
    }

    onSuccess(res){
        this.reloadAfterSave.emit('Financial Details');
    }
}
