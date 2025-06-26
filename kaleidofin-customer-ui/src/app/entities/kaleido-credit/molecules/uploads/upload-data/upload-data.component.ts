import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { getProperty } from "src/app/utils/app.utils";
import { ReportsDataUtilsService } from "src/app/utils/reports-data-utils.service";
import { LOAN_CKYC_REPORTS_UPLOAD_TYPES } from "../../../upload/kcredit-upload.constants";

@Component({
  selector: "app-upload-data",
  templateUrl: "./upload-data.component.html",
  styleUrls: ["./upload-data.component.scss"],
})
export class UploadDataComponent implements OnInit {
  @Input() config: BehaviorSubject<any> = undefined;
  @Input() tableData: Array<any> = [];
  @Input() totalItems: number = 0;
  @Input() page: number = 0;
  @Input() itemsPerPage: any = 0;
  @Output() loadPage = new EventEmitter<any>();
  @Input() links: any;

  selectedReportType: string = null;
  previousPage: number = 0;
  routeData: any;
  sortColumn: string = "";

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    public readonly dialog: MatDialog,
    private readonly dataUtils: ReportsDataUtilsService
  ) {}

  ngOnInit(): void {
    this.itemsPerPage = 10;
    this.sortColumn = "createdDate,desc";

    this.routeData = this.activatedRoute.data.subscribe((data) => {
      if (data?.["pagingParams"]) {
        this.page = data["pagingParams"].page;
        this.previousPage = data["pagingParams"].page;
      }
    });
  }

  getReportType(reportData: any): string {
    const reportType = getProperty(reportData, "taskDetail.type", "");
    if (reportType) {
      if (this.config) {
        const allReportsTypes: any[] =
          this.config.getValue()?.uploadReportTypes ?? [];
        let reportSelectionObject = allReportsTypes?.find((reportTypes) => {
          return reportType === reportTypes?.reportTableKey;
        });
        reportSelectionObject =
          reportSelectionObject ??
          LOAN_CKYC_REPORTS_UPLOAD_TYPES.find(
            (report) => reportType === report.reportTableKey
          );
        return getProperty(reportSelectionObject, "reportTableValue", "---");
      }
    }
    return "---";
  }

  loadDataByPage(pageNumber: any) {
    this.loadPage.emit(pageNumber);
  }
}
