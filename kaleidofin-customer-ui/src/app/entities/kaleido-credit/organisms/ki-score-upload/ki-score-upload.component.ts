import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";

import { HttpResponse } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { get, isEmpty } from "lodash";
import { DashboardService } from "src/app/entities/dashboard/dashboard.service";
import { KiscoreDataUploadComponent } from "../../molecules/kiscore-data-upload/kiscore-data-upload.component";
import { KiScoreService } from "../../services/ki-score.service";
import { ACCEPTED_FILE_TYPES_FOR_KISCORE_UPLOAD } from "../../shared/file-upload/file.constants";
import { FileService } from "../../services/files/file.service";
import { SubscriptionReviewService } from "../../services/customer-group/subscription-review/subscription-review.service";

export interface CustomerData {
  id: number;
  uploadedDate: string;
  fileName: string;
  reportType: string;
  kiScored: number;
  uploaded: number;
  approved: number;
  rejected: number;
  status: string;
  statusMessage: string;
  reportStatus: string;
  reportFileId: number;
  partnerIds: Array<number>;
}

@Component({
  selector: "app-ki-score-upload",
  templateUrl: "./ki-score-upload.component.html",
  styleUrls: ["./ki-score-upload.component.scss"],
})
export class KiScoreUploadComponent implements OnInit, AfterViewInit {
  hadKiscoreData: boolean = false;
  displayedColumns: string[] = [
    "uploadedDate",
    "fileName",
    "reportType",
    "kiScored",
    "approved",
    "rejected",
    "actions",
  ];

  acceptedFileTypes: string[] = ACCEPTED_FILE_TYPES_FOR_KISCORE_UPLOAD;
  fileUploadTitle: string = "Drag & drop Customers data for Scoring";
  uploadInfoText = "Max file size should be within 100MB";
  selectedDocuments = [];
  page: number = 0;
  previousPage: number = 0;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  statusMapper = {
    FAILED: "Failed",
    IN_PROGRESS: "In Progress",
    SUCCESS: "Success",
    SCHEDULED: "Scheduled",
  };

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  kiscoreResults: CustomerData[] = [];
  dataSource = new MatTableDataSource<CustomerData>(this.kiscoreResults);

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly kiscoreService: KiScoreService,
    private readonly fileService: FileService,
    private readonly subscriptionReviewService: SubscriptionReviewService
  ) {}

  ngOnInit(): void {
    this.dashboardService.sendMessage("shownav");
    this.fetchCustomerKiscore();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  viewData(element: CustomerData) {
    this.router.navigate(["/kcredit/kiscore", element?.id]);
  }

  receiveFileSelected(files: File[]) {
    this.selectedDocuments = files;
  }

  openKiScoreUploads(event: any) {
    console.log(event);
    this.dialog.open(KiscoreDataUploadComponent, {
      minWidth: "45vw",
      maxHeight: "80vh",
      data: {
        dialogTitle: "Customer ki score",
        openByDefault: false,
        reload: () => this.fetchCustomerKiscore(),
      },
    });
  }

  fetchCustomerKiscore() {
    let requestPayload = {
      page: this.page,
      size: this.itemsPerPage,
      type: "BKS_FILE_UPLOAD",
    };
    this.kiscoreService.fetchCustomerKiScoreData(requestPayload).subscribe(
      (response: HttpResponse<any>) => {
        console.log(response);
        this.onSuccess(get(response, "body", []));
      },
      (error: HttpResponse<any>) => this.onError(error)
    );
  }

  formatResponse(kiscoreResultsData: Array<any> = []): Array<CustomerData> {
    if (!kiscoreResultsData) {
      return [];
    }
    return kiscoreResultsData.map((results) => {
      let data = results?.taskDetail;
      let additionalData = get(data, "additionalData", "{}");
      if (additionalData) {
        additionalData = JSON.parse(additionalData);
      }

      return {
        id: data?.id,
        uploadedDate: data?.createdDate,
        fileName: data?.fileName,
        reportType: "Customer ki score",
        kiScored:
          get(additionalData, "totalNoOfLoanApplicationsAccepted", 0) +
          get(additionalData, "totalNoOfLoanApplicationsRejected", 0),
        uploaded: get(additionalData, "totalNoOfLoanApplications", 0),
        approved: get(additionalData, "totalNoOfLoanApplicationsAccepted", 0),
        rejected: get(additionalData, "totalNoOfLoanApplicationsRejected", 0),
        status: data?.status,
        statusMessage: this.getStatusRemarks(
          data?.status,
          get(additionalData, "totalNoOfLoanApplications", 0)
        ),
        reportStatus: get(additionalData, "reportTaskStatus", null),
        reportFileId: get(additionalData, "reportFileId", 0),
        partnerIds: get(additionalData, "partnerId", []),
      };
    });
  }

  private onSuccess(data) {
    const kiscoreResultsData = get(data, "content", []);
    this.kiscoreResults = this.formatResponse(kiscoreResultsData);
    this.hadKiscoreData = !isEmpty(this.kiscoreResults);
    this.dataSource.data = this.kiscoreResults;
    this.totalItems = get(data, "totalElements", 0);
    if (this.paginator) {
      this.paginator.length = this.totalItems;
      this.paginator._intl.itemsPerPageLabel = "your custom text";
    }
  }
  private onError(error) {
    console.log(error);
  }

  onLoadPage(pageEvent: any = {}) {
    let currentPage = pageEvent?.pageIndex;
    this.page = currentPage;
    if (currentPage !== this.previousPage) {
      this.previousPage = currentPage;
      this.fetchCustomerKiscore();
    }
  }
  getStatusRemarks(status: string = "", totalApplications: number = 0) {
    let remark: string = "";
    switch (status) {
      case "FAILED":
        remark =
          "Unable to process the file. Download the response file for more details";
        break;
      case "SUCCESS":
        if (totalApplications) {
          remark = `All rows are successfully processed`;
        } else {
          remark = ``;
        }
        break;
      case "IN_PROGRESS":
      case "PENDING":
        remark = `File upload is in progress. Do check after some-time to download result file.`;
        break;
      default:
        break;
    }
    return remark;
  }
  getRangeLabel() {
    return "- jhtl";
  }

  generateReport(data: any = {}) {
    this.kiscoreService
      .generateReport(data?.id, data?.partnerIds)
      .toPromise()
      .then(() => {
        this.fetchCustomerKiscore();
      })
      .catch((error) => console.log(error));
  }

  downloadReport(data) {
    this.subscriptionReviewService
      .getFileDtoFromFileId(get(data, "reportFileId", null))
      .toPromise()
      .then((response) => {
        console.log(response);
        const url = get(response, "path", null);
        const fileType = get(response, "type", null);
        if (
          ["pdf", "xlsx", "xls", "csv", "zip", "doc", "csv"].includes(fileType)
        ) {
          window.open(url, "_blank");
        } else {
          this.fileService.downloadFromS3(url);
        }
      });
  }

}
