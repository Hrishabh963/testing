import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JhiDateUtils } from "ng-jhipster";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  KALEIDO_SERVER_API_URL,
  KREDILINE_SERVER_URL,
} from "src/app/app.constants";
import { LoanApplicationSearchSpecification } from "../models/krediline/loan-application-download.model";
import { LoanApplication } from "../models/krediline/loan-application.model";
import { LoanDetails } from "../models/krediline/loan-details.model";
import { LoanInfoDTO } from "../models/krediline/repayment/loan-info-DTO.model";
import { AssociateLender } from "../models/associate-lender.model";
import { ApplicationStatus } from "../loan/constant";
import { KcreditLoanDetailsModel } from "../loan/kcredit-loanDetails.model";
import { getProperty } from "src/app/utils/app.utils";
import {
  AUTHORIZE_LOANS,
  BULK_REJECT_URL,
  BULK_REVIEW,
  LOAN_APPLICATION_COUNT,
  LOAN_APPLICATIONS,
  PARTNER_WISE_LOAN_COUNT,
  RETRY_LOAN_BOOKING,
  UPDATE_LOAN_DETAILS,
} from "src/app/shared/constants/Api.constants";
import { get } from "lodash";
import { LoanPhaseMetrics } from "../models/loan-overview/loan-application-phase-metrics";

@Injectable()
export class LoanReviewService {
  private readonly resourceUrl = BULK_REVIEW;

  public loanApplication: LoanApplication;
  public loanApplications: LoanApplication[];
  public loanDetails: LoanDetails;
  public loanDetailsData: KcreditLoanDetailsModel;
  public loanInfoDTO: LoanInfoDTO;
  currentStatusStr: string;
  newStatusStr: string;
  loanReviewDedupe: boolean = false;
  loanApplicationSearchSpecification: LoanApplicationSearchSpecification;
  associateLenderList: AssociateLender[];
  public partnerwiseLoanCounts: Map<string, LoanPhaseMetrics> = new Map();

