import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  CLOSE_PAYMENT_MANDATE,
  GENERATE_MANDATE_REPORTS,
  GET_ALL_PARTNER_REPORTS,
  GET_MANDATE_TRANSACTIONS,
  GET_PARTNER_PAYMENT_MANDATES,
  SEARCH_PAYMENT_MANDATES,
} from "src/app/shared/constants/Api.constants";
import { getProperty } from "src/app/utils/app.utils";
import {
  MANDATE_STATUS_MAP,
  PaymentMandateData,
} from "./payment-mandate.constants";

@Injectable({
  providedIn: "root",
})
export class PaymentMandateService {
  constructor(private readonly http: HttpClient) {}

  modifyData(dataSource: Array<PaymentMandateData> = []) {
    dataSource.forEach((data) => {
      let status = getProperty(data, "status", "");
      const statusField = MANDATE_STATUS_MAP[status];
      data["statusLabel"] = getProperty(statusField, "label", status);
      data["cssClass"] = getProperty(statusField, "cssClass", status);
    });
  }

  getMandateTransactions(
    mandateReferenceId: string = "",
    page: number = 0,
    size: number = 5,
    sort = "id,desc"
  ): Observable<any> {
    const params = new HttpParams()
      .append("mandateReferenceId", mandateReferenceId)
      .append("size", size)
      .append("page", page)
      .append("sort", sort);
    return this.http.get(GET_MANDATE_TRANSACTIONS, { params });
  }
  getPartnerPaymentMandates(
    page: number = 0,
    size: number = 5,
    sort = "id,desc"
  ): Observable<any> {
    let params = new HttpParams()
      .append("size", size)
      .append("page", page)
      .append("sort", sort);
    return this.http.get(GET_PARTNER_PAYMENT_MANDATES, { params });
  }
  generateMandateReports(payload: any = {}): Observable<any> {
    return this.http.post(GENERATE_MANDATE_REPORTS, payload, {
      observe: "response",
      responseType: "text",
    });
  }
  getAllMandateReports(size: number = 5, page: number = 0, sort = "") {
    const params = new HttpParams()
      .append("size", size)
      .append("page", page)
      .append("sort", sort);
    return this.http.get(GET_ALL_PARTNER_REPORTS, { params });
  }
  validateOtp(
    requestId: string = "",
    verificationCode: string = "",
    requestType: string = "VALIDATE"
  ) {
    const requestPayload = {
      otp: {
        requestType,
        requestId,
        verificationCode,
        api: "SI_DELETION",
      },
    };
    return this.http.post(CLOSE_PAYMENT_MANDATE, requestPayload);
  }

  resendOtp(requestId: string = "", requestType: string = "RESEND") {
    const requestPayload = {
      otp: {
        requestType,
        requestId,
      },
    };
    return this.http.post(CLOSE_PAYMENT_MANDATE, requestPayload);
  }
  closeMandate(mandateInfo: any, reason: string = "", remarks: string = "") {
    const requestPayload = {
      mandateDetails: {
        customerId: getProperty(mandateInfo, "customerId", null),
        loanId: getProperty(mandateInfo, "loanId", null),
        mandateReferenceId: getProperty(
          mandateInfo,
          "mandateReferenceId",
          null
        ),
        reason,
        remarks,
      },
    };

    return this.http.post(CLOSE_PAYMENT_MANDATE, requestPayload);
  }

  searchPaymentMandates(
    payload: Object = {},
    page: number = 0,
    size = 5,
    sort = "id,desc"
  ) {
    const params = new HttpParams()
      .append("page", page)
      .append("size", size)
      .append("sort", sort);
    return this.http.post(SEARCH_PAYMENT_MANDATES, payload, { params });
  }
}

export const TRANSACTIONS_MOCK_DATA = [
  {
    mandateReferenceId: "12",
    siTransactionId: "34",
    dueDate: "23-06-2023",
    executionDate: "23-06-2023",
    amount: 400.0,
    status: "SUCCESS",
    errorCode: "",
    errorDescription: null,
    customerUtrNo: null,
    partnerUtrNo: null,
    noOfRetryLeft: null,
  },
  {
    mandateReferenceId: "12",
    siTransactionId: "45",
    dueDate: "23-06-2023",
    executionDate: "23-06-2023",
    amount: 500.0,
    status: "SUCCESS",
    errorCode: null,
    errorDescription: "failed duw to some server error",
    customerUtrNo: "utrNo",
    partnerUtrNo: "partnerUtrNo",
    noOfRetryLeft: null,
  },
];
