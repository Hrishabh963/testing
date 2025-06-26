import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { saveAs } from "file-saver";
import { JhiDateUtils } from "ng-jhipster";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  KALEIDO_SERVER_API_URL,
  KREDILINE_SERVER_URL,
} from "src/app/app.constants";
import { BankDetailDTO } from "../../../models/customer-group/subscription-review/bank-detail.model";
import { KycKraStatus } from "../../../models/customer-group/subscription-review/kyc-kra-status.model";
import { SubscriptionImageReview } from "../../../models/customer-group/subscription-review/subscription-image-review.model";
import { Customer } from "../../../models/customer/customer.model";
import { NachMandate } from "../../../models/nach-mandate/nach-mandate.model";
import { FileService } from "../../files/file.service";
import { UpdatedSubscriptionDataService } from "./updated-subscription-data.service";
import { GET_FILE_DATA } from "src/app/shared/constants/Api.constants";
import { get, set } from "lodash";

@Injectable()
export class SubscriptionReviewService {
  reviewHistoryStartDate: any;
  reviewHistoryEndDate: any;
  constructor(
    private readonly http: HttpClient,
    private readonly fileService: FileService,
    private readonly dateUtils: JhiDateUtils,
    private readonly updatedSubscriptionDataService: UpdatedSubscriptionDataService
  ) {}

  findCustomerReview(id: number): Observable<SubscriptionImageReview> {
    // NOTE updated customer dto
    return this.http
      .get<SubscriptionImageReview>(
        `${KALEIDO_SERVER_API_URL}api/backoffice/getCustomerReviewData/${id}`
      )
      .pipe(
        map((res: any) => {
          const jsonResponse = res.body;
          jsonResponse.customerDTO.dateOfBirth =
            this.convertLocalDateFromServer(
              jsonResponse.customerDTO.dateOfBirth
            );
          jsonResponse.customerDTO.spouseDateOfBirth =
            this.convertLocalDateFromServer(
              jsonResponse.customerDTO.spouseDateOfBirth
            );
          jsonResponse.customerDTO.nomineeDateOfBirth =
            this.convertLocalDateFromServer(
              jsonResponse.customerDTO.nomineeDateOfBirth
            );
          jsonResponse.customerDTO.isEdited = true;
          this.updatedSubscriptionDataService.customerSubscriptionData.next(
            jsonResponse
          );
          return jsonResponse;
        })
      );
  }

  saveNachDataReview(
    customerSubscriptionsId: number,
    nachMandate: NachMandate
  ): Observable<any> {
    return this.http.put(
      `${KALEIDO_SERVER_API_URL}api/backoffice/saveNachDataReview/${customerSubscriptionsId}`,
      nachMandate
    );
  }
  // for BankData save
  saveBankDataReview(
    customerSubscriptionsId: number,
    bankDetailDTO: BankDetailDTO
  ): Observable<any> {
    const copy: BankDetailDTO = { ...bankDetailDTO };
    return this.http.put(
      `${KALEIDO_SERVER_API_URL}api/backoffice/saveBankDataReview/${customerSubscriptionsId}`,
      copy
    );
  }

  saveMsaDataReview(
    customerSubscriptionsId: number,
    formNumber: string,
    reviewStatus: string,
    rejectReason: string
  ): Observable<any> {
    return this.http.put(
      `${KALEIDO_SERVER_API_URL}api/backoffice/saveMsaDataReview/${customerSubscriptionsId}?formNumber=${formNumber}&reviewStatus=${reviewStatus}&rejectReason=${rejectReason}`,
      {}
    );
  }

  saveKYCDataReview(
    customerSubscriptionsId: number,
    customer: Customer,
    kycDataDocReview: any
  ): Observable<any> {
    const copy: Customer = { ...customer };
    const rb = { customerDTO: copy, docReviewStatusDTO: kycDataDocReview };
    if (
      customer.dateOfBirth !== null &&
      customer.dateOfBirth !== "" &&
      customer.dateOfBirth !== undefined
    ) {
      copy.dateOfBirth = this.dateUtils.convertLocalDateToServer(
        customer.dateOfBirth
      );
    }
    if (
      customer.nomineeDateOfBirth !== null &&
      customer.nomineeDateOfBirth !== "" &&
      customer.nomineeDateOfBirth !== undefined
    ) {
      copy.nomineeDateOfBirth = this.dateUtils.convertLocalDateToServer(
        customer.nomineeDateOfBirth
      );
    }
    if (
      customer.spouseDateOfBirth !== null &&
      customer.spouseDateOfBirth !== "" &&
      customer.spouseDateOfBirth !== undefined
    ) {
      copy.spouseDateOfBirth = this.dateUtils.convertLocalDateToServer(
        customer.spouseDateOfBirth
      );
    }
    return this.http.put(
      KALEIDO_SERVER_API_URL +
        "api/backoffice/saveKYCDataReview/" +
        customerSubscriptionsId,
      rb
    );
  }

