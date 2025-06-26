import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  GET_KYC_VERIFICATION_STATUS,
  KYC_CONFIG,
  UPDATE_CUSTOMER_ADDRESS,
  VERIFY_KYC,
} from "src/app/shared/constants/Api.constants";

export const REVIEW_STATUS = ["REJECT", "Rejected", "ACCEPT", "Accepted"];

@Injectable({
  providedIn: "root",
})
export class KycVerificationService {
  constructor(private readonly http: HttpClient) {}

  getKycVerificationStatus(
    loanId: number = null,
    entityId: number = null,
    entityType: string = null
  ) {
    const params = new HttpParams()
      .append("entityType", entityType)
      .append("entityId", entityId);
    return this.http.get(`${GET_KYC_VERIFICATION_STATUS}/${loanId}`, {
      params,
    });
  }

  verifyKyc(requestPayload: any = null): Observable<any> {
    return this.http.post(`${VERIFY_KYC}`, requestPayload);
  }

  getKycVerificationConfig(loanId: number = null) {
    return this.http.get(`${KYC_CONFIG}/${loanId}`);
  }

  updateCustomerKyc(payload: any = {}) {
    return this.http.put(UPDATE_CUSTOMER_ADDRESS, payload, {
      observe: "response",
      responseType: "text",
    });
  }
}
