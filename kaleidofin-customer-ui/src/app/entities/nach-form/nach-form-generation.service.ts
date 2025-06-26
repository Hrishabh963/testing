import { HttpClient, HttpEvent, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SAMPLE_NACH_FORM_TEMPLATE } from "src/app/shared/constants/Api.constants";
import { KALEIDO_SERVER_API_URL } from "../../app.constants";
import { JobDetailsDTO } from "../demand/jobdetails.model";

@Injectable({
  providedIn: "root",
})
export class NachFormService {
  constructor(private readonly http: HttpClient) {}
  readonly UPLOAD_API = "api/partnerBackOffice/upload/nachMandateExcelUpload";
  readonly DOWNLOAD_API = "api/partner/upload/download";

  uploadNachForm(
    jobName: string,
    formData: FormData,
    ...rest
  ): Observable<HttpEvent<JobDetailsDTO>> {
    const [partnerId, docType, nachMaxAmount] = rest;
    let querryparam = `?partnerId=${partnerId}&documentType=${docType}&nachMaxAmount=${nachMaxAmount}&jobName=${jobName}`;
    return this.http.post<JobDetailsDTO>(
      `${KALEIDO_SERVER_API_URL}api/partnerBackOffice/upload/generatePartnerNachForms${querryparam}`,
      formData,
      {
        reportProgress: true,
        observe: "events",
      }
    );
  }

  getNACHtaskList(
    startDate: any,
    endDate: any,
    ...rest
  ): Observable<HttpResponse<any>> {
    const [
      page,
      size,
      partnerId,
      fileName = null,
      sortBy = "id",
      orderBy = "desc",
    ] = rest;
    let querryparam = `?startDate=${startDate}&endDate=${endDate}&size=${size}&page=${page}&partnerId=${partnerId}`;
    querryparam += fileName ? `&fileName=${fileName}` : "";
    querryparam += `&sort=${sortBy},${orderBy}`;
    return this.http.get<HttpResponse<any>>(
      KALEIDO_SERVER_API_URL +
        "api/partnerBackOffice/nachMandate/getNachFormJobDetailsList" +
        querryparam,
      { observe: "response" }
    );
  }

  executeJobDetailsAndUpdate(jobId: string): Observable<any> {
    return this.http.post(
      `${KALEIDO_SERVER_API_URL}api/partnerBackOffice/upload/executeNachGeneration/${jobId}`,
      null
    );
  }

  cancelNachJobDetails(jobDetailsIdList: string): Observable<any> {
    const querryparam = `?jobIdList=${jobDetailsIdList}`;
    return this.http.post(
      `${KALEIDO_SERVER_API_URL}api/partnerBackOffice/upload/cancelNachJobDetails${querryparam}`,
      {},
      { responseType: "text" }
    );
  }

  getUploadTemplateHeaders(): Observable<any> {
    return this.http.get(SAMPLE_NACH_FORM_TEMPLATE);
  }

  getNachForm(fileId: number) {
    return this.http.get(
      `${KALEIDO_SERVER_API_URL}api/partnerBackOffice/nachMandate/getGeneratedNachForm/${fileId}`,
      { responseType: "blob" }
    );
  }

  downloadExceptionFile(s3Url: string) {
    return this.http.get(s3Url, {
      responseType: "blob",
    });
  }
  getFileURL(id: any): Observable<any> {
    return this.http.get(
      `${KALEIDO_SERVER_API_URL}api/partnerBackOffice/file/streamv2/${id}`,
      { responseType: "text", observe: "response" }
    );
  }
}
