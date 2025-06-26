import { Component, OnInit } from "@angular/core";
import { PrincipalService } from "src/app/core";
import { DashboardService } from "src/app/entities/dashboard/dashboard.service";
import { BusinessMetrics } from "../../services/business-invoice/business-invoice.constants";
import { BusinessInvoiceService } from "../../services/business-invoice/business-invoice.service";

@Component({
  selector: "app-overview",
  templateUrl: "./kicredit-overview.component.html",
  styleUrls: ["./kicredit-overview.component.scss"],
})
export class KicreditOverviewComponent implements OnInit {
  businessMetricsCount: BusinessMetrics = {};
  overviewItems: Array<any> = [
    {
      icon: "assets/images/overview/business-onboarding.svg",
      label: "Business Onboarding",
      propertyKey: "onboardedNumberOfBusinesses"
    },
    {
      icon: "assets/images/overview/invoice-review.svg",
      label: "Invoice Review",
      propertyKey: "invoiceReviewedNumberOfBusinesses"
    },
    {
      icon: "assets/images/overview/invoice-agreement.svg",
      label: "Invoice Agreement",
      propertyKey: "invoiceAgreementSignedNumberOfBusinesses"
    },
    {
      icon: "assets/images/overview/disbursal.svg",
      label: "Disbursal",
      propertyKey: "disbursedNumberOfBusinesses"
    },
    {
      icon: "assets/images/overview/collection.svg",
      label: "Collection",
      propertyKey: "collectionStartedNumberOfBusinesses"
    },
  ];

  constructor(
    private readonly principalService: PrincipalService,
    private readonly dashboardService: DashboardService,
    private readonly businessInvoiceService: BusinessInvoiceService
  ) {}

  ngOnInit(): void {
    this.principalService.identity().then(() => {
      this.dashboardService.sendMessage("shownav");
    });
    this.businessInvoiceService.fetchBusinessOverviewCount().subscribe(
      {
        next: (response)=> {
          this.businessMetricsCount = {...response};
        },
        error: (error)=> {
          console.error(error);
        }
      }
    );
  }
}
