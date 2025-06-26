import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {  Observable } from "rxjs";
import { KREDILINE_SERVER_URL } from "src/app/app.constants";
import {
  GET_AML_DETAILS,
  INITIATE_AML,
  VERIFY_AML,
} from "src/app/shared/constants/Api.constants";

@Injectable({
  providedIn: "root",
})
export class AmlService {
  amlData: any;
  constructor(private readonly http: HttpClient) {}

  fetchAmlData(
    partnerCustomerId: any = null,
    partnerLoanId: any = null,
    branchCode: any = ""
  ): Observable<any> {
    const params = new HttpParams()
      .append("partnerCustomerId", partnerCustomerId)
      .append("partnerLoanId", partnerLoanId);
    return this.http.get(`${KREDILINE_SERVER_URL}${GET_AML_DETAILS}`, {
      params,
      headers: {
        "X-kaleidofin-BranchCode": branchCode,
      },
    });
  }

  initiateAML(
    applicantDetails: any = {},
    branchCode: any = ""
  ): Observable<any> {
    return this.http.post(
      `${KREDILINE_SERVER_URL}${INITIATE_AML}`,
      applicantDetails,
      {
        headers: {
          "X-kaleidofin-BranchCode": branchCode,
        },
      }
    );
  }

  verifyAmlDetails(
    applicantDetails: any = {},
    branchCode: any = null
  ): Observable<any> {
    return this.http.put(
      `${KREDILINE_SERVER_URL}${VERIFY_AML}`,
      applicantDetails,
      {
        headers: {
          "X-kaleidofin-BranchCode": branchCode,
        },
      }
    );
  }
}
