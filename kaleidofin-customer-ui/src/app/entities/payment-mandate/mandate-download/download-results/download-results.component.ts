import { Component, OnInit, ViewChild } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FileService } from "src/app/entities/kaleido-credit/services/files/file.service";
import { getProperty } from "src/app/utils/app.utils";
import { STATUS_VIEW_MAPPER, UserData } from "../../payment-mandate.constants";
import { PaymentMandateService } from "../../payment-mandate.service";

@Component({
  selector: "app-download-results",
  templateUrl: "./download-results.component.html",
  styleUrls: [
    "../../payment-mandate.scss",
    "./download-results.component.scss",
  ],
})
export class DownloadResultsComponent implements OnInit {
  reportType = {
    SBM_MANDATE_DETAILS: "SBM SI Mandate Details",
    MANDATE_TRANSACTIONS: "EMI Collection",
  };

  displayedColumns: string[] = [
    "date",
    "fileName",
    "reportType",
    "duration",
    "status",
    "action",
  ];
  /* Pagination */
  page: number = 0;
  sortBy: string = "id,desc";
  pageSize: number = 5;
  currentPage: number = 0;
  resultsLength: number = 0;

  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatSort) sort: MatSort;
  tableData: Array<UserData>;

  constructor(
    private readonly paymentMandateService: PaymentMandateService,
    private readonly fileService: FileService
  ) {}

  statusViewMapper = STATUS_VIEW_MAPPER;
  durationViewMapper = {
    last30Days: "Last 30 days",
    last3Months: "Last 3 months",
    last6Months: "Last 6 months",
    lastYear: "Last year",
    dateRange: "Date range",
  };
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource([]);
    this.loadMandateReports();
  }

  loadMandateReports() {
    this.paymentMandateService
      .getAllMandateReports(this.pageSize, this.page, this.sortBy)
      .subscribe(
        (response: Array<any>) => {
          this.tableData = getProperty(response, "content", []);
          this.resultsLength = getProperty(response, "totalElements", 0);
          this.dataSource = new MatTableDataSource(this.tableData);
          this.dataSource.sort = this.sort;

          this.dataSource.sortingDataAccessor = (item, property) => {
            if (property) {
              return item.createdDate;
            } else {
              return item[property];
            }
          };
        },
        (error) => console.error(error)
      );
  }

  onPageChange(pageEvent: PageEvent) {
    console.log(pageEvent);
    this.currentPage = pageEvent.pageIndex;
    this.page = pageEvent.pageIndex;
    this.loadMandateReports();
  }

  downloadReports(fileId) {
    this.fileService.downloadMandateReports(fileId);
  }
}
