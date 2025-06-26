import { Routes } from '@angular/router';
import { DiscoverComponent } from './discover/discover.component';
import { PaymentMandateComponent } from '../payment-mandate/payment-mandate/payment-mandate.component';
import { HelpAndSupportComponent } from 'src/app/molecules/help-and-support/help-and-support.component';
import { LandingComponent } from '../kaleido-credit/organisms/landing/landing.component';

export const DASHBOARD: Routes = [
  {
    path: 'dashboard/home',
    redirectTo: "nachForms/prefilledNachForms"
    // component: DashboardComponent,
  },
  {
    path:'paymentMandate',
    component: PaymentMandateComponent
  },
  {
    path: 'contact',
    component: HelpAndSupportComponent,
    
  },
  {
    path: 'reset',
    component: LandingComponent,
    data: {currentPage: "Forgot Password"}
    
  },
  {
    path: 'discover',
    component: DiscoverComponent,
  },
];
