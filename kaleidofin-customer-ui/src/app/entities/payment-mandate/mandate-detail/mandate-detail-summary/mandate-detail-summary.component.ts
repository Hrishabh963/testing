import { Component, Input } from "@angular/core";
import { PaymentMandateData } from "../../payment-mandate.constants";

@Component({
  selector: "app-mandate-detail-summary",
  templateUrl: "./mandate-detail-summary.component.html",
  styleUrls: [
    "../../payment-mandate.scss",
    "./mandate-detail-summary.component.scss",
  ],
})
export class MandateDetailSummaryComponent {
  @Input() mandateInfo: PaymentMandateData;

  constructor() {}

}
