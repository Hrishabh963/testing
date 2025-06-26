import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { KREDILINE_SERVER_URL } from "src/app/app.constants";
import { GET_EXTERNAL_CB_REPORT } from "src/app/shared/constants/Api.constants";
@Injectable({
  providedIn: "root",
})
export class CreditBureauService {
  cbReport = undefined;

  constructor(private readonly http: HttpClient) {}

  getExternalCbReport = (loanId: any) => {
    return this.http.get(
      `${KREDILINE_SERVER_URL}${GET_EXTERNAL_CB_REPORT}/${loanId}`
    );
  };
  getCbReport() {
    return this.cbReport;
  }
}
