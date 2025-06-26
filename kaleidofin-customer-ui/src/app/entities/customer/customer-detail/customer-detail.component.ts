import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrincipalService } from 'src/app/core';
import { DashboardService } from '../../dashboard/dashboard.service';
import {
  CustomerDetails,
  PaymentDTO,
  SubscriptionDetailsDTO,
} from '../customer-detail.model';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
})
export class CustomerDetailComponent implements OnInit {
  customerDetailsDTO: CustomerDetails = {};
  subscriptionDetails: SubscriptionDetailsDTO = {};
  paymentsList: PaymentDTO[] = [];
  hasPayments = false;
  displayedColumns: string[] = [
    'date',
    'payment',
    'transactionId',
    'status',
    'mode',
    'info',
  ];
  customerId: number = 0;
  panelOpenState: boolean = false;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly principal: PrincipalService,
    private readonly dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.principal.identity().then((account) => {
      this.dashboardService.sendMessage('shownav');
    });
    this.activatedRoute.data.subscribe((response: any) => {
      this.customerDetailsDTO = response.resolveData;
      console.log(this.customerDetailsDTO);
    });
  }

  loadPaymentsData(i: number) {
    if (this.customerDetailsDTO.customerSubscriptionsList !== null) {
      this.subscriptionDetails =
        this.customerDetailsDTO.customerSubscriptionsList[i];
      if (this.subscriptionDetails.paymentsList.length > 0) {
        this.paymentsList = this.subscriptionDetails.paymentsList;
        this.hasPayments = true;
      } else {
        this.paymentsList = [];
        this.hasPayments = false;
      }
    }
  }

  backToCustomers() {
    this.router.navigate(['customers']);
  }
}
