import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/";
import {
  KALEIDO_SERVER_API_URL,
  KREDILINE_SERVER_URL,
} from "src/app/app.constants";

@Injectable()
export class KCreditService {
  constructor(private readonly http: HttpClient) {
  }

  convertLocalDateFromServer(date: string) {
    if (date !== undefined && date != null) {
      const split = date.split("-");
      const dateObj = {
        year: parseInt(split[0]),
        month: parseInt(split[1]),
        day: parseInt(split[2]),
      };
      return dateObj;
    } else {
      return undefined;
    }
  }

  generateSupportDocForms(
    partnerId: any,
    noOfFormsToBeGenerated,
    partnerNameInNachForm: any,
    nachMaxAmount,
    documentType: any,
    sequenceCurrentValue
  ): Observable<any> {
    let queryParam = "";
    queryParam += partnerId ? "partnerId=" + partnerId : "";
    queryParam += noOfFormsToBeGenerated
      ? "&noOfFormsToBeGenerated=" + noOfFormsToBeGenerated
      : "";
    queryParam += "&partnerNameInNachForm=" + partnerNameInNachForm;
    queryParam += nachMaxAmount ? "&nachMaxAmount=" + nachMaxAmount : "";
    queryParam += documentType ? "&documentType=" + documentType : "";
    queryParam += sequenceCurrentValue
      ? "&sequenceCurrentValue=" + sequenceCurrentValue
      : "";
    return this.http.get(
      `${KALEIDO_SERVER_API_URL}api/backoffice/partner/generatePartnerForms?${queryParam}`,
      null
    );
  }

  getFormSequenceData(partnerId: any): Observable<any> {
    return this.http.get(
      `${KALEIDO_SERVER_API_URL}api/backoffice/partner/getFormSequenceData/${partnerId}`,
      null
    );
  }

  public findFormGeneratedUsers(): Observable<any> {
    return this.http.get(
      `${KALEIDO_SERVER_API_URL}api/backoffice/partner/getSequenceUsers`
    );
  }

  getPartnerFormLogs(
    partnerIdList: any,
    generatedByUsers: any,
    formGeneratedMonth: any,
    formGeneratedYear: any
  ): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append("partnerIdList", partnerIdList);
    params = params.append("generatedByUsers", generatedByUsers);
    params = params.append("formGeneratedMonth", formGeneratedMonth);
    params = params.append("formGeneratedYear", formGeneratedYear);
    return this.http.get(
      `${KALEIDO_SERVER_API_URL}api/backoffice/partner/getPartnerFormLogs`,
      {
        params,
      }
    );
  }

  updateFormDownloadById(formSequenceLogId: any): Observable<any> {
    return this.http.put(
      `${KALEIDO_SERVER_API_URL}api/backoffice/partner/setFormDownload/${formSequenceLogId}`,
      null
    );
  }

  getBankDetail(id: number, customerId: number): Observable<any> {
    return this.http.get(
      `${KREDILINE_SERVER_URL}api/backoffice/bankDetail/${id}?customerId=${customerId}`
    );
  }

  updateBankAccountHolderName(
    customerSubscriptionId: number,
    bankAccountName: string
  ): Observable<any> {
    return this.http.post(
      `${KALEIDO_SERVER_API_URL}api/backoffice/nachMandate/updateBankAccountHolderName/${customerSubscriptionId}?nameToBePrintedOnNach=${bankAccountName}`,
      { responseType: "text" }
    );
  }

  updateBankDetailsOrCreate(
    entityId: number,
    bankDetailDTO: any
  ): Observable<any> {
    return this.http.put(
      `${KREDILINE_SERVER_URL}api/backoffice/customer/updateBankDetails/${entityId}`,
      bankDetailDTO
    );
  }

  validateBankDetail(
    bankDetailDTO: any,
    customerId: number,
    forceResetCount = false
  ): Observable<any> {
    return this.http.post(
      `${KREDILINE_SERVER_URL}api/backoffice/bankDetail/validateBankDetail/${bankDetailDTO.id}?validateAccount=${bankDetailDTO.validateAccount}&customerId=${customerId}&resetCheck=${forceResetCount}`,
      { responseType: "text" }
    );
  }
}
