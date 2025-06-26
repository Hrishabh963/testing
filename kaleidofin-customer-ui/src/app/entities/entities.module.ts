import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { SharedModule } from "../shared";
import { FileValidation } from "../shared/util/file-validation.service";
import { CustomerModule } from "./customer/customer.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { DemandModule } from "./demand/demand.module";
import { KaleidoCreditModule } from "./kaleido-credit/kaleido-credit.module";
import { NachFormModule } from "./nach-form/nach-form.module";
import { PaymentModule } from "./payment/payment.module";
import { PaymentMandateModule } from "./payment-mandate/payment-mandate.module";

@NgModule({
  // prettier-ignore
  imports: [
      SharedModule,
      CustomerModule,
      DashboardModule,
      PaymentModule,
      DemandModule,
      NachFormModule,
      KaleidoCreditModule,
      PaymentMandateModule
    ],
  declarations: [],
  entryComponents: [],
  providers: [FileValidation],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EntitiesModule {}
