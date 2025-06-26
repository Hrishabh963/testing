import { ChartOptions } from 'chart.js';
import { DashboardService } from '../dashboard.service';
import {
  NachChartDataDTO,
  NachMetricsDTO,
  PaymentsMetricsDTO,
} from './dashboard.model';

import { PrincipalService } from 'src/app/core';
import { TopNavService } from 'src/app/layouts/navbar/topnav.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public chart: boolean = false;
  public barChart: boolean = true;
  public readonly barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          gridLines: { display: false },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    legend: {
      position: 'bottom',
      align: 'end',
      labels: {
        boxWidth: 12,
      },
    },
  };
  public barChartLabels: any[] = [];
  public readonly barChartType: any = 'bar';
  public readonly barChartLegend = true;
  public readonly barChartPlugins = [];
  public barChartData: any[] = [];
  public readonly barChartColors: any[] = [
    { backgroundColor: '#4985DF' },
    { backgroundColor: '#39B690' },
    { backgroundColor: '#FFC368' },
    { backgroundColor: '#FF6969' },
  ];
  public readonly lineChartLabels: any[] = [];
  public readonly lineChartType: any = 'line';
  public readonly lineChartData: any[] = [];
  public readonly lineChartColors: any[] = [
    {
      borderColor: '#4985DF',
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      pointBackgroundColor: '#4985DF',
    },
    {
      borderColor: '#39B690',
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      pointBackgroundColor: '#39B690',
    },
    {
      borderColor: '#FFC368',
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      pointBackgroundColor: '#FFC368',
    },
    {
      borderColor: '#FF6969',
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      pointBackgroundColor: '#FF6969',
    },
  ];
  paymentsData: PaymentsMetricsDTO = new PaymentsMetricsDTO();
  nachMandatesData: NachMetricsDTO = new NachMetricsDTO();
  nachMandateChartData: NachChartDataDTO = new NachChartDataDTO();
  showYesterday: boolean = false;
  startDate: string = '';
  endDate: string = '';

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly principal: PrincipalService,
    private readonly topNavService: TopNavService
  ) {}

  ngOnInit() {
    this.principal.identity().then((account: any) => {
      this.dashboardService.sendMessage('shownav');
      this.topNavService.topNav$.next('dashboard');
    });
  }

  getDateRange(e: any) {
    this.startDate = e.startDate;
    this.endDate = e.endDate;
    this.getData();
  }

  getData() {
    this.getDashboardData(this.startDate, this.endDate);
  }

  getDashboardData(startDate: string, endDate: string) {
    this.dashboardService
      .getDashboardData(startDate, endDate)
      .subscribe((response: any) => {
        this.paymentsData = response.body.paymentsData;
        this.nachMandatesData = response.body.nachMandatesData;
        this.showYesterday = response.body.showYesterday;
        this.handleChartData();
      });
  }

  handleChartData() {
    if (this.nachMandatesData.nachChartData == null) {
      this.chart = false;
    } else {
      this.chart = true;
    }
    this.nachMandateChartData = this.nachMandatesData.nachChartData;
    this.barChartLabels = this.nachMandateChartData.labels;
    this.barChartData = [
      { data: this.nachMandateChartData.totalReceived, label: 'Total' },
      { data: this.nachMandateChartData.totalApproved, label: 'Approved' },
      { data: this.nachMandateChartData.totalProcessing, label: 'Processing' },
      { data: this.nachMandateChartData.totalRejected, label: 'Rejected' },
    ];
  }
}
