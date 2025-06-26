import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { delay, map, retryWhen, take } from "rxjs/operators";
import {
  LOAN_APPLICATIONS,
  UPDATE_CO_APPLICANT_DETAILS,
  AADHAAR_VERIFICATION,
  GET_LOAN_DOCUMENTS,
  GET_KYC_DOCUMENTS,
  GET_LOAN_INFO,
  PAN_VERIFICATION
} from "src/app/shared/constants/Api.constants";
import {
  KALEIDO_SERVER_API_URL,
  KREDILINE_SERVER_URL,
} from "../../../app.constants";
import { ExistingLoan } from "../models/existing-loan.model";
import { LoanObligator } from "../models/loan-obligator.model";
import { SearchCustomerResponse } from "./components/dedupe/models/search-customer-response.model";
import { KcreditLoanDetailsModel } from "./kcredit-loanDetails.model";

@Injectable()
export class KcreditLoanService {
  private readonly resourceUrl = "api/backoffice/loans/applications";
  private readonly dedupeResourceUrl = "api/v1/dedupes";
  private readonly numberOfRetries = 10;
  private readonly retryDelay = 2000;
  private readonly numberOfRetriesForAadhaarIdfy = 2;
  private readonly numberOfRetriesForRedactAadhaar = 1;
  private readonly retryDelayForAadhaarIdfy = 5000;
  public kcreditLoanDetailsModel: KcreditLoanDetailsModel;
  public searchCustomerResponse: SearchCustomerResponse;
  public loanDetails: KcreditLoanDetailsModel = undefined;

  constructor(private readonly http: HttpClient) {
    this.kcreditLoanDetailsModel = new KcreditLoanDetailsModel();
  }

  update(
    customerId: number,
    payload: any
  ): Observable<KcreditLoanDetailsModel> {
    const copy: KcreditLoanDetailsModel = { ...payload };
    return this.http.put<KcreditLoanDetailsModel>(
      `${KREDILINE_SERVER_URL}api/backoffice/customer/profileUpdate/${customerId}`,
      copy
    );
  }

  find(id: number): Observable<KcreditLoanDetailsModel> {
    return this.http.get<KcreditLoanDetailsModel>(
      `${KREDILINE_SERVER_URL}${this.resourceUrl}/getLoanReviewInfo?loanApplicationId=${id}`
    );
  }

  verifyAadhaar(loanApplication: any): Observable<any> {
    return this.http.post(
      AADHAAR_VERIFICATION,
      loanApplication
    );
  }

  verifyPan(loanApplication: any): Observable<any> {
    return this.http.post(
      PAN_VERIFICATION,
      loanApplication
    );
  }

  redactAadhaar(idfyEntity: any, kycId: any): Observable<any> {
    let noOfRetryAttemptsMadeForRedactAadhaar = 0;
    return this.http
      .get(
        `${KREDILINE_SERVER_URL}api/backoffice/kyc/redaction/aadhaar/${idfyEntity}/${kycId}`
      )
      .pipe(
        map((res: any) => {
          if (
            noOfRetryAttemptsMadeForRedactAadhaar <
            this.numberOfRetriesForRedactAadhaar
          ) {
            noOfRetryAttemptsMadeForRedactAadhaar =
              ++noOfRetryAttemptsMadeForRedactAadhaar;
            throw new Error("retry Aadhaar Redact one more time");
          }
          return res;
        }),
        retryWhen((errors) =>
          errors.pipe(
            delay(this.retryDelayForAadhaarIdfy),
            take(this.numberOfRetriesForRedactAadhaar)
          )
        )
      );
  }

  checkAadhaarVerificationStatus(loanApplication: any): Observable<any> {
    let noOfAttemptsMadeForAadhaarIdfy = 0;
    return this.http
      .post(AADHAAR_VERIFICATION, loanApplication)
      .pipe(
        map((res: any) => {
          const aadhaarIdfy = res.aadhaarVerificationStatus;
          if (
            aadhaarIdfy &&
            aadhaarIdfy === "IN_PROGRESS" &&
            noOfAttemptsMadeForAadhaarIdfy < this.numberOfRetriesForAadhaarIdfy
          ) {
            noOfAttemptsMadeForAadhaarIdfy = ++noOfAttemptsMadeForAadhaarIdfy;
            throw new Error("Still In Progress");
          }
          return res;
        }),
        retryWhen((errors) =>
          errors.pipe(
            delay(this.retryDelayForAadhaarIdfy),
            take(this.numberOfRetriesForAadhaarIdfy)
          )
        )
      );
  }

