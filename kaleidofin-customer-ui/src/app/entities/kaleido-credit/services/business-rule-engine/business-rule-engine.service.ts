import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { KREDILINE_SERVER_URL } from "src/app/app.constants";
import {
  GET_BRE_DATA,
  POST_DEVIATION_REMARKS,
  SAVE_DEVIATION_COMMENT,
} from "src/app/shared/constants/Api.constants";
import { UiConfigService } from "../ui-config.service";
import { UI_COMPONENTS } from "src/app/constants/ui-config";
import { getProperty } from "src/app/utils/app.utils";

@Injectable({
  providedIn: "root",
})
export class BusinessRuleEngineService {
  public breResponse: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public deviations: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  constructor(
    private readonly http: HttpClient,
    private uiConfigService: UiConfigService
  ) {}

  fetchBreCondition(
    partnerCustomerId = null,
    partnerApplicationId = null
  ): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append("partnerCustomerId", partnerCustomerId);
    params = params.append("partnerApplicationId", partnerApplicationId);
    return this.http.get(`${KREDILINE_SERVER_URL}${GET_BRE_DATA}`, { params });
  }

  getBreResponse(): Observable<any> {
    return this.breResponse.asObservable();
  }
  setBreResponse(data: any): void {
    this.breResponse.next(data);
  }

  postDeviationRemarks(payload: any): Observable<any> {
    return this.http.put(POST_DEVIATION_REMARKS, payload);
  }

  fetchDeviations(loanId: number = null) {
    this.uiConfigService
      .getUiInformationBySections(UI_COMPONENTS.DEVIATIONS, loanId)
      .toPromise()
      .then((response: any) => {
        this.deviations.next(
          getProperty(
            response,
            "subSections[0].fields.breDeviationsSectionList.value",
            []
          )
        );
      });
  }

  saveDeviationComments(deviationId: number = null, remarks: string = null): Observable<any> {
    const payload = {
      deviationId,
      remarks
    };
    return this.http.post(SAVE_DEVIATION_COMMENT, payload, {
      responseType: "text"
    });
  }

}
