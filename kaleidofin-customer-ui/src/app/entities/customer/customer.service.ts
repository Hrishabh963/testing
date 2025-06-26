import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from 'src/app/app.constants';
import { BranchAndCenterDTO, SearchDTO } from './branch.model';
import { CustomerDetails } from './customer-detail.model';
import { CustomerPage } from './customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private readonly http: HttpClient) {}

  getCustomersList(
    startDate: string,
    endDate: string,
    size: number,
    page: number,
    sort: string,
    order: string,
    search: SearchDTO
  ): Observable<CustomerPage> {
    let params = `?startDate=` + startDate + `&endDate=` + endDate;
    if (size != null) {
      params = params + `&size=` + size;
    }
    if (page != null) {
      params = params + `&page=` + page;
    }
    if (sort != null) {
      params = params + `&sort=` + sort;
      if (order != null) {
        params = params + `,` + order;
      }
    }
    return this.http.post(
      `${SERVER_API_URL}api/partner/customers/list${params}`,
      search
    );
  }

  getCustomerDetails(customerId: number): Observable<CustomerDetails> {
    let params = `?customerId=` + customerId;
    return this.http.get(
      SERVER_API_URL + `api/partner/customers/details` + params
    );
  }

  getBranchAndCenters(): Observable<BranchAndCenterDTO> {
    return this.http.get(SERVER_API_URL + `api/partner/branches`);
  }
}
