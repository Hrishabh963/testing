import {  Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { PrincipalService } from 'src/app/core';
import { TopNavService } from 'src/app/layouts/navbar/topnav.service';
import { DashboardService } from '../../dashboard/dashboard.service';
import { Demand } from '../demand.model';
import { DemandService } from '../demand.service';

@Component({
  selector: 'app-demands',
  templateUrl: './demands.component.html',
  styleUrls: ['./demands.component.scss'],
})
export class DemandsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  public pageSize = 10;
  public currentPage = 0;
  public resultsLength = 0;
  displayedColumns = [
    'id',
    'createdDate',
    'category',
    'total',
    'success',
    'failure',
    'status',
  ];
  sortBy: string = '';
  order: string = '';
  data: Demand[] = [];
  constructor(
    private readonly route: Router,
    private readonly DemandService: DemandService,
    private readonly dashboardService: DashboardService,
    private readonly principal: PrincipalService,
    private readonly topNavService: TopNavService
  ) {}

  ngOnInit() {
    this.sortBy = 'createdDate';
    this.order = 'desc';
    this.principal.identity().then((account) => {
      this.dashboardService.sendMessage('shownav');
      this.topNavService.topNav$.next('demands');
    });
    this.getData();
  }

  getData() {
    this.DemandService.getDemandUploadList(
      this.pageSize,
      this.currentPage,
      this.sortBy,
      this.order
    ).subscribe((response) => {
      this.data = response.content || [];
      this.resultsLength = response.totalElements || 0;
      if (this.resultsLength == 0) {
        this.navigateToUpload();
      }
    });
  }

  navigateToUpload() {
    this.route.navigate(['uploadDemands']);
  }

  handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getData();
  }

  sortData() {
    if (!this.sort.active || this.sort.direction === '') {
      this.sortBy = 'createdDate';
      this.order = 'desc';
      this.getData();
      return;
    }
    this.sortBy = this.sort.active;
    this.order = this.sort.direction;
    this.getData();
  }
}
