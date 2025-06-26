import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { PaymentService } from '../payment.service';
import { Payment } from '../payment.model';
import { DashboardService } from '../../dashboard/dashboard.service';
import { TooltipPosition } from '@angular/material/tooltip';
import { CurrencyPipe } from '@angular/common';
import { PrincipalService } from 'src/app/core';
import { TopNavService } from 'src/app/layouts/navbar/topnav.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit {
  public pageSize = 10;
  public currentPage = 0;
  resultsLength = 0;
  @ViewChild(MatSort, { static: false })
  sort!: MatSort;
  tooltipPosition: TooltipPosition = 'before';
  startDate: string = '';
  endDate: string = '';
  sortBy: string = '';
  isAsc: boolean = false;
  order: string = '';
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns: string[] = [
    'd.createdDate',
    'c.name',
    'product',
    'branch',
    'payment',
    'transaction',
    'status',
  ];
  data: Payment[] = [];

  constructor(
    private readonly paymentService: PaymentService,
    private readonly dashboardService: DashboardService,
    private readonly principal: PrincipalService,
    private readonly currencyPipe: CurrencyPipe,
    private readonly topNavService: TopNavService
  ) {}

  ngOnInit() {
    this.sortBy = 'd.createdDate';
    this.order = 'desc';
    this.principal.identity().then((account) => {
      this.dashboardService.sendMessage('shownav');
      this.topNavService.topNav$.next('payments');
    });
  }

  getDateRange(e: any) {
    this.startDate = e.startDate;
    this.endDate = e.endDate;
    this.getData();
  }

  getData() {
    this.getPaymentsList(
      this.startDate,
      this.endDate,
      this.pageSize,
      this.currentPage,
      this.sortBy,
      this.order
    );
  }

  getPaymentsList(
    startDate: string,
    endDate: string,
    pageSize: number,
    currentPage: number,
    sortBy: string,
    order: string
  ) {
    this.paymentService
      .getPaymentsList(startDate, endDate, pageSize, currentPage, sortBy, order)
      .subscribe((response: any) => {
        this.data = response.content;
        this.resultsLength = response.totalElements;
      });
  }

  handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getData();
  }

  sortData(event: any) {
    if (!this.sort.active || this.sort.direction === '') {
      this.sortBy = 'd.createdDate';
      this.order = 'desc';
      this.getData();
      return;
    }
    this.sortBy = this.sort.active;
    this.order = this.sort.direction;
    this.getData();
  }

  getTooltip(data: Payment): string {
    if (data.fee) {
      return (
        'Due Amount : ' +
        this.currencyPipe.transform(data.demandAmount, 'INR', 'symbol') +
        '\n' +
        'Processing fee : ' +
        this.currencyPipe.transform(data.fee, 'INR', 'symbol')
      );
    }
    return (
      'Due Amount : ' +
      this.currencyPipe.transform(data.demandAmount, 'INR', 'symbol')
    );
  }
}