  saveNachImageReview(nachEntityFileMappings: any): Observable<any> {
    return this.http.put(
      KALEIDO_SERVER_API_URL + "api/backoffice/saveNachImageReview",
      nachEntityFileMappings
    );
  }

  saveMsaImageReview(
    customerSubscriptionsId: number,
    fileId: number,
    reviewStatus: string,
    rejectReason: string,
    techIssueStatus: boolean,
    techIssueReason: string
  ): Observable<any> {
    return this.http.put(
      KALEIDO_SERVER_API_URL +
        "api/backoffice/saveMsaImageReview/" +
        customerSubscriptionsId +
        "/" +
        fileId +
        "?reviewStatus=" +
        reviewStatus +
        "&rejectReason=" +
        rejectReason +
        "&techIssueStatus=" +
        techIssueStatus +
        "&techIssueReason=" +
        techIssueReason,
      {}
    );
  }

  saveKycImageReview(
    customerId: number,
    customerSubscriptionId: number,
    kycEntityFileMappings: any
  ): Observable<any> {
    return this.http.put(
      KALEIDO_SERVER_API_URL +
        "api/backoffice/saveKycImageReview/" +
        customerId +
        "/" +
        customerSubscriptionId,
      kycEntityFileMappings
    );
  }

  saveKYCVideoReview(
    customerId: number,
    customerSubscriptionsId: number,
    reviewStatus: string,
    rejectReason: string,
    techIssueStatus: boolean,
    techIssueReason: string
  ): Observable<any> {
    return this.http.put(
      KALEIDO_SERVER_API_URL +
        "api/backoffice/saveKYCVideoReview/" +
        customerId +
        "/" +
        customerSubscriptionsId +
        "?reviewStatus=" +
        reviewStatus +
        "&rejectReason=" +
        rejectReason +
        "&techIssueStatus=" +
        techIssueStatus +
        "&techIssueReason=" +
        techIssueReason,
      { responseType: "text" }
    );
  }

  regenerateKYCForm(customerId: number): Observable<any> {
    return this.http.put(
      KALEIDO_SERVER_API_URL + "api/backoffice/regenerateKYCForm/" + customerId,
      {}
    );
  }

  convertLocalDateFromServer(date: string) {
    if (date !== undefined && date != null) {
      const split = date.split("-");
      const dateObj = {
        year: parseInt(split[0], 0),
        month: parseInt(split[1], 0),
        day: parseInt(split[2], 0),
      };
      return dateObj;
    } else {
      return undefined;
    }
  }

  queryRequest(req?: any): Observable<any> {
    let params = this.createRequestOption(req);
    return this.http
      .get(`${KALEIDO_SERVER_API_URL}api/backoffice/searchSubscriptions`, {
        params,
      })
      .pipe(map((res: any) => this.convertResponse(res)));
  }

