import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { KREDILINE_SERVER_URL } from "src/app/app.constants";
import { UI_COMPONENTS, UiFields } from "src/app/constants/ui-config";
import {
  GET_APPROVAL_BUTTON_CHECK,
  GET_DROPDOWN_VALUES,
  GET_UI_CONFIG,
  GET_UI_CONFIG_SECTION,
  GET_UI_ELEMENTS,
  RECALCULATE_DEMAND_SCHEDULE,
  UPDATE_EDITABLE_FIELDS,
} from "src/app/shared/constants/Api.constants";
import { getProperty, getUiConfig } from "src/app/utils/app.utils";

@Injectable({
  providedIn: "root",
})
export class UiConfigService {
  uiConfigurations: BehaviorSubject<any> = new BehaviorSubject<any>({});

  private readonly uiConfigData: BehaviorSubject<any> = new BehaviorSubject<any>({});

  private readonly approvalButtonChecks: BehaviorSubject<any> = new BehaviorSubject<any>(
    {}
  );

  constructor(private readonly http: HttpClient) {}

  fetchConfigurations(configKey: string = "") {
    this.getUiConfig(configKey)
      .toPromise()
      .then((entryConfigs) => {
        this.uiConfigurations.next({
          ...this.uiConfigurations.getValue(),
          [configKey]: getUiConfig(entryConfigs),
        });
      });
  }
  fetchUiConfigurations() {
    [
      UI_COMPONENTS.LOAN_ENTRY,
      UI_COMPONENTS.LOAN_APPLICATIONS_REVIEW,
      UI_COMPONENTS.NAV_ROUTES,
      UI_COMPONENTS.LOAN_OVERVIEW_REVIEW,
    ].forEach((configKey) => this.fetchConfigurations(configKey));
  }

  getUiConfigurations() {
    return this.uiConfigurations;
  }

  getUiConfig(pageCode: string = ""): Observable<any> {
    const params = new HttpParams().append("pageCode", pageCode);
    return this.http.get(`${GET_UI_CONFIG}`, { params });
  }

  getUiInformationBySections(section: string = "", loanId: number = null) {
    const params = new HttpParams().append("loanApplicationId", loanId);
    return this.http.get(
      `${KREDILINE_SERVER_URL}${GET_UI_ELEMENTS}/${section}`,
      { params }
    );
  }

  getUiConfigBySection(section: string = "", pageCode: string = "LOAN_REVIEW") {
    const params = new HttpParams()
      .append("pageCode", pageCode)
      .append("section", section);
    return this.http.get(GET_UI_CONFIG_SECTION, { params });
  }

  getUiConfigurationsBySection(
    response: Array<any> = [],
    section: string = "",
    parseData: boolean = false
  ) {
    const config = response.find(
      (res) => getProperty(res, "sectionName", "") === section
    );
    if (parseData) {
      return JSON.parse(getProperty(config, "uiConfigurations", "{}"));
    }
    return getProperty(config, "uiConfigurations", {});
  }

  loadUiConfigurations(
    uiFields: BehaviorSubject<any>,
    uiFieldsMap: BehaviorSubject<Array<any>>,
    uiFieldKey: string = "",
    uiFieldMapKey: string = "",
    loanId: number = null,
    configKey: string = UI_COMPONENTS.LOAN_REVIEW
  ) {
    if (uiFieldKey?.length === 0) {
      return;
    }
    this.getUiInformationBySections(uiFieldKey, loanId).subscribe(
      (response: any) => {
        let value = getProperty(response, "subSections[0].fields", {});
        uiFields.next(value);
        this.uiConfigData.next({
          ...this.uiConfigData.getValue(),
          [uiFieldKey]: { fields: value },
        });
      },
      (error) => console.error(error)
    );
    this.getUiConfig(configKey).subscribe(
      (response) => {
        const sectionConfig = this.getUiConfigurationsBySection(
          response,
          uiFieldMapKey,
          true
        );
        uiFieldsMap.next(getProperty(sectionConfig, "uiFieldsMap", []));
      },
      (error) => console.error(error)
    );
  }

  updateUiFields(
    section: string,
    updatedFields: any,
    loanApplicationId: number
  ): Observable<any> {
    const params = new HttpParams().append(
      "loanApplicationId",
      loanApplicationId
    );
    return this.http.put(`${UPDATE_EDITABLE_FIELDS}${section}`, updatedFields, {
      params,
    });
  }

  postUiFields(
    section: string,
    updatedFields: any,
    loanApplicationId: number
  ): Observable<any> {
    const params = new HttpParams().append(
      "loanApplicationId",
      loanApplicationId
    );
    return this.http.post(
      `${UPDATE_EDITABLE_FIELDS}${section}`,
      updatedFields,
      {
        params,
      }
    );
  }

  checkApprovalButton(loanId: number): void {
    const params = new HttpParams().append("loanApplicationId", loanId);
    this.http.get(GET_APPROVAL_BUTTON_CHECK, { params }).subscribe(
      (response) => {
        this.approvalButtonChecks.next(response);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  recalculateDemandSchedule(
    loanId: number = null,
    payload: any = {}
  ): Observable<any> {
    const params = new HttpParams().append("loanApplicationId", loanId);
    return this.http.put(RECALCULATE_DEMAND_SCHEDULE, payload, {
      params,
    });
  }

  getApprovalButtonChecks(): BehaviorSubject<any> {
    return this.approvalButtonChecks;
  }

  getRequestpayload(
    uiFields: any = {},
    payloadTypeKey: any = null,
    payloadType: any = null
  ): any {
    const payload: any = {};
    Object.keys(uiFields).forEach((key) => {
      payload[key] = uiFields[key].value;
    });
    if (payloadTypeKey !== undefined && payloadTypeKey !== null) {
      return payloadType === "object"
        ? {
            [payloadTypeKey]: payload,
          }
        : {
            [payloadTypeKey]: [payload],
          };
    }
    if (payloadType === "array") {
      return [payload];
    }
    return payload;
  }

  extractData = (source: UiFields) => {
    const data: any = {};
    Object.keys(source).forEach((key) => {
      const value: any = getProperty(source[key], "value", null);
      data[key] = value;
    });
    return data;
  };

  getDropDownValues(loanId: number = null): Observable<any> {
    const params = new HttpParams().append("loanApplicationId", loanId);
    return this.http.get(GET_DROPDOWN_VALUES, { params });
  }

  getUiConfigData(): Observable<any> {
    return this.uiConfigData.asObservable();
  }
}
