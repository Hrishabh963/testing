import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ReferenceCode } from "../../models/reference-code/reference-code.model";

@Injectable()
export class ReferenceCodeService {
  private readonly resourceUrl = "api/backoffice/reference-codes";
  private readonly resourceSearchUrl = "api/_search/reference-codes";
  private readonly refCodeUrl = "api/backoffice/_refs/reference-codes";

  constructor(private readonly http: HttpClient) {}

  create(referenceCode: ReferenceCode): Observable<ReferenceCode> {
    const copy: ReferenceCode = { ...referenceCode };
    return this.http.post<ReferenceCode>(this.resourceUrl, copy);
  }

  update(referenceCode: ReferenceCode): Observable<ReferenceCode> {
    const copy: ReferenceCode = { ...referenceCode };
    return this.http.put<ReferenceCode>(this.resourceUrl, copy);
  }

  find(id: number): Observable<ReferenceCode> {
    return this.http.get<ReferenceCode>(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Observable<any> {
    let params = this.createRequestOption(req);
    return this.http.get(this.resourceUrl, { params });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.resourceUrl}/${id}`);
  }

  search(req?: any): Observable<any> {
    let params = this.createRequestOption(req);
    return this.http.get(this.resourceSearchUrl, { params });
  }

  private createRequestOption(req?: any): HttpParams {
    let params: HttpParams = new HttpParams();
    if (req) {
      params = params.append("page", req.page);
      params = params.append("size", req.size);
      if (req.sort) {
        params = params.append("sort", req.sort);
      }
      params = params.append("query", req.query);
    }
    return params;
  }

  parentRefCodes(refCode: string): Observable<ReferenceCode> {
    return this.http.get<ReferenceCode>(`${this.refCodeUrl}/codes/${refCode}`);
  }

  findChildRefCodes(refCode: string, classifier: string): Observable<any> {
    return this.http.get(
      `${this.refCodeUrl}/childcodes/${classifier}/${refCode}?status=1`
    );
  }

  classifier(): Observable<ReferenceCode> {
    return this.http.get<ReferenceCode>(`${this.refCodeUrl}/classifiers/`);
  }

  getByClassifier(classifier: string): Observable<ReferenceCode> {
    return this.http.get(`${this.refCodeUrl}/codes/${classifier}`);
  }

  disable(id: number, status: number): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${id}/${status}`);
  }
}
