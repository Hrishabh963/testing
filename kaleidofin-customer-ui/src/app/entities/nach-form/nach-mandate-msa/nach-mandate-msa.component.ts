import { Component, OnInit } from '@angular/core';
import { PrincipalService } from 'src/app/core';
import { DashboardService } from '../../dashboard/dashboard.service';

@Component({
  selector: 'nach-mandate-msa-nach-mandate-msa',
  templateUrl: './nach-mandate-msa.component.html'
})
export class NachMandateMsaComponent implements OnInit {
  constructor(
    private readonly principal: PrincipalService,
    private readonly dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.principal.identity().then((account) => {
      this.dashboardService.sendMessage('shownav');
    });
  }
}
