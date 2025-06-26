import { Component } from "@angular/core";

@Component({
  selector: "app-other-business-documents",
  templateUrl: "./other-business-documents.component.html",
  styleUrls: ["../business-review-details.scss"],
})
export class OtherBusinessDocumentsComponent {
  documents = [
    {
      categoryLabel: "Membership certificate",
      category: "Membership certificate",
      types: [
        {
          typeLabel: "Membership certificate",
          type: "MembershipCertificate",
        },
      ],
    },
    {
      categoryLabel: "Horticulture crop directorate license",
      category: "Horticulture Crop Directorate License",
      types: [
        {
          typeLabel: "Horticulture crop directorate license",
          type: "HorticultureCropDirectorateLicense",
        },
      ],
    },
    {
      categoryLabel: "Global GAAP certificate",
      category: "Global GAAP Certificate",
      types: [
        {
          typeLabel: "Global GAAP certificate",
          type: "GlobalGAAPCertificate",
        },
      ],
    },
    {
      categoryLabel: "Miscellaneous",
      category: "Miscellaneous",
      types: [
        {
          typeLabel: "Miscellaneous",
          type: "Miscellaneous",
        },
      ],
    },
  ];
}
