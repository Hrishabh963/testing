import { Component } from "@angular/core";

@Component({
  selector: "app-business-registration-details",
  templateUrl: "./business-registration-details.component.html",
  styleUrls: ["../business-review-details.scss"],
})
export class BusinessRegistrationDetailsComponent {
  businessRegistrationfields = [
    { label: "Reference Number", value: "referenceNumber" },
    { label: "Company number", value: "companyNumber" },
  ];

  tradeLicenseFields = [
    { label: "Master approval number", value: "masterApprovalNumber" },
    { label: "UCR number", value: "ucrNumber" },
  ];
}
