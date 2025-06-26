import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RETRY_BENEFICIARY_CHECK } from "src/app/shared/constants/Api.constants";

@Injectable({
  providedIn: "root",
})
export class BeneficiaryCheckService {
  constructor(private readonly http: HttpClient) {}

  retryBeneficiaryCheck(loanId: number = null): Observable<any> {
    const params = new HttpParams().append("loanApplicationId", loanId);
    return this.http.put(RETRY_BENEFICIARY_CHECK, null, { params });
  }
}
