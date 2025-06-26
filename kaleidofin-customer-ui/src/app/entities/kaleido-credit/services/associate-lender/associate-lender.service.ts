import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import get from "lodash/get";
import { BehaviorSubject, Observable } from "rxjs";
import {
  KALEIDO_SERVER_API_URL,
  KREDILINE_SERVER_URL,
} from "src/app/app.constants";
import { FETCH_LOAN_STATES_BY_LENDER } from "src/app/shared/constants/Api.constants";
import { getProperty } from "src/app/utils/app.utils";
import { ApplicationStatus } from "../../loan/constant";
import { AssociateLenderConfig } from "../../models/associate-lender-config.model";
import { Partner } from "../../models/partner.model";
import { UiConfigService } from "../ui-config.service";
import { PasswordValidation } from "../custom-form-validators/custom-form-validation.constants";

@Injectable({
  providedIn: "root",
})
export class AssociateLenderService {
  associateLenders: any = [];
  lender: BehaviorSubject<string> = new BehaviorSubject<string>("");
  isActivitySectionEnabled = false;
  currentLenderLoanTypes = [];
  lenderUserRoles: string[] = [];
  currentLenderPartners: BehaviorSubject<Partner> =
    new BehaviorSubject<Partner>(null);
  public enableDownloadReports: boolean = false;
  public lenderData: any = {};
  public POPUP_METADATA: any = {};
  private readonly lenderConfiguration: BehaviorSubject<any> =
    new BehaviorSubject<any>(null);
  public isRequestOptionalDocsEnabled: boolean = false;
  public maxRequestableOptionalDocs: number = 5;
  public isPDDDocumentsUpdateEnabled: boolean = false;
  passwordRulesMap: PasswordValidation | null = null;
  public documents: any = {};
  constructor(
    private readonly http: HttpClient,
    private readonly uiConfigService: UiConfigService
  ) {}

  fetchLoanStatesByLender(
    lenderCode: string
  ): Observable<AssociateLenderConfig> {
    return this.http.get<AssociateLenderConfig>(
      `${KREDILINE_SERVER_URL}${FETCH_LOAN_STATES_BY_LENDER}/${lenderCode}`,
      {
        observe: "body",
      }
    );
  }

  async fetchLender() {
    let response = await this.http
      .get(`${KALEIDO_SERVER_API_URL}api/lender`)
      .toPromise()
      .catch((e) => console.error(e));
    const lenderCode = get(response, "lenderCode", "");
    this.lender.next(lenderCode);
    sessionStorage.setItem("lenderCode", lenderCode);
    this.lenderData = response;
    this.updateLenderConfigurations(response);
    this.getPasswordRules(response);
    return this.getLenderCode();
  }
  updateLenderConfigurations(lender: any = {}) {
    let config = this.getLenderConfiguration(lender);
    this.documents = this.getLenderDocs(lender);
    if (config.hasOwnProperty("loanReportDownload")) {
      this.enableDownloadReports = get(config, "loanReportDownload", false);
    }
    if (config.hasOwnProperty("isActivityTrackingEnabled")) {
      this.isActivitySectionEnabled = get(
        config,
        "isActivityTrackingEnabled",
        false
      );
    }
    if (config.hasOwnProperty("canRequestMaximumOptionalDocs")) {
      this.maxRequestableOptionalDocs = get(
        config,
        "maxRequestableOptionalDocs",
        5
      );
    }
    if (config.hasOwnProperty("isRequestOptionalDocsEnabled")) {
      this.isRequestOptionalDocsEnabled = get(
        config,
        "isRequestOptionalDocsEnabled",
        false
      );
    }
    if (config.hasOwnProperty("isPDDDocumentsUpdateEnabled")) {
      this.isPDDDocumentsUpdateEnabled = get(
        config,
        "isPDDDocumentsUpdateEnabled",
        false
      );
    }
    if (config.hasOwnProperty("canRequestMaximumOptionalDocs")) {
      this.maxRequestableOptionalDocs = get(
        config,
        "maxRequestableOptionalDocs",
        5
      );
    }
    if (config.hasOwnProperty("isRequestOptionalDocsEnabled")) {
      this.isRequestOptionalDocsEnabled = get(
        config,
        "isRequestOptionalDocsEnabled",
        false
      );
    }
    if (config.hasOwnProperty("isPDDDocumentsUpdateEnabled")) {
      this.isPDDDocumentsUpdateEnabled = get(
        config,
        "isPDDDocumentsUpdateEnabled",
        false
      );
    }

    this.lenderUserRoles = getProperty(config, "lenderUserRoles", []);

    this.updateCustomerTypes(lender);
    this.updatePartners(lender);
    this.setLenderConfigurationSubject(lender);
  }

