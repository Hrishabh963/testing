import { Component } from "@angular/core";

@Component({
  selector: "app-business-kyc-documents",
  templateUrl: "./business-kyc-documents.component.html",
  styleUrls: ["../business-review-details.scss"],
})
export class BusinessKycDocumentsComponent {
  documents = [
    {
      categoryLabel: "Personal Id proof",
      types: [
        { typeLabel: "National Id", type: "NationalId" },
        { typeLabel: "Business KRA certificate", type: "KRACertificate" },
        {
          typeLabel: "Business owner KRA certificate",
          type: "OwnerKRACertificate",
        },
      ],
    },
  ];
}
