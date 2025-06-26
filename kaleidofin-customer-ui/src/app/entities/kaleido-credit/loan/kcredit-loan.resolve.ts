import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';

import { KcreditLoanService} from './kcredit-loan.service';
import { KcreditLoanDetailsModel } from './kcredit-loanDetails.model';

@Injectable()
export class KcreditLoanResolve implements Resolve<KcreditLoanDetailsModel> {

    constructor(private readonly service: KcreditLoanService) {}

    resolve(route: ActivatedRouteSnapshot) {
        if (route.paramMap.get('id')) {
            return this.service.find(+route.paramMap.get('id'));
        }else {
            return new KcreditLoanDetailsModel();
        }
    }
}
