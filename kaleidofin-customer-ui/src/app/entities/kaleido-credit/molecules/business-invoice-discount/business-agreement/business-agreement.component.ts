import { Component } from "@angular/core";

@Component({
  selector: "app-business-agreement",
  templateUrl: "./business-agreement.component.html",
  styleUrls: ["../business-review-details.scss"],
})
export class BusinessAgreementComponent {
  documents = [
    {
      categoryLabel: "Agreement",
      types: [
        {
          typeLabel: "Business Agreement",
          type: "Agreement",
        },
      ],
    },
  ];
}
