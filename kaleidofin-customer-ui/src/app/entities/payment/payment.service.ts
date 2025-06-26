import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SERVER_API_URL } from "src/app/app.constants";
import { PaymentPage } from "./payment.model";

@Injectable({
  providedIn: "root"
})
export class PaymentService {
  constructor(private readonly http: HttpClient) {}

  getPaymentsList(
    startDate: string,
    endDate: string,
    size: number,
    page: number,
    sort: string,
    order: string
  ): Observable<PaymentPage> {
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
    return this.http.post(`${SERVER_API_URL}api/partner/payments/list${params}`,
      null
    );
  }
}
