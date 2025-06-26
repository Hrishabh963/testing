import { Routes } from '@angular/router';
import {OverviewComponent} from '../overview/overview.component';
import {KCreditReportComponent} from '../report/kcredit-report.component';
import {KcreditUploadComponent} from '../upload/kcredit-upload.component';
import { UserRouteAccessService } from "../../../core/auth/user-route-access.service";

export const KCredit: Routes = [{
    path: '',
    children: [
        {
            path: 'loanentry',
            component: OverviewComponent,
            data: {

            },
            canActivate: [UserRouteAccessService],
        },
        {
            path: 'loanreview',
            component: KCreditReportComponent,
            data: {

            },
            canActivate: [UserRouteAccessService],
        },
        {
            path: 'loanagreement',
            component: KcreditUploadComponent,
            data: {

            },
            canActivate: [UserRouteAccessService],
        }
    ]
}];
