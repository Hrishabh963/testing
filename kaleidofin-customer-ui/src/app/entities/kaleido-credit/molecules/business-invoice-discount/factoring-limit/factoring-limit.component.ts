import { Component, OnInit } from "@angular/core";
import { BusinessInvoiceService } from "../../../services/business-invoice/business-invoice.service";

@Component({
  selector: "app-factoring-limit",
  templateUrl: "./factoring-limit.component.html",
  styleUrls: [
    "./factoring-limit.component.scss",
    "../business-review-details.scss",
  ],
})
export class FactoringLimitComponent implements OnInit {
  invoiceCreditLimit: string = "";
  businessCreditLimit: string = "";
  selectedLimit: number = null;
  outstandingLimits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectedCurrency: string = "USD";
  currencyList: Array<string> = ["USD", "KEN"];
  constructor(
    private readonly businessInvoiceService: BusinessInvoiceService
  ) {}

  ngOnInit(): void {
    this.businessInvoiceService.businessReviewInfo.subscribe(() => {
      const {
        invoiceCreditLimit,
        businessCreditLimit,
        currency,
        outstandingLimit,
      } = this.businessInvoiceService.getFactoringLimits();

      this.invoiceCreditLimit = invoiceCreditLimit;
      this.businessCreditLimit = businessCreditLimit;
      this.selectedCurrency = currency;
      this.selectedLimit = outstandingLimit;
    });
  }

  onSaveFactoringLimit(event) {
    event?.stopPropagation();
    event?.preventDefault();
    const payload = {
      currency: this.selectedCurrency,
      businessCreditLimit: this.businessCreditLimit,
      outstandingInvoiceLimit: this.selectedLimit,
      invoiceCreditLimit: this.invoiceCreditLimit,
    };
    this.businessInvoiceService.saveFactoringLimit(payload).subscribe();
  }
}
