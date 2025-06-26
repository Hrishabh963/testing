import { Component, Input } from '@angular/core';
import {KcreditLoanDetailsModel} from '../../kcredit-loanDetails.model';

@Component({
  selector: 'jhi-agent-info',
  templateUrl: './agent-info.component.html',
    styleUrls: [
        '../../kcredit-loan.css'
    ]
})
export class AgentInfoComponent {
    @Input() loanDetails: KcreditLoanDetailsModel;
    @Input() disableEdit: boolean;
}
