import { HttpClient, HttpParams } from "@angular/common/http";

import { Injectable } from "@angular/core";
import { EMPTY, Observable } from "rxjs";
import { KREDILINE_SERVER_URL } from "src/app/app.constants";
import {
  DEDUPE_MARK_CUSTOMER,
  GET_DEDUPE_LOANS,
  GET_LOANS_BY_CUSTOMER,
  REJECT_DEDUPE,
} from "src/app/shared/constants/Api.constants";
import { DedupeResponseDTO } from "./dedupe.models";
import { KcreditLoanService } from "../loan/kcredit-loan.service";

@Injectable({
  providedIn: "root",
})
export class DedupeService {
  constructor(
    private readonly http: HttpClient,
    private readonly loanApplicationService: KcreditLoanService
  ) {}

  fetchDedupeData(
    dedupeReferenceId: number,
    dedupeReferenceType: string = ""
  ): Observable<any> {
    const params = new HttpParams()
      .append("dedupeReferenceId", dedupeReferenceId)
      .append("dedupeReferenceType", dedupeReferenceType);
    return this.http.get(`${KREDILINE_SERVER_URL}${GET_DEDUPE_LOANS}`, {
      params,
    });
  }

  fetchLoansByCustomerNumber(customerNumber: number = null): Observable<any> {
    if (!customerNumber) return new Observable<any>();

    const params = new HttpParams().append("customerId", customerNumber);
    return this.http.get(`${KREDILINE_SERVER_URL}${GET_LOANS_BY_CUSTOMER}`, {
      params,
    });
  }

    markDedupe(
    customerId: number | null = null,
    dedupeGroupDtoList: DedupeResponseDTO[] = [],
    isExistingCustomer: boolean = false,
    dedupeReferenceId: number | null = null,
    dedupeReferenceType: string | null = null
  ): Observable<string> {
    if (!customerId) return EMPTY;

    const loanApplicationId = this.loanApplicationService.getLoanId();

    const payload = {
      parentCustomerId: customerId,
      isExistingCustomer,
      dedupeGroupDtoList,
      loanApplicationId,
      dedupeReferenceType: dedupeReferenceType?.trim() || null,
      dedupeReferenceId,
    };

    return this.http.post(
      `${KREDILINE_SERVER_URL}${DEDUPE_MARK_CUSTOMER}`,
      payload,
      { observe: "body", responseType: "text" }
    );
  }


  rejectDedupe(remark: string): Observable<any> {
    const loanId = this.loanApplicationService.getLoanId();
    const params = new HttpParams().append("loanId", loanId);
    const requestPayload = {
      loanApplicationId: loanId,
      remark,
    };
    return this.http.post(REJECT_DEDUPE, requestPayload, {
      params,
      responseType: 'text',
    });
  }
}
