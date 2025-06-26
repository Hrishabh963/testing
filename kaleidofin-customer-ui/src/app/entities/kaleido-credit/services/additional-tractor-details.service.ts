import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { KREDILINE_SERVER_URL } from "src/app/app.constants";
import { GET_LENDER_ATD_REPORTS } from "src/app/shared/constants/Api.constants";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AdditionalTractorDetailsService {
  constructor(private readonly http: HttpClient) {}

  getAdditionalTractorDetailsReport(loanId: number = null): Observable<any> {
    const params = new HttpParams().append("loanApplicationId", loanId);
    return this.http.get(`${KREDILINE_SERVER_URL}${GET_LENDER_ATD_REPORTS}`, {
      params,
    });
  }
}
