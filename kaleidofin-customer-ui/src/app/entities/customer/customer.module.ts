import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedLibModule } from '../../shared/shared-libs.module';
import { SharedModule } from '../../shared/shared.module';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import {
  BranchAndCenterResolver,
  CUSTOMER,
  CustomerDetailsResolver,
} from './customer.route';
import { CustomersComponent } from './customers/customers.component';

@NgModule({
  declarations: [CustomerDetailComponent, CustomersComponent],
  imports: [RouterModule.forChild(CUSTOMER), SharedModule, SharedLibModule],
  providers: [BranchAndCenterResolver, CustomerDetailsResolver],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CustomerModule {}
