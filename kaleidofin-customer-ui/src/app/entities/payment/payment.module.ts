import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PaymentsComponent } from './payments/payments.component';
import { PAYMENT } from './payment.route';
import { SharedLibModule, SharedModule } from 'src/app/shared';

@NgModule({
  declarations: [PaymentsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(PAYMENT),
    SharedLibModule,
    SharedModule,
  ],
  providers: [CurrencyPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PaymentModule {}
