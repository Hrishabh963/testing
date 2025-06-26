import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { KREDILINE_SERVER_URL } from "src/app/app.constants";
import { GET_LENDER_CAMS_REPORT } from "src/app/shared/constants/Api.constants";
@Injectable({
  providedIn: "root",
})
export class CamsService {
  constructor(private readonly http: HttpClient) {}

  getCamsReport(loanId: number = null): Observable<any> {
    const params = new HttpParams().append("loanApplicationId", loanId);
    return this.http.get(`${KREDILINE_SERVER_URL}${GET_LENDER_CAMS_REPORT}`, {
      params,
    });
  }
}
