import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Routes } from '@angular/router';
import { Observable } from 'rxjs';
import { UserRouteAccessService } from 'src/app/core';
import { BranchAndCenterDTO } from './branch.model';
import { CustomerDetails } from './customer-detail.model';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerService } from './customer.service';
import { CustomersComponent } from './customers/customers.component';

@Injectable()
export class BranchAndCenterResolver  implements Resolve<any> {
  constructor(private readonly customerService: CustomerService) {}

  resolve(): Observable<BranchAndCenterDTO> {
    return this.customerService.getBranchAndCenters();
  }
}

@Injectable()
export class CustomerDetailsResolver implements Resolve<any> {
  constructor(private readonly customerService: CustomerService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<CustomerDetails> {
    return this.customerService.getCustomerDetails(
      Number(route.paramMap.get("customerId"))
    );
  }
}

export const CUSTOMER: Routes = [
  {
    path: "customers",
    component: CustomersComponent,
    resolve: {
      resolveData: BranchAndCenterResolver
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: "customerDetail/:customerId",
    component: CustomerDetailComponent,
    resolve: {
      resolveData: CustomerDetailsResolver
    },
    canActivate: [UserRouteAccessService]
  }
];
