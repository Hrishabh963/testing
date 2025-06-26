import { Component, Input } from '@angular/core';
import { ObligatorTypes } from '../../constant';
import { KcreditLoanDetailsModel } from '../../kcredit-loanDetails.model';

@Component({
    selector: 'jhi-witnesses',
    templateUrl: './witnesses.component.html',
    styleUrls: [
        '../../kcredit-loan.css'
    ]
})
export class WitnessComponent {
    @Input() loanDetails: KcreditLoanDetailsModel;
    @Input() disableEdit: boolean;
    readonly ObligatorTypes = ObligatorTypes;
    public witnesses: any[] = [];

    ngOnInit() {
        this.getWitness();
    }

    getWitness() {
        if(this.loanDetails.loanObligatorDTOList){
        if(this.loanDetails.loanObligatorDTOList){
            this.loanDetails.loanObligatorDTOList.forEach((x, i) => {
                // tslint:disable-next-line:triple-equals one-line
                if (x.type == ObligatorTypes.witness){
                    this.witnesses.push(x);
                }
            });
        }
        }
    }
}
