import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { KALEIDO_SERVER_API_URL } from "src/app/app.constants";

@Injectable()
export class ImportDataService {
  constructor(private readonly http: HttpClient) {}

  partnerCenterAgentCustomerUpload(
    file: any,
    branchset: number,
    language: string,
    allowDuplicate: boolean
  ) {
    const fileUpload: FormData = new FormData();
    fileUpload.append("file", file, file.name);
    return this.http.post(
      `${KALEIDO_SERVER_API_URL}api/backoffice/upload/branchCentreAgentUpload?lanKey=${language}&branchsetId=${branchset}&allowDuplicate=${allowDuplicate}`,
      fileUpload
    );
  }

  partnerCustomerDataUpload(
    file: any,
    partnerId: number,
    allowDuplicate: boolean
  ) {
    const fileUpload: FormData = new FormData();
    fileUpload.append("file", file, file.name);
    return this.http.post(
      `${KALEIDO_SERVER_API_URL}api/backoffice/upload/partnerCustomerDataUpload?partnerId=${partnerId}&allowDuplicate=${allowDuplicate}`,
      fileUpload
    );
  }

  partnerCustomerDemandDataUpload(
    file: any,
    partnerId: number,
    allowDuplicate: boolean
  ) {
    const fileUpload: FormData = new FormData();
    fileUpload.append("file", file, file.name);
    return this.http.post(
      `${KALEIDO_SERVER_API_URL}api/backoffice/upload/partnerLoanDemandUpload/${partnerId}`,
      fileUpload
    );
  }

  getListOfJobDetails() {
    return this.http.get(
      `/${KALEIDO_SERVER_API_URL}api/backoffice/upload/getListOfJobDetails`
    );
  }

  getBranchsets() {
    return this.http.get(
      `${KALEIDO_SERVER_API_URL}api/backoffice/ownerBasedBranchSets`
    );
  }

  query(req?: any): Observable<any> {
    let params = this.createRequestOption(req);
    return this.http.get(
      `${KALEIDO_SERVER_API_URL}api/backoffice/upload/paginatedJobDetails`,
      {
        params,
      }
    );
  }

  getKCreditReports(req?: any): Observable<any> {
    let params = this.createRequestOption(req);
    return this.http.get(
      `${KALEIDO_SERVER_API_URL}api/backoffice/upload/paginatedKCreditReports`,
      {
        observe: "response",
        params,
      }
    );
  }

  private createRequestOption(req?: any): HttpParams {
    let params: HttpParams = new HttpParams();
    if (req) {
      params = params.set("page", req.page);
      params = params.append("size", req.size);
      if (req.status) params = params.set("status", req.status);
      if (req.sort) {
        params = params.append("sort", req.sort);
      }
      for (const key in req.query) {
        if (req.query[key] !== "" || req.query[key] !== 0) {
          params = params.append(key, req.query[key]);
        }
      }
    }
    return params;
  }

  bulkStatusUpload(file, jobName, allowDuplicate) {
    const fileUpload: FormData = new FormData();
    fileUpload.append("file", file, file.name);
    return this.http.post(
      `${KALEIDO_SERVER_API_URL}api/backoffice/upload/bulkStatusUpdateUpload/${jobName}/${allowDuplicate}`,
      fileUpload
    );
  }

  //start

  deleteJobDetails(jobId) {
    return this.http.post(`${KALEIDO_SERVER_API_URL}api/backoffice/upload/cancelJob/${jobId}/`, null);
  }
  changeJobDetailsStatus(jobId) {
    return this.http.post(
      `${KALEIDO_SERVER_API_URL}api/backoffice/upload/updateJobDetailsStatus/${jobId}/`,
      null
    );
  }
}
