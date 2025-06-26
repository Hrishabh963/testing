import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject } from "rxjs";
import { getProperty } from "src/app/utils/app.utils";
import { UploadReportPopupComponent } from "../../../loan/components/upload-reports/upload-report-popup/upload-report-popup.component";
import { DEFAULT_UPLOAD_REPORT_TITLE } from "../../../upload/kcredit-upload.constants";
import { MatSnackBar } from "@angular/material/snack-bar";

export interface DownloadSampleFile {
  downloadText: string;
  downloadFilePath: string;
  downloadFileName: string;
}
@Component({
  selector: "app-upload-filter",
  templateUrl: "./upload-filter.component.html",
  styleUrls: ["./upload-filter.component.scss"],
})
export class UploadFilterComponent implements OnInit {
  @Input() config: BehaviorSubject<any> = undefined;
  @Output() fetchUploadedReports = new EventEmitter<any>();

  selectedReportType: string = "";
  reportTypes = [];
  reportsRouteUrl: string = "";
  acceptedFileTypes: string[] = [];
  uploadType: string = "";
  uploadInfoText: string = "";
  hasDefaultReport: boolean = false;
  downloadSampleFile: DownloadSampleFile = null;

  constructor(
    public readonly dialog: MatDialog,
    private readonly snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.config.subscribe((uiConfig) => {
      this.reportTypes = getProperty(uiConfig, "uploadReportTypes", []);
      this.reportsRouteUrl = getProperty(uiConfig, "reportsRouteUrl", []);
      this.acceptedFileTypes = getProperty(uiConfig, "acceptedFileTypes", []);
      this.uploadType = getProperty(uiConfig, "uploadType", []);
      this.uploadInfoText = getProperty(uiConfig, "uploadInfoText", []);
      this.downloadSampleFile = getProperty(
        uiConfig,
        "downloadSampleFile",
        null
      );
      const defaultReport = this.reportTypes.find((report) => {
        return report?.enabledDefault;
      });
      if (defaultReport) {
        this.hasDefaultReport = true;
        this.selectedReportType = defaultReport;
      }
    });
  }

  openUploadDialog = (): void => {
    this.dialog.open(UploadReportPopupComponent, {
      minWidth: "45vw",
      maxHeight: "80vh",
      data: {
        reportsRouteUrl: this.reportsRouteUrl,
        selectedReportType: this.selectedReportType,
        acceptedFileTypes: this.acceptedFileTypes,
        uploadType: this.uploadType, //This will be removed after Report Data Migration
        uploadLoanStatus: getProperty(this.selectedReportType, "value", ""),
        uploadInfoText: this.uploadInfoText,
        downloadSampleFile: this.downloadSampleFile,
        uploadDocumentType: getProperty(
          this.selectedReportType,
          "uploadDocumentType",
          ""
        ),
        dialogTitle: getProperty(
          this.selectedReportType,
          "dialogTitle",
          DEFAULT_UPLOAD_REPORT_TITLE
        ),
        reload: () => this.reloadUploadedReports(),
      },
    });
  };

  updateReportType() {
    this.fetchUploadedReports.emit({
      reportType: getProperty(this.selectedReportType, "value", ""),
    });
  }
  reloadUploadedReports() {
    this.fetchUploadedReports.emit({
      reportType: getProperty(this.selectedReportType, "value", ""),
    });
    this.snackbar.open("Updated Uploaded Reports!", "", { duration: 3000 });
  }
}
