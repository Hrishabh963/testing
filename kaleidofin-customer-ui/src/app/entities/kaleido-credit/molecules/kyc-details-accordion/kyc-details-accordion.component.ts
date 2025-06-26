import { Component, Input, OnInit } from "@angular/core";
import { KycDetailsForLoan } from "../../models/kyc-details.model";
import { CustomerService } from "../../services/customer/customer.service";
import { get } from "lodash";
import { LoanReviewService } from "../../report/loan-review.service";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-kyc-details-accordion",
  templateUrl: "./kyc-details-accordion.component.html",
})
export class KycDetailsAccordionComponent implements OnInit {
  @Input() partnerId: number;
  @Input() title: string = "";
  @Input() entityType: string = "";
  @Input() kycDocumentList: Array<KycDetailsForLoan> =
    new Array<KycDetailsForLoan>();
  @Input() loanId: number;
  @Input() showSubHeading: boolean = false;
  eKycStatus: string = null;
  poiDocs: Array<KycDetailsForLoan> = new Array<KycDetailsForLoan>();
  poaDocs: Array<KycDetailsForLoan> = new Array<KycDetailsForLoan>();
  poiPanelOpenState: boolean = true;
  poaPanelOpenState: boolean = true;
  constructor(
    private readonly customerService: CustomerService,
    private readonly loanReviewService: LoanReviewService
  ) {}

  ngOnInit(): void {
    this.poiDocs = this.customerService.getKycDocuments(
      this.kycDocumentList,
      "POI",
      this.entityType
    );
    this.poaDocs = this.customerService.getKycDocuments(
      this.kycDocumentList,
      "POA",
      this.entityType
    );
    const entityId = getProperty(this.poiDocs,'[0].entityId',null) ??  getProperty(this.poaDocs,'[0].entityId',null) 
    if (entityId) {
      this.eKycStatus = this.loanReviewService.getEkycStatusForObligators(entityId);
    }
  }

  checkSectionVisibility(type) {
    switch (type) {
      case "poa":
        return get(this.poaDocs, "length", 0) > 0;
      case "poi":
        return get(this.poiDocs, "length", 0) > 0;
      case "docs":
        return (
          get(this.poaDocs, "length", 0) > 0 ||
          get(this.poiDocs, "length", 0) > 0
        );
      default:
        return false;
    }
  }
}
