import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DemandPage } from "./demand.model";
import { JobDetailsDTO } from "./jobdetails.model";
import { Observable } from "rxjs";
import {
  KALEIDO_SERVER_API_URL,
  SERVER_API_URL
} from "../../app.constants";

@Injectable({
  providedIn: "root"
})
export class DemandService {
  constructor(private readonly http: HttpClient) {}

  getDemandUploadList(
    pageSize: number,
    currentPage: number,
    sort: string,
    order: string
  ): Observable<DemandPage> {
    let params = `?`;
    if (pageSize != null) {
      params = params + `size=` + pageSize;
    }
    if (currentPage != null) {
      params = params + `&page=` + currentPage;
    }
    if (sort != null) {
      params = params + `&sort=` + sort;
      if (order != null) {
        params = params + `,` + order;
      }
    }
    return this.http.get(
      SERVER_API_URL + `api/partner/upload/details` + params
    );
  }

  partnerCustomerDemandDataUpload(file: any): Observable<JobDetailsDTO> {
    const fileUpload: FormData = new FormData();
    fileUpload.append("file", file, file.name);
    return this.http.post(
      KALEIDO_SERVER_API_URL +
        `api/partnerBackOffice/upload/partnerLoanDemandUpload`,
      fileUpload
    );
  }

  getUploadTemplateHeaders(): Observable<any> {
    return this.http.get(SERVER_API_URL + `api/partner/upload/uploadTemplate`);
  }
}