  private createRequestOption(req?: any): HttpParams {
    let params: HttpParams = new HttpParams();
    if (req) {
      params = params.append("page", req.page);
      params = params.append("size", req.size);
      params = params.append("solution", req.solution);
      params = params.append("customerId", req.customerId);
      params = params.append("subscriptionId", req.subscriptionId);
      params = params.append("partnerId", req.partnerId);
      params = params.append("branchId", req.branchId);
      params = params.append("nachReviewStatus", req.nachReviewStatus);
      params = params.append("msaReviewStatus", req.msaReviewStatus);
      params = params.append("kycReviewStatus", req.kycReviewStatus);
      params = params.append("kycStatus", req.kycStatus);
      params = params.append("startDate", req.startDate);
      params = params.append("endDate", req.endDate);
      params = params.append(
        "isCustomerSubscriptionCompleted",
        req.isCustomerSubscriptionCompleted
      );
      params = params.append("subscriptionType", req.subscriptionType);

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

  private convertResponse(res: any): any {
    const jsonResponse = res;
    let i = 0;
    for (let element of jsonResponse) {
      jsonResponse[i].dateOfBirth = this.dateUtils.convertLocalDateFromServer(
        element.dateOfBirth
      );
      jsonResponse[i].spouseDateOfBirth =
        this.dateUtils.convertLocalDateFromServer(element.spouseDateOfBirth);
      i++;
    }
    res._body = jsonResponse;
    return res;
  }

  imageProcessing(imageFile: any, outputFileFormat: string): Observable<any> {
    const fileUpload = new FormData();
    fileUpload.append("file", imageFile, "nach_document.jpg");
    return this.http.post(
      `${KALEIDO_SERVER_API_URL}api/backoffice/nachMandate/processImage?imageFormat=${outputFileFormat}`,
      fileUpload
    );
  }

  submitNach(subscriptionId: number): Observable<any> {
    return this.http.get(
      `${KALEIDO_SERVER_API_URL}api/backoffice/submitNach/${subscriptionId}`
    );
  }

  submitMsa(subscriptionId: number): Observable<any> {
    return this.http.get(
      `${KALEIDO_SERVER_API_URL}api/backoffice/submitMsa/${subscriptionId}`
    );
  }

  submitKyc(
    customerId: number,
    subscriptionId: number,
    kycApplicationDate: string
  ): Observable<KycKraStatus> {
    let params = new HttpParams();
    params = params.append("kycApplicationDate", kycApplicationDate);

    return this.http.get(
      `${KALEIDO_SERVER_API_URL}api/backoffice/submitKyc/${customerId}/${subscriptionId}`,
      { params }
    );
  }

  checkAndSaveOnReviewChanges(entityReviewDetail: any): Observable<any> {
    return this.http.post(
      `${KALEIDO_SERVER_API_URL}api/backoffice/checkAndSaveOnReviewChanges`,
      entityReviewDetail
    );
  }

  kycFormGeneration(kycApplicationFormId: string) {
    if (kycApplicationFormId !== null || kycApplicationFormId !== undefined) {
      this.fileService.getFileURL(kycApplicationFormId).subscribe((res) => {
        const image = res._body;
        this.fileService.downloadFromS3(image);
      });
    }
  }
  mergeReject(subscriptionId: number): Observable<any> {
    return this.http.put(
      `${KALEIDO_SERVER_API_URL}api/backoffice/notifyRejection/${subscriptionId}/all`,
      {}
    );
  }

  getOriginalImage(customerFileMappingId: number): Observable<any> {
    return this.http.get(
      `${KALEIDO_SERVER_API_URL}api/backoffice/file/getOriginalBase64File/${customerFileMappingId}`,
      { responseType: "text" }
    );
  }

  updatepekrnNum(customerId: number, pekrnNum: string): Observable<any> {
    return this.http.put(
      `${KALEIDO_SERVER_API_URL}api/backoffice/updatePekrnNumber/${customerId}/${pekrnNum}`,
      {}
    );
  }

  updateEntityFileMapping(entityFileMappingDTO: any): Observable<any> {
    return this.http.post(
      `${KALEIDO_SERVER_API_URL}api/backoffice/saveEntityFileMapping`,
      entityFileMappingDTO
    );
  }

  getFileURL(customerId: any, fileType: any): Observable<any> {
    return this.http.get(
      `${KREDILINE_SERVER_URL}api/backoffice/customer/file/streamv2/${customerId}/${fileType}`,
      { responseType: "text" }
    );
  }

  getFileURLFromFileId(fileId: any): Observable<any> {
    return this.http.get(
      `${KREDILINE_SERVER_URL}api/backoffice/file/streamv2/${fileId}`,
      { responseType: "text" }
    );
  }
  getFileDtoFromFileId(fileId: any): Observable<any> {
    return this.http.get(
      `${KREDILINE_SERVER_URL}api/backoffice/file/streamv3/${fileId}`
    );
  }
  getFileData(fileId: any): Observable<any> {
    return this.http.get(`${KREDILINE_SERVER_URL}${GET_FILE_DATA}/${fileId}`, {
      responseType: "text",
    });
  }

  updateKYCReviewStatus(
    applicationId: any,
    payload: any,
    isCoApplicant?: any
  ): Observable<any> {
    let params = new HttpParams();
    if (isCoApplicant) {
      params = params.append("isCoapplicant", isCoApplicant);
    }
    return this.http.post(
      `${KREDILINE_SERVER_URL}api/customer/loans/applications/${applicationId}/updateKYCReviewStatus`,
      { kycReviewDocs: payload },
      { params, responseType: "text" }
    );
  }
  downloanFromS3(s3Url) {
    return this.http.get(s3Url, {
      observe: "response",
      responseType: "blob",
    });
  }

  getBankDetail(id: number, customerId: number): Observable<any> {
    return this.http.get(
      `${KALEIDO_SERVER_API_URL}api/backoffice/bankDetail/${id}?customerId=${customerId}`
    );
  }

  validateBankDetail(
    bankDetailDTO: BankDetailDTO,
    customerId: number,
    forceResetCount = false
  ): Observable<any> {
    return this.http.post(
      `${KREDILINE_SERVER_URL}api/backoffice/bankDetail/validateBankDetail/${bankDetailDTO.id}?validateAccount=${bankDetailDTO.validateAccount}&customerId=${customerId}&resetCheck=${forceResetCount}`,
      { responseType: "text" }
    );
  }

  updateBankAccountHolderName(
    customerSubscriptionId: number,
    bankAccountName: string
  ): Observable<any> {
    return this.http.post(
      `${KALEIDO_SERVER_API_URL}api/backoffice/nachMandate/updateBankAccountHolderName/${customerSubscriptionId}?nameToBePrintedOnNach=${bankAccountName}`,
      { responseType: "text" }
    );
  }

  saveNachReview(nachEntityFileMappings: any): Observable<any> {
    return this.http.put(
      `${KALEIDO_SERVER_API_URL}api/backoffice/saveNachImageReviewForNach`,
      nachEntityFileMappings
    );
  }

  findCustomerNachReview(id: number): Observable<SubscriptionImageReview> {
    return this.http
      .get(
        `${KALEIDO_SERVER_API_URL}api/backoffice/getCustomerReviewDataForNach/${id}`
      )
      .pipe(
        map((res: any) => {
          const jsonResponse = res;
          jsonResponse.customerDTO.dateOfBirth =
            this.convertLocalDateFromServer(
              jsonResponse.customerDTO.dateOfBirth
            );
          jsonResponse.customerDTO.spouseDateOfBirth =
            this.convertLocalDateFromServer(
              jsonResponse.customerDTO.spouseDateOfBirth
            );
          jsonResponse.customerDTO.nomineeDateOfBirth =
            this.convertLocalDateFromServer(
              jsonResponse.customerDTO.nomineeDateOfBirth
            );
          jsonResponse.customerDTO.isEdited = true;
          console.log("checkMain:", jsonResponse);
          return jsonResponse;
        })
      );
  }

  saveKycDetailsExpiryDate(
    customerId: number,
    purpose: string,
    expiryDate: any
  ): Observable<any> {
    expiryDate = this.dateUtils.convertLocalDateToServer(expiryDate);
    return this.http.put(
      `${KALEIDO_SERVER_API_URL}api/backoffice/saveKycDetailsExpiryDate/${customerId}/${purpose}`,
      expiryDate
    );
  }

  generateReviewHistory(
    reviewHistoryStartDate: any,
    reviewHistoryEndDate: any
  ) {
    reviewHistoryStartDate = this.dateUtils.convertLocalDateToServer(
      reviewHistoryStartDate
    );
    reviewHistoryEndDate =
      this.dateUtils.convertLocalDateToServer(reviewHistoryEndDate);
    const out = { data: null, filename: null };
    const fileName =
      "review_history_startDate_" +
      reviewHistoryStartDate +
      "_endDate_" +
      reviewHistoryEndDate;
    return this.http
      .get(
        `${KALEIDO_SERVER_API_URL}api/backoffice/reviewHistoryGeneration/${reviewHistoryStartDate}/${reviewHistoryEndDate}`,
        {
          observe: "response",
          responseType: "blob",
        }
      )
      .subscribe((res: any) => {
        const type = res.headers.get("content-type");
        if (res.headers.get("x-file-name")) {
          out.filename = res.headers.get("x-file-name");
        } else if (fileName !== null && fileName !== undefined) {
          out.filename = fileName;
        } else {
          out.filename = "cash_reconcile_demand_generation";
        }
        out.data = new Blob([res.blob()]);
        out.filename =
          type !== "forwardFeed" ? `${out.filename}.xlsx` : out.filename;
        out.data.size > 0
          ? saveAs(out.data, out.filename)
          : console.log("error");
      });
  }

  getDocReviewStatus(
    customerId: any,
    docReviewType: any,
    subType: any,
    entity: any,
    entityId: any
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append("customerId", customerId);
    params = params.append("docReviewType", docReviewType);
    params = params.append("subType", subType);
    if (entity) params = params.append("entity", entity);
    if (entityId) params = params.append("entityId", entityId);

    return this.http.get(
      `${KREDILINE_SERVER_URL}api/backoffice/getDocReviewStatus`,
      { params }
    );
  }

  saveLoanKycImageReview(
    customerId: number,
    loanApplicationId: number,
    kycEntityFileMappings: any
  ): Observable<any> {
    return this.http.put(
      `${KALEIDO_SERVER_API_URL}api/backoffice/saveLoanKycImageReview/${customerId}/${loanApplicationId}`,
      kycEntityFileMappings
    );
  }

  saveCoApplicantKycImageReview(
    customerId: string,
    loanApplicationId: number,
    groupId: string,
    coApplicantFileDtos: any
  ): Observable<any> {
    return this.http.put(
      `${KALEIDO_SERVER_API_URL}api/backoffice/saveCoApplicantKycDocReview/${customerId}/${loanApplicationId}/${groupId}`,
      coApplicantFileDtos,
      { responseType: "text" }
    );
  }

  saveLoanDocuments(
    loanApplicationId: any,
    loanApplicationDocumentList: any
  ): Observable<any> {
    return this.http.post(
      `${KREDILINE_SERVER_URL}api/backoffice/saveLoanDocumentReview/${loanApplicationId}`,
      loanApplicationDocumentList
    );
  }
  saveCoApplicantLoanDocuments(
    loanApplicationId: any,
    coApplicantDocumentList: any
  ): Observable<any> {
    return this.http.post(
      `${KREDILINE_SERVER_URL}api/backoffice/saveCoapplicantLoanDocumentReview/${loanApplicationId}`,
      { loanReviewDocs: coApplicantDocumentList }
    );
  }

  updateDocumentStatus(documents: Array<any>, loanId: number, callbackFun: Function) {
      documents = documents?.map((doc) => this.createRequestPayload(doc));
      let applicantLoanDocs = documents.filter((x) => !x.isCoApplicantDocument);
      let coApplicantLoanDocs = documents.filter((x) => x.isCoApplicantDocument);
      this.saveLoanDocuments(loanId, applicantLoanDocs)
        .toPromise()
        .then(() => {
          callbackFun()
          if (get(coApplicantLoanDocs, "length", 0) > 0) {
            return this.saveCoApplicantLoanDocuments(loanId, coApplicantLoanDocs)
              .toPromise();
          }
          return null;
        })
        .catch(() => {
          if (get(coApplicantLoanDocs, "length", 0) > 0) {
            return this.saveCoApplicantLoanDocuments(loanId, coApplicantLoanDocs)
              .toPromise();
          }
          return null;
        })
        .then((coApplicantResponse) => {
          if (!coApplicantResponse) {
            callbackFun();
          }
        })
        .catch((err) => console.error(err));
    }

    createRequestPayload(loanAppDoc: any = {}) {
      let payload = {};
      if (!loanAppDoc.hasOwnProperty("isCoApplicantDocument")) {
        payload = { ...loanAppDoc };
      } else {
        set(payload, "isCoApplicantDocument", loanAppDoc.isCoApplicantDocument);
      }
      set(payload, "id", loanAppDoc.id);
      set(payload, "rejectReason", loanAppDoc.reviewRemarks);
      set(
        payload,
        "reviewStatus",
        loanAppDoc.reviewStatus || loanAppDoc.verificationStatus
      );
      set(payload, "techIssueStatus", loanAppDoc.techIssueStatus);
      set(payload, "techIssueReason", loanAppDoc.techIssueReason);
      set(payload, "techIssueReason", loanAppDoc.techIssueReason);
      set(payload, "entityType", loanAppDoc.entityType);
  
      if (loanAppDoc.fileId || loanAppDoc.documentFileId) {
        set(payload, "newFileId", loanAppDoc.documentFileId);
      }
      if (payload["image"]) delete payload["image"];
      if (payload["fileUrl"]) delete payload["fileUrl"];
      return payload;
    }


}
