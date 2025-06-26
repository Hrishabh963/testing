import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { getProperty } from "./app.utils";
import { isEmpty } from "lodash";
import { SubscriptionReviewService } from "../entities/kaleido-credit/services/customer-group/subscription-review/subscription-review.service";
import { FileService } from "../entities/kaleido-credit/services/files/file.service";
import { REPLAY_REPORT_PROCESSING } from "../shared/constants/Api.constants";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class ReportsDataUtilsService {
  constructor(
    private readonly subscriptionReviewService: SubscriptionReviewService,
    private readonly fileService: FileService,
    private readonly http: HttpClient,
    private readonly snackBar: MatSnackBar
  ) { }
  getDate(reportData: any = {}) {
    return getProperty(reportData, "taskDetail.createdDate", "---");
  }
  getUserName(reportData: any = {}) {
    return getProperty(reportData, "taskDetail.createdBy", "---");
  }
  getDateRange(reportData: any): string {
    const additionalData = JSON.parse(
      getProperty(reportData, "taskDetail.additionalData")
    );
    if (!isEmpty(additionalData)) {
      return `${getProperty(additionalData, "startDate", "")} - ${getProperty(
        additionalData,
        "endDate",
        ""
      )}`;
    }
    return "---";
  }

  getPartner(reportData: any, allPartners: any = []) {
    const additionalData: any = JSON.parse(
      getProperty(reportData, "taskDetail.additionalData")
    );
    const partnerIds = getProperty(additionalData, "partnerId", []);
    if (!isEmpty(partnerIds)) {
      let partners = partnerIds.map((partnerId) =>
        allPartners.find((partner) => partner.id === partnerId)
      );

      return partners.map((data) => getProperty(data, 'name', "---")).join(",");
    }
    return "---";
  }

  getProductType(reportData: any) {
    const additionalData = JSON.parse(
      getProperty(reportData, "taskDetail.additionalData")
    );
    if (additionalData) {
      const loanTypes: string[] = getProperty(additionalData, "loanType", []);
      return isEmpty(loanTypes) ? "---" : loanTypes.join(",");
    }
    return "---";
  }
  getReportStatus(reportData: any) {
    return getProperty(reportData, "taskDetail.status", "---");
  }

  getReportRemarks(reportData: any) {
    return getProperty(reportData, "taskDetail.remarks", "");
  }

  getFileName(reportData) {
    const fileMappings: Array<any> = getProperty(
      reportData,
      "fileMappings",
      []
    );
    if (isEmpty(fileMappings)) {
      const status: string = this.getReportStatus(reportData);
      return status.toLowerCase() === "in_progress"
        ? "--"
        : "Data not available";
    }
    return fileMappings
      .map((file) => `${file.fileType}_${file.fileId}`)
      .join(",");
  }

  validateFileId(reportData: any) {
    const files: Array<any> = getProperty(reportData, "fileMappings", []);
    return isEmpty(files);
  }

  downLoadFile(reportData: any) {
    const files: Array<any> = getProperty(reportData, "fileMappings", []);
    files.forEach((file) =>
      this.subscriptionReviewService
        .getFileDtoFromFileId(getProperty(file, "fileId", null))
        .subscribe((response) => {
          console.log(response);
          const url = getProperty(response, "path", null);
          const fileType = getProperty(response, "type", null);
          if (["pdf", "xlsx", "xls", "csv", "zip", 'doc', 'csv'].includes(fileType)) {
            window.open(url, "_blank");
          } else {
            this.fileService.downloadFromS3(url);
          }
        })
    );
  }

  replayReportProcessing(reportData: any) {
    const taskId = getProperty(reportData, 'taskDetail.id');
    if (!!taskId) {
      this.http.post(REPLAY_REPORT_PROCESSING, {},
        {
          params: new HttpParams().append('taskId', taskId),
        }
      )
        .subscribe(
          (response) => {
            this.openInformationSnackBar(getProperty(response, "message", "Successfully retried!"))
          },
          (err) => {
            console.error(err);
            this.openInformationSnackBar(getProperty(err, "message", "Failed to replay due to server error!"))
          }
        );
    } else {
      this.openInformationSnackBar("Unable to retry report processing")
    }
  }

  private openInformationSnackBar(message: string) {
    this.snackBar.open(message, "", { duration: 3000 })
  }

}
