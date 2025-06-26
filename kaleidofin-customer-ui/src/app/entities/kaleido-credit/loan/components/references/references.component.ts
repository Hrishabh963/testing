import { Component, Input } from '@angular/core';
import { ObligatorTypes } from '../../constant';
import { KcreditLoanDetailsModel } from '../../kcredit-loanDetails.model';

@Component({
    selector: 'jhi-references',
    templateUrl: './references.component.html',
    styleUrls: [
        '../../kcredit-loan.css'
    ]
})
export class ReferencesComponent {
    @Input() loanDetails: KcreditLoanDetailsModel;
    @Input() disableEdit: boolean;
    readonly ObligatorTypes = ObligatorTypes;
    public references: any[] = [];

    ngOnInit() {
        this.getReferences();
    }

    getReferences() {
        if(this.loanDetails.loanObligatorDTOList){
        if(this.loanDetails.loanObligatorDTOList){
            this.loanDetails.loanObligatorDTOList.forEach((x, i) => {
                // tslint:disable-next-line:triple-equals one-line
                if (x.type == ObligatorTypes.reference){
                    this.references.push(x);
                }
            });
        }
        }
    }
}
