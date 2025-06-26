import { Component } from "@angular/core";

@Component({
  selector: "app-business-registration-documents",
  templateUrl: "./business-registration-documents.component.html",
  styleUrls: ["../business-review-details.scss"],
})
export class BusinessRegistrationDocumentsComponent {
  documents = [
    {
      categoryLabel: "Proof of business",
      types: [
        {
          typeLabel: "Business Registration Certificate",
          type: "BusinessRegistrationCertificate",
        },
        {
          typeLabel: "Trade/Export license",
          type: "TradeExportLicense",
        },
      ],
    },
  ];
}