  setLenderCode(lender) {
    this.lender.next(lender);
  }
  getLenderCode(): string {
    return this.lender.getValue();
  }
  getLenderCodeSubject(): BehaviorSubject<string> {
    return this.lender;
  }

  getLenderConfiguration(lender = {}) {
    let configuration = get(lender, "configuration", "{}");
    if (configuration && typeof configuration === "string")
      return JSON.parse(configuration);
    return {};
  }

  getLenderDocs(lender = {}) {
    let requiredDocuments = get(lender, "requiredDocuments", "{}");
    if (requiredDocuments && typeof requiredDocuments === "string")
      return JSON.parse(requiredDocuments);
    return {};
  }

  updateCustomerTypes(lender: any = {}) {
    const loanProductConfig = JSON.parse(
      get(lender, "loanProductConfig", "{}")
    );
    this.currentLenderLoanTypes = get(loanProductConfig, "loanTypes", []);
  }
  updatePartners(lender: any = {}) {
    this.currentLenderPartners.next(get(lender, "partnersLinked", []));
  }
  getLenderData() {
    return this.lenderData;
  }
  getPartnersLinked(): BehaviorSubject<any> {
    return this.currentLenderPartners;
  }

  fetchPopupMetaData() {
    try {
      this.uiConfigService.fetchUiConfigurations();
      this.uiConfigService.getUiConfig("LOAN_REVIEW").subscribe(
        (response) => {
          const sectionData = this.uiConfigService.getUiConfigurationsBySection(
            response,
            "POPUP_METADATA",
            true
          );
          this.POPUP_METADATA = getProperty(sectionData, "popup_metadata", {});
        },
        (error) => console.error(error)
      );
    } catch (exception) {
      console.error(exception);
    }
  }

  getPopupConstant(applicationStatus: string = "") {
    switch (true) {
      case ApplicationStatus.agreementreceived.includes(applicationStatus):
        return this.POPUP_METADATA.agreementReceived;
      case typeof applicationStatus === "object":
      case ApplicationStatus.externalpending.includes(applicationStatus):
      case ApplicationStatus.pending.includes(applicationStatus):
        return this.POPUP_METADATA.loanReview;
      case ApplicationStatus.pendingagreement.includes(applicationStatus):
      case ApplicationStatus.agreement.includes(applicationStatus):
        return this.POPUP_METADATA.agreement;
      case ApplicationStatus.retry.includes(applicationStatus):
        return this.POPUP_METADATA.retry;
      case ApplicationStatus.agreementretry.includes(applicationStatus):
        return this.POPUP_METADATA.agreementretry;
      case ApplicationStatus.rejectedbooking.includes(applicationStatus):
        return this.POPUP_METADATA.rejectedbooking;
      case ApplicationStatus.rejectedexternalbooking.includes(
        applicationStatus
      ):
        return this.POPUP_METADATA?.rejectedexternalbooking;
      case ApplicationStatus.pendingdisbursal.includes(applicationStatus):
        return (
          this.POPUP_METADATA?.pendingdisbursal ?? this.POPUP_METADATA.default
        );
      case ApplicationStatus.REVIEW_PENDING_REJECT.includes(applicationStatus):
        return this.POPUP_METADATA?.REVIEW_PENDING_REJECT;
      case ApplicationStatus.REVIEW_PENDING_APPROVE.includes(applicationStatus):
        return this.POPUP_METADATA?.REVIEW_PENDING_APPROVE;
      case ApplicationStatus.AGREEMENT_PENDING.includes(applicationStatus):
        return this.POPUP_METADATA?.AGREEMENT_PENDING;
      case ApplicationStatus.AUTHORIZE.includes(applicationStatus):
        return this.POPUP_METADATA?.authorize ?? this.POPUP_METADATA.default;

      default:
        return this.POPUP_METADATA.default;
    }
  }

  fetchCustomPopupMetadata(path: string) {
    return get(this.POPUP_METADATA, path);
  }

  setLenderConfigurationSubject(lender: Object = {}): void {
    const config: Object = this.getLenderConfiguration(lender);
    this.lenderConfiguration.next(config);
  }

  getLenderConfigurationSubject(): BehaviorSubject<any> {
    return this.lenderConfiguration;
  }

  getPasswordRules(response: any): void {
    const passwordRulesString: string = getProperty(
      response,
      "passwordStructureRules",
      null
    );
    this.passwordRulesMap = passwordRulesString?.length
      ? new PasswordValidation(passwordRulesString)
      : null;
  }
}