  constructor(
    private readonly http: HttpClient,
    private readonly dateUtils: JhiDateUtils
  ) {
    this.loanApplication = new LoanApplication();
    this.loanDetails = new LoanDetails();
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

  getAssignee() {
    return get(this.loanApplication, "assignee", null);
  }
  create(loan: LoanDetails): Observable<LoanDetails["loan"]> {
    const copy: LoanDetails = { ...loan };
    return this.http.post<LoanDetails["loan"]>(
      KREDILINE_SERVER_URL + this.resourceUrl,
      copy
    );
  }

  bulkReject(
    loanApplications: any[] = [],
    reviewStatus: string = "",
    reviewReason: string = "",
    actionRequired: string = ""
  ) {
    const params = new HttpParams()
      .append("loanApplicationIds", loanApplications.join(","))
      .append("rejectStatus", reviewStatus)
      .append("remarks", reviewReason)
      .append("actionRequired", actionRequired);
    return this.http.put(BULK_REJECT_URL, JSON.stringify("{}"), {
      params,
    });
  }

  bulkStatusUpdate(
    loanApplications: any[] = [],
    reviewStatus: string = "",
    rejectCondition: string = "",
    actionRequired: string[] = [],
    isReferred: boolean = false,
    documents: any[] = []
  ): Observable<any> {
    const key = actionRequired ? actionRequired.toString() : "";
    const params = new HttpParams()
      .append("loanApplicationIds", loanApplications.join(","))
      .append(
        "reviewStatus",
        reviewStatus === ApplicationStatus.forceReject
          ? ApplicationStatus.reject
          : reviewStatus
      )
      .append("rejectCondition", rejectCondition)
      .append("actionRequired", reviewStatus === "reject" ? null : key)
      // Optional Parameter to force Reject
      .append(
        "forcedApplicationReject",
        reviewStatus === ApplicationStatus.forceReject
      )
      .append("isReferred", isReferred);
    return this.http.post(KREDILINE_SERVER_URL + this.resourceUrl, documents, {
      params,
    });
  }

  checkKiScoreApproveOverrule(loanApplicationId: any): Observable<any> {
    return this.http.get(
      `${KREDILINE_SERVER_URL}/api/backoffice/loanReview/checkKiScoreOverrule/` +
        loanApplicationId,
      { observe: "body" }
    );
  }

  schedulePayment(
    loanApplication: number,
    amount1: any,
    date: any
  ): Observable<any> {
    date = this.dateUtils.convertLocalDateToServer(date);
    return this.http.get(
      `${KALEIDO_SERVER_API_URL}api/backoffice/demand/processOpsInitiatedDemands`,
      {
        params: {
          applicationNumber: loanApplication,
          amount: amount1,
          repaymentDate: date,
        },
      }
    );
  }

  postFile(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append("file", fileToUpload, fileToUpload.name);
    return this.http.post(
      `${KALEIDO_SERVER_API_URL}api/backoffice/upload/bulkLoanPaymentStatus`,
      formData
    );
  }

  postFileToCreateLoan(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append("file", fileToUpload, fileToUpload.name);
    return this.http.post(
      `${KREDILINE_SERVER_URL}api/backoffice/loans/applications/uploadNgoCustomerForLoan`,
      formData
    );
  }

  validateFile(name: string) {
    const ext = name.substring(name.lastIndexOf(".") + 1);
    if (ext.toLowerCase() == "xls") {
      return true;
    } else if (ext.toLowerCase() == "csv") {
      return true;
    } else {
      return false;
    }
  }

  validateFileForNgoUpload(name: string) {
    const ext = name.substring(name.lastIndexOf(".") + 1);
    if (ext.toLowerCase() == "xls") {
      return true;
    } else if (ext.toLowerCase() == "xlsx") {
      return true;
    } else {
      return false;
    }
  }

  downloadLienRelease(id: any): Observable<any> {
    const out = { data: null, filename: null };
    return this.http
      .get(
        `${
          KREDILINE_SERVER_URL + this.resourceUrl
        }/downloadLienReleaseLetter/${id}`,
        {
          observe: "response",
          responseType: "blob",
        }
      )
      .pipe(
        map((res: HttpResponse<Blob>) => {
          out.data = new Blob([res.body]);
          out.filename = res.headers.get("x-file-name");
          return out;
        })
      );
  }

  downloadLienRequest(id: any): Observable<any> {
    const out = { data: null, filename: null };
    return this.http
      .get(
        `${
          KREDILINE_SERVER_URL + this.resourceUrl
        }/downloadLienRequestDocument/${id}`,
        {
          observe: "response",
          responseType: "blob",
        }
      )
      .pipe(
        map((res: HttpResponse<Blob>) => {
          out.data = new Blob([res.body]);
          out.filename = res.headers.get("x-file-name");
          return out;
        })
      );
  }

  downloadLenderLetter(id: any): Observable<any> {
    const out = { data: null, filename: null };
    return this.http
      .get(
        `${KREDILINE_SERVER_URL + this.resourceUrl}/downloadLenderForm/${id}`,
        {
          observe: "response",
          responseType: "blob",
        }
      )
      .pipe(
        map((res: HttpResponse<Blob>) => {
          out.data = new Blob([res.body]);
          out.filename = res.headers.get("x-file-name");
          return out;
        })
      );
  }

  processPhysicalLien(id: number): Observable<LoanApplication> {
    return this.http.post<LoanApplication>(
      `${KREDILINE_SERVER_URL + this.resourceUrl}/physicalLienReceived/${id}`,
      ""
    );
  }

  setLoanDetailsData(loanDetails: KcreditLoanDetailsModel = null) {
    this.loanDetailsData = loanDetails;
  }

  getApplicantName(): string {
    return getProperty(this.loanDetailsData, "customerDTO.name", null);
  }

  getLoanStatus(): string {
    return getProperty(
      this.loanDetailsData,
      "loanApplicationDTO.applicationStatus",
      ""
    );
  }

  retryLoanBooking(loanId: number): Observable<any> {
    const params = new HttpParams().append("loanApplicationId", loanId);
    return this.http.post(RETRY_LOAN_BOOKING, null, {
      params,
    });
  }

  getLoanApplication() {
    return this.loanApplication;
  }

  updateLoanDetails(loan: LoanDetails): Observable<LoanDetails["loan"]> {
    const payload: LoanDetails = { ...loan };
    return this.http.put<LoanDetails["loan"]>(UPDATE_LOAN_DETAILS, payload);
  }

  loanApplicationsWithSubscriptionNumber(
    customerSubscriptionNumber: any
  ): Observable<LoanApplication[]> {
    return this.http.get<LoanApplication[]>(
      `${KREDILINE_SERVER_URL + this.resourceUrl}/getLoanNoBySubId/` +
        customerSubscriptionNumber
    );
  }

  getKcreditApplications(req?: any): Observable<any> {
    req.applicationStatus = req.search.applicationStatus;
    req.loanPhase = req.search.loanPhase;
    let params = this.createLoanApplicationRequestOption(req);
    return this.http
      .get(KREDILINE_SERVER_URL + this.resourceUrl, {
        params,
        observe: "response",
      })
      .pipe(map((res: HttpResponse<any>) => this.convertHistoryResponse(res)));
  }

  fetchLoanApplications(searchParams: any = {}) {
    const params = this.createHttpParams(searchParams);
    return this.http.get(LOAN_APPLICATIONS, { params, observe: "response" });
  }

  fetchLoanApplicationCount(searchParams: any = {}) {
    const params = this.createHttpParams(searchParams);
    return this.http.get(LOAN_APPLICATION_COUNT, { params });
  }

  createHttpParams(searchParams: any = {}) {
    let params = new HttpParams();

    Object.keys(searchParams).forEach((key) => {
      params = params.append(key, searchParams[key]);
    });
    return params;
  }
  /**
   *
   * @param req request to fetch count
   * @returns return map containing partner wise map (loan phase, count of applications)
   */
  getPartnerLoanCounts(
    req: any = {}
  ): Observable<Map<string, LoanPhaseMetrics>> {
    let params = this.createHttpParams(req);
    return this.http.get(PARTNER_WISE_LOAN_COUNT, { params }).pipe(
      map((res) => {
        if (res) {
          for (let partnerName in res) {
            this.partnerwiseLoanCounts.set(
              partnerName,
              new LoanPhaseMetrics(res[partnerName])
            );
          }
        }
        return this.partnerwiseLoanCounts;
      })
    );
  }

  private convertHistoryResponse(res: any): any {
    const jsonResponse = res.body;
    let loanApplications = [];
    if (jsonResponse.hasOwnProperty("loanApplications")) {
      loanApplications = this.updateDateFields(jsonResponse?.loanApplications);
    } else {
      loanApplications = this.updateDateFields(jsonResponse);
    }
    res.body = { ...jsonResponse, loanApplications };
    return res;
  }

  updateDateFields(data: Array<any> = []) {
    return data.map((element) => ({
      ...element,
      dateOfBirth: this.dateUtils.convertLocalDateFromServer(
        element.dateOfBirth
      ),
      spouseDateOfBirth: this.dateUtils.convertLocalDateFromServer(
        element.spouseDateOfBirth
      ),
    }));
  }
  private createLoanApplicationRequestOption(req?: any) {
    let params: HttpParams = new HttpParams();

    if (req) {
      params = params.append("page", req.page);
      params = params.append("size", req.size);
      params = params.append("loanProduct", "kcredit");
      params = params.append("applicationStatus", req.search.applicationStatus);
      params = params.append("loanPhase", req.search.loanPhase);
      params = params.append("searchValues", req.searchValues || "");
      params = this.helperFunction(
        params,
        req.search.partnerType,
        "lendingPartnerCode"
      );
      params = this.helperFunction(params, req.search.loanType, "loanType");
      params = this.helperFunction(params, req.search.partnerId, "partnerId");
      params = this.helperFunction(
        params,
        req.search.bankValidationStatus,
        "bankValidationStatus"
      );
      params = this.helperFunction(
        params,
        req.search.postDisbursementUploadStatus,
        "postDisbursementUploadStatus"
      );
      params = this.helperFunction(params, req.sort, "sort");

      for (const key in req.query) {
        if (req.query[key] !== "" || req.query[key] !== 0) {
          params = params.append(key, req.query[key]);
        }
      }
    }
    return params;
  }
  helperFunction(params, req, str) {
    let temp = params;
    if (req) {
      temp = params.append(str, req);
    }
    return temp;
  }

  amendRepaymentDate(
    id: number,
    repaymentDate: Date,
    loanTenure: number
  ): Observable<LoanApplication> {
    let params: HttpParams = new HttpParams();
    params = params.append("loanApplicationId", id);
    params = params.append("repaymentDate", repaymentDate.toString());
    params = params.append("tenure", loanTenure);
    return this.http.get<LoanApplication>(
      `${KREDILINE_SERVER_URL + this.resourceUrl}/amendRepaymentDateAndTenure`,
      {
        params,
      }
    );
  }

  authorizeLoanApplications(
    laonApplicationIds: Array<number>
  ): Observable<any> {
    return this.http.put(AUTHORIZE_LOANS, laonApplicationIds);
  }

  getEkycStatusForObligators(entityId: number): string {
    const obligatorList: Array<any> = this.loanDetailsData?.loanObligatorDTOList ?? [];
    const obligatorDto = obligatorList?.find((obligator) => entityId === obligator?.id);
    return getProperty(obligatorDto,'loanObligatorAdditionalData.kycStatus');
  }
}
