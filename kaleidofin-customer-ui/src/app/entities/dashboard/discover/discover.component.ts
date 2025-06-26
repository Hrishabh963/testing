import { Component, OnInit } from '@angular/core';
import { PrincipalService } from 'src/app/core';
import { TopNavService } from 'src/app/layouts/navbar/topnav.service';

import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss'],
})
export class DiscoverComponent implements OnInit {
  constructor(
    private dashboardService: DashboardService,
    private principal: PrincipalService,
    private topNavService: TopNavService
  ) {}

  ngOnInit(): void {
    this.principal.identity().then((account: any) => {
      this.dashboardService.sendMessage('shownav');
      this.topNavService.topNav$.next('discover');
    });
  }
}
