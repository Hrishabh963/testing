import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MandateDetailComponent } from './mandate-detail/mandate-detail.component';
import { RouterModule } from '@angular/router';
import { PAYMENT_MANDATE } from './payment-mandate.route';
import { SharedLibModule, SharedModule } from 'src/app/shared';
import { MandateDateFilterComponent } from './mandate-date-filter/mandate-date-filter.component';
import { MandateDownloadComponent } from './mandate-download/mandate-download.component';
import { DownloadSearchFilterComponent } from './mandate-download/download-search-filter/download-search-filter.component';
import { DownloadResultsComponent } from './mandate-download/download-results/download-results.component';
import { PaymentMandateComponent } from './payment-mandate/payment-mandate.component';
import { MandateDetailSummaryComponent } from './mandate-detail/mandate-detail-summary/mandate-detail-summary.component';
import { MandateDetailTransactionsComponent } from './mandate-detail/mandate-detail-transactions/mandate-detail-transactions.component';
import { DownloadTransactionsDialogComponent } from './mandate-detail/download-transactions-dialog/download-transactions-dialog.component';
import { CloseMandateComponent } from './mandate-detail/close-mandate/close-mandate.component';
import { CloseMandateStatusComponent } from './mandate-detail/close-mandate/close-mandate-status/close-mandate-status.component';
import { ConfirmOtpComponent } from './mandate-detail/close-mandate/confirm-otp/confirm-otp.component';

@NgModule({
  declarations: [
    PaymentMandateComponent,
    MandateDetailComponent,
    MandateDateFilterComponent,
    MandateDownloadComponent,
    DownloadSearchFilterComponent,
    DownloadResultsComponent,
    MandateDetailSummaryComponent,
    MandateDetailTransactionsComponent,
    DownloadTransactionsDialogComponent,
    CloseMandateComponent,
    CloseMandateStatusComponent,
    ConfirmOtpComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PAYMENT_MANDATE),
    SharedLibModule,
    SharedModule,
  ],
  exports: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PaymentMandateModule { }
