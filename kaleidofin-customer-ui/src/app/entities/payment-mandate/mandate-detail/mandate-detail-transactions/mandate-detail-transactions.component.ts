import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { isEmpty } from "lodash";
import { getProperty } from "src/app/utils/app.utils";
import { STATUS_VIEW_MAPPER } from "../../payment-mandate.constants";

@Component({
  selector: "app-mandate-detail-transactions",
  templateUrl: "./mandate-detail-transactions.component.html",
  styleUrls: [
    "../../payment-mandate.scss",
    "./mandate-detail-transactions.component.scss",
  ],
})
export class MandateDetailTransactionsComponent implements OnInit, OnChanges {
  statusIndicator: string = "red-indicator";
  statusViewMapper = STATUS_VIEW_MAPPER;
  displayedColumns: string[] = [
    "dueDate",
    "executionDate",
    "siTransactionId",
    "failureReason",
    "status",
    "noOfRetryLeft",
  ];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input() mandateTransactions: any = {};

  dataSource: MatTableDataSource<Array<any>>;
  /* Pagination */
  page: number = 0;
  pageSize: number = 5;
  currentPage: number = 0;
  resultsLength: number = 0;

  tableData: Array<any> = [];
  @Output() fetchMandateTransactions: EventEmitter<any> =
    new EventEmitter<any>();

  ngOnInit() {
    this.dataSource = new MatTableDataSource([]);
    this.getTransactions();
  }
  ngOnChanges(changes: SimpleChanges): void {
    let transactions = getProperty(changes, "mandateTransactions.currentValue");
    if (!isEmpty(transactions)) {
      this.loadMandateTransactions();
    }
  }

  loadMandateTransactions() {
    this.tableData = getProperty(this.mandateTransactions, "content", []);
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.sort = this.sort;
    this.resultsLength = getProperty(
      this.mandateTransactions,
      "totalElements",
      0
    );

    this.dataSource.sortingDataAccessor = (item, property) => {
      return item[property];
    };
  }

  onPageChange(pageEvent: PageEvent) {
    this.page = pageEvent.pageIndex;
    this.currentPage = pageEvent.pageIndex;
    this.getTransactions();
  }
  getTransactions() {
    this.fetchMandateTransactions.emit({
      page: this.page,
      pageSize: this.pageSize,
    });
  }
}
