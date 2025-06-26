import { Component, Input } from "@angular/core";
import { KycDetailsForLoan } from "../../models/kyc-details.model";

@Component({
  selector: "app-kyc-details",
  templateUrl: "./kyc-details.component.html",
  styleUrls: ["./kyc-details.component.scss"],
})
export class KycDetailsComponent {
  @Input() loanDetails: any = {};
  @Input() loanId: number;
  @Input() coApplicantKycDocumentList: Array<KycDetailsForLoan> =
    new Array<KycDetailsForLoan>();
}