  eligibilityCheck(id: number): Observable<any> {
    return this.http.get<KcreditLoanDetailsModel>(
      `${KREDILINE_SERVER_URL}${this.resourceUrl}/eligibilityRule?loanApplicationId=${id}`
    );
  }
  updateExistingLoan(existingLoan: any) {
    const copy: ExistingLoan = { ...existingLoan };
    return this.http.put(
      `${KALEIDO_SERVER_API_URL}${this.resourceUrl}/api/backoffice/customer/updateExistingLoans/${copy.id}`,
      copy
    );
  }

  bulkReject(ids: string, rejectCondition: string, reviewStatus: string) {
    return this.http.post(
      `${KREDILINE_SERVER_URL}api/backoffice/loanReview/bulkReview?loanApplicationIds=${ids}&reviewStatus=${reviewStatus}&rejectCondition=${rejectCondition}&actionRequired=null&forcedApplicationReject=false`,
      {}
    );
  }

  updateLoanObligator(obligator: any) {
    const copy: LoanObligator = { ...obligator };
    const payload = [copy];
    return this.http.post(
      `${KREDILINE_SERVER_URL}api/backoffice/loanObligator`,
      payload
    );
  }

  updateCoApplicantDetails(coApplicants: any[]) {
    return this.http.put(
      `${KREDILINE_SERVER_URL}${UPDATE_CO_APPLICANT_DETAILS}`,
      coApplicants,
      { observe: "response", responseType: "text" }
    );
  }

  dedupeSearchCustomer(searchCustomerRequest: any) {
    return this.http.post(
      `${KREDILINE_SERVER_URL + this.dedupeResourceUrl}`,
      searchCustomerRequest
    );
  }

  getDedupeSearchCustomerStatus(requestId: any) {
    let noOfAttemptsMade = 1;
    return this.http
      .get<any>(`${KREDILINE_SERVER_URL + this.dedupeResourceUrl}/${requestId}`)
      .pipe(
        map((res: any) => {
          const jsonResponse = res;
          if (
            jsonResponse &&
            (jsonResponse.matchCount == null ||
              jsonResponse.matchCount === undefined) &&
            noOfAttemptsMade < this.numberOfRetries
          ) {
            noOfAttemptsMade = ++noOfAttemptsMade;
            throw new Error("Still In Progress");
          }
          return res;
        }),
        retryWhen((errors) =>
          errors.pipe(delay(this.retryDelay), take(this.numberOfRetries))
        )
      );
  }

  assignUcic(assignUCICRequest: any): Observable<any> {
    return this.http
      .post(
        `${KREDILINE_SERVER_URL + this.dedupeResourceUrl}/assignUcic`,
        assignUCICRequest
      )
      .pipe(
        map((res: Response) => {
          return res;
        })
      );
  }

  setLoanDetails(loanDetails: KcreditLoanDetailsModel): void {
    this.loanDetails = loanDetails;
  }

  getLoanDetails(): KcreditLoanDetailsModel {
    return this.loanDetails;
  }
  getLoanId(): any {
    return this.loanDetails?.loanApplicationDTO?.id;
  }
  updateStatusForFailedApplications(
    status: string = null,
    loanId: any = null,
    files: any = [],
    remarks: string = ""
  ): Promise<any> {
    if (!status || !loanId) {
      return Promise.reject(new Error("Error"));
    }
    const formData = new FormData();
    formData.append("documents", files);

    const params = new HttpParams({
      fromObject: {
        additionalDocsRemark: remarks,
      },
    });

    return this.http
      .post(`${LOAN_APPLICATIONS}/${loanId}/approveLoanApplication`, formData, {
        params,
      })
      .toPromise();
  }

  getLoanApplicationDocuments(loanId: number = null): Observable<any> {
    const params = new HttpParams().append("loanApplicationId", loanId);
    return this.http.get(GET_LOAN_DOCUMENTS, { params });
  }

  getKycDocuments(loanId: number = null): Observable<any> {
    const params = new HttpParams().append("loanApplicationId", loanId);
    return this.http.get(GET_KYC_DOCUMENTS, { params });
  }

  getLoanApplicationInfo(loanId: number = null): Observable<any> {
    const params = new HttpParams().append("loanApplicationId", loanId);
    return this.http.get(GET_LOAN_INFO, { params });
  }

}
