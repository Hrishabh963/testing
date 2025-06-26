import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { KREDILINE_SERVER_URL } from "src/app/app.constants";
import {
  CREATE_BULK_PRE_SIGNED_S3_URL,
  CREATE_PRE_SIGNED_S3_URL,
  DELETE_DOCUMENTS,
  FETCH_UPLOAD_DECISIONING_REPORTS,
  LOAN_APPLICATIONS,
  UPDATE_FILES,
  UPLOAD_DECISIONING_REPORTS,
  UPLOAD_KISCORE_REPORTS,
  UPLOAD_REPORTS,
} from "src/app/shared/constants/Api.constants";
import { getProperty } from "src/app/utils/app.utils";
import { KcreditLoanService } from "../loan/kcredit-loan.service";
import { AssociateLenderService } from "./associate-lender/associate-lender.service";
import { getFileExtension } from "../shared/file-upload/file-utils";
@Injectable({
  providedIn: "root",
})
export class UploadService {
  private readonly uploadEventsSource = new Subject<any>();
  readonly uploadServiceEvent = this.uploadEventsSource.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly associateLenderService: AssociateLenderService,
    private readonly loanApplicationService: KcreditLoanService
  ) {}

  setUploadServiceEventData(data: any) {
    this.uploadEventsSource.next(data);
  }

  async uploadFiles(
    files: File[],
    uploadLoanStage: string = ""
  ): Promise<string[]> {
    const uploadPromises: Promise<string>[] = [];

    for (const file of files) {
      const formData: FormData = new FormData();
      formData.append("file", file, file.name);
      formData.append("uploadPhase", uploadLoanStage);

      const uploadPromise = this.uploadFile(formData);
      uploadPromises.push(uploadPromise);
    }

    return Promise.all(uploadPromises);
  }

  private uploadFile(formData: FormData): Promise<any> {
    return this.http
      .post(`${KREDILINE_SERVER_URL}${UPLOAD_DECISIONING_REPORTS}`, formData, {
        responseType: "text",
      })
      .toPromise()
      .then((response) => response)
      .catch((error) => Promise.reject(new Error(error)));
  }

  fetchUploadReports(
    uploadLoanStage: string = "",
    page = 0,
    size = 10,
    sortColumn = "createdDate"
  ): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params
      .append("uploadPhase", uploadLoanStage)
      .append("page", page)
      .append("size", size)
      .append("sort", sortColumn);
    return this.http.get<any>(
      `${KREDILINE_SERVER_URL}${FETCH_UPLOAD_DECISIONING_REPORTS}`,
      { params }
    );
  }

  async uploadLoanDocuments(
    files: Array<File>,
    loanId: any = null,
    remarks: string = ""
  ): Promise<any> {
    const formData = new FormData();
    files.forEach((file) => formData.append("documents", file, file.name));
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
  /** Update this method name to upload Reports - after migration */
  async uploadCkycReports(files: File[] = [], uploadReportData: any = {}, uploadDocumentType: string = null) {
    const partnerId = getProperty(
      this.associateLenderService.getLenderData(),
      "partnerId",
      null
    );
    return files.map(
      async (file) =>
        await this.uploadCkycReport(file, uploadReportData, partnerId, uploadDocumentType)
    );
  }

  async uploadKiScoreReport(files: File[]) {
    const partnerId = getProperty(
      this.associateLenderService.getLenderData(),
      "partnerId",
      null
    );
    const request = files.map((file) => ({
      type: "DEFAULT",
      fileName: file.name,
      partnerId,
    }));
    const signedUrlResponse: any = await this.createBulkPreSignedS3URL(
      request
    ).toPromise();

    if (signedUrlResponse && signedUrlResponse?.length) {
      let uploadPromises = await signedUrlResponse.map(
        async (fileResponse, index) => {
          await this.uploadFileBySignedURL(
            getProperty(fileResponse, "preSignedUrl", ""),
            files[index]
          ).toPromise();
        }
      );
      await Promise.all(uploadPromises).then();

      const requestPayload = signedUrlResponse.map((fileResponse) => {
        let extension = getFileExtension(fileResponse?.fileName);
        let type = "";
        if (["xls", "xlsx", "csv"].includes(extension)) {
          type = "BKS_FILE_UPLOAD";
        } else {
          type = "BKS_CB_DATA_UPLOAD";
        }

        return {
          purpose: "Internal",
          type: type,
          fileUploadDetail: fileResponse,
        };
      });

      return await this.initiateKiScoreUpload(requestPayload).toPromise();
    }
    return null;
  }

  async uploadCkycReport(
    file: File,
    uploadReportData: any = {},
    partnerId: number = null,
    uploadDocumentType: string = null
  ) {
    const request = {
      type: getProperty(uploadReportData, "value", ""),
      fileName: file.name,
      partnerId,
    };

    if(uploadDocumentType) {
      request["uploadDocumentType"] = uploadDocumentType;
    }

    const signedUrlResponse = await this.createPreSignedS3URL(
      request
    ).toPromise();
    await this.uploadFileBySignedURL(
      getProperty(signedUrlResponse, "preSignedUrl", ""),
      file
    ).toPromise();

    await this.initiateFileProcessing({
      payload: signedUrlResponse,
      type: getProperty(uploadReportData, "reportTableKey", ""),
    }).toPromise();
  }
  async uploadFilesToS3(
    files: File[] = [],
    uploadDocumentType: string = null,
    deviationId: number = null
  ): Promise<any> {
    const partnerId = getProperty(
      this.associateLenderService.getLenderData(),
      "partnerId",
      null
    );
    let signedUrlResponses = await Promise.all(
      files.map(async (file) => this.createPreSignedDto(file, partnerId))
    );

    if (uploadDocumentType) {
      signedUrlResponses = signedUrlResponses.map((responses) => {
        return {
          ...responses,
          uploadDocumentType: uploadDocumentType,
        };
      });
    }

    const response = await this.saveDocRecord(
      signedUrlResponses,
      this.loanApplicationService.getLoanId(),
      deviationId
    );
    if (uploadDocumentType !== "DeviationRemarkDocument") {
      window.location.reload();
    }
    return response;
  }
  async createPreSignedDto(file: File, partnerId: number = null) {
    const request = {
      fileName: file.name,
      partnerId,
    };

    const signedUrlResponse = await this.createPreSignedS3URL(
      request
    ).toPromise();
    await this.uploadFileBySignedURL(
      getProperty(signedUrlResponse, "preSignedUrl", ""),
      file
    ).toPromise();
    return signedUrlResponse;
  }
  createPreSignedS3URL(requestPayload: any) {
    return this.http.put(
      `${KREDILINE_SERVER_URL}${CREATE_PRE_SIGNED_S3_URL}`,
      requestPayload
    );
  }

  createBulkPreSignedS3URL(requestPayload: any) {
    return this.http.put(
      `${KREDILINE_SERVER_URL}${CREATE_BULK_PRE_SIGNED_S3_URL}`,
      requestPayload
    );
  }

  uploadFileBySignedURL(url, file: File) {
    return this.http.put(url, file, {
      responseType: "text",
    });
  }
  initiateFileProcessing({ payload, type, purpose = "Internal" }) {
    console.log(payload);
    const requestPayload = {
      purpose: purpose,
      type: type,
      fileUploadDetail: payload,
    };

    return this.http.put(`${UPLOAD_REPORTS}`, requestPayload, {
      responseType: "text",
    });
  }
  initiateKiScoreUpload(requestPayload = []) {
    return this.http.put(`${UPLOAD_KISCORE_REPORTS}`, requestPayload, {
      responseType: "text",
    });
  }

  async saveDocRecord(
    requestPayload: Array<any>,

    loanId: number,

    deviationId: number = null
  ) {
    let params = new HttpParams()
      .append("loanApplicationId", loanId)
      .append("deviationId", deviationId ?? "");
    return await this.http
      .post(`${KREDILINE_SERVER_URL}${UPDATE_FILES}`, requestPayload, {
        params,
      })
      .toPromise();
  }

  deleteUploadedDocuments(
    loanId: number,
    documentId: number | string = null
  ): Observable<any> {
      const url = `${DELETE_DOCUMENTS}/${loanId}`;
    const params = new HttpParams().append("documentId", documentId);
    return this.http.delete(url, {
      params,
    });
  }
}
