import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KREDILINE_SERVER_URL } from 'src/app/app.constants';
import { INITIATE_FRAUD_CHECK, VERIFY_FRAUD_CHECK } from 'src/app/shared/constants/Api.constants';

@Injectable({
  providedIn: "root",
})
export class FraudCheckService {
  constructor(private readonly http: HttpClient) {}

  initiateFraudCheck( partnerCustomerId: any = null, partnerLoanId: any = null): Observable<any> {
    const params = new HttpParams()
      .append("partnerCustomerId", partnerCustomerId)
      .append("partnerLoanId", partnerLoanId);

    return this.http.get(`${KREDILINE_SERVER_URL}${INITIATE_FRAUD_CHECK}`, {
      params,
    });
  }

  verifyCheck(loanApplicationId: any = null): Observable<any> {
    const params = new HttpParams().append("loanApplicationId",loanApplicationId);

    return this.http.put(`${KREDILINE_SERVER_URL}${VERIFY_FRAUD_CHECK}`, null, {
      params,
    });
  }
}
