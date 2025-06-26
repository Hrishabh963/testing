import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

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
      `api/backoffice/upload/branchCentreAgentUpload?lanKey=${language}&branchsetId=${branchset}&allowDuplicate=${allowDuplicate}`,
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
     
        `api/backoffice/upload/partnerCustomerDataUpload?partnerId=${partnerId}&allowDuplicate=${allowDuplicate}`,
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
        `api/backoffice/upload/partnerLoanDemandUpload/${partnerId}`,
      fileUpload
    );
  }

  getListOfJobDetails() {
    return this.http.get(`/api/backoffice/upload/getListOfJobDetails`);
  }

  getBranchsets() {
    return this.http.get(
        `api/backoffice/ownerBasedBranchSets`
    );
  }

  query(req?: any): Observable<any> {
    let params = this.queryToParams(req);
    return this.http.get(`api/backoffice/upload/paginatedJobDetails`, {
      params: params,
    });
  }

  private queryToParams(req: any) {
    let params = new HttpParams();
    if (typeof req === "object") {
      for (const key in req) {
        if (Object.prototype.hasOwnProperty.call(req, key)) {
          params.set(key, req[key]);
        }
      }
    }
    return params;
  }

  bulkStatusUpload(file, jobName, allowDuplicate) {
    const fileUpload: FormData = new FormData();
    fileUpload.append("file", file, file.name);
    return this.http.post(
      `api/backoffice/upload/bulkStatusUpdateUpload/${jobName}/${allowDuplicate}`,
      fileUpload
    );
  }

  deleteJobDetails(jobId) {
    return this.http.post(`api/backoffice/upload/cancelJob/${jobId}/`, null);
  }
  changeJobDetailsStatus(jobId) {
    return this.http.post(
      `api/backoffice/upload/updateJobDetailsStatus/${jobId}/`,
      null
    );
  }
}
