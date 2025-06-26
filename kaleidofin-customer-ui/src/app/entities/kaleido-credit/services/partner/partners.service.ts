import {
  HttpClient,
  HttpParams,
  HttpResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JhiDateUtils } from "ng-jhipster";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { KALEIDO_SERVER_API_URL } from "src/app/app.constants";
import { Partners } from "../../models/partners/partners.model";

@Injectable()
export class PartnersService {
  private readonly resourceUrl = `${KALEIDO_SERVER_API_URL}api/backoffice/getAllPartners`;
  private readonly addEditPartnerUrl = `${KALEIDO_SERVER_API_URL}api/backoffice/partners`;
  private readonly resourceKCreditUrl = `${KALEIDO_SERVER_API_URL}api/backoffice/getAllKCreditPartners`;

  public partners: Partners;
  constructor(private readonly http: HttpClient, private readonly dateUtils: JhiDateUtils) {
    this.partners = new Partners();
  }

  create(partners: Partners): Observable<Partners> {
    const copy: Partners = {...partners};
    if (
      partners.lastInvitationSentDate !== null &&
      partners.lastInvitationSentDate !== "" &&
      partners.lastInvitationSentDate !== undefined
    ) {
      copy.lastInvitationSentDate = this.dateUtils.convertLocalDateToServer(
        partners.lastInvitationSentDate
      );
    }
    return this.http.post<Partners>(this.addEditPartnerUrl, copy).pipe(
      map((res: any) => {
        this.partners = res.body;
        this.partners.lastInvitationSentDate = this.convertLocalDateFromServer(
          this.partners.lastInvitationSentDate
        );
        this.getPartner();
        return this.partners;
      })
    );
  }

  update(partners: Partners): Observable<Partners> {
    const copy: Partners = { ...partners };
    if (
      partners.lastInvitationSentDate !== null &&
      partners.lastInvitationSentDate !== "" &&
      partners.lastInvitationSentDate !== undefined
    ) {
      copy.lastInvitationSentDate = this.dateUtils.convertLocalDateToServer(
        partners.lastInvitationSentDate
      );
    }
    return this.http.put(this.addEditPartnerUrl, copy).pipe(
      map((res: HttpResponse<Partners>) => {
        this.partners = res.body;
        this.partners.lastInvitationSentDate = this.convertLocalDateFromServer(
          this.partners.lastInvitationSentDate
        );
        this.getPartner();
        return this.partners;
      })
    );
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
  find(id: number): Observable<Partners> {
    return this.http
      .get(`${KALEIDO_SERVER_API_URL}api/backoffice/partners/${id}`)
      .pipe(
        map((res: HttpResponse<Partners>) => {
          const jsonResponse = res.body;
          jsonResponse.lastInvitationSentDate = this.convertLocalDateFromServer(
            jsonResponse.lastInvitationSentDate
          );
          this.partners = jsonResponse;
          return this.partners;
        })
      );
  }

  private createRequestOptionForKCredit(req?: any): HttpParams {
    const params: HttpParams = new HttpParams();
    if (req) {
      if (req.sort) {
        params.append("sort", req.sort);
      }
      for (const key in req.query) {
        if (req.query[key] !== "" || req.query[key] !== 0) {
          params.set(key, req.query[key]);
        }
      }
    }
    return params;
  }

  queryKCreditPartners(req?: any): Observable<Response> {
    const params = this.createRequestOptionForKCredit(req);
    return this.http
      .get(this.resourceKCreditUrl, { params })
      .pipe(map((res: any) => this.convertResponse(res)));
  }

  query(req?: any): Observable<any> {
    let params = this.createRequestOption(req);
    return this.http
      .get(this.resourceUrl, { params })
      .pipe(map((res: any) => this.convertResponse(res)));
  }

  getPartner() {
    return this.partners;
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.resourceUrl}/${id}`);
  }

  private convertResponse(res: any): any {
    const jsonResponse = res;
    let i = 0;
    for (let elm of jsonResponse) {
      jsonResponse[i].lastInvitationSentDate =
        this.dateUtils.convertLocalDateFromServer(
          elm.lastInvitationSentDate
        );

      jsonResponse[i].dateOfBirth = this.dateUtils.convertLocalDateFromServer(
        elm.dateOfBirth
      );
      jsonResponse[i].spouseDateOfBirth =
        this.dateUtils.convertLocalDateFromServer(
          elm.spouseDateOfBirth
        );
      i++;
    }
    res._body = jsonResponse;
    return res;
  }

  private createRequestOption(req?: any) {
    let params: HttpParams = new HttpParams();
    if (req) {
      params = params.append("page", req.page);
      params = params.append("size", req.size);
      if (req.cashCollectionMode)
        params = params.append("cashCollectionMode", req.cashCollectionMode);
      if (req.name) params = params.append("name", req.name);
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

  public findAllPartner(): Observable<any> {
    return this.http.get(
      `${KALEIDO_SERVER_API_URL}api/backoffice/findAllPartners`
    );
  }

  public findOwnerBasedPartnerList(): Observable<any> {
    return this.http.get(
      `${KALEIDO_SERVER_API_URL}api/backoffice/findOwnerBasedPartnerList`
    );
  }
}
