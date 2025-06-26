import { Component, Input } from "@angular/core";

@Component({
  selector: "app-business-kyc-details",
  templateUrl: "./business-kyc-details.component.html",
  styleUrls: ["../business-review-details.scss"],
})
export class BusinessKycDetailsComponent {
  @Input() data: any = {};

  suppliers: Array<any> = [1, 2, 3];
  nationalIdDetails = [
    { label: "Full name as per National ID", valueProperty: "businessName" },
    { label: "Date of birth", valueProperty: "businessName" },
    { label: "National Id serial number", valueProperty: "businessName" },
  ];

  fields = [
    { label: "Supplier’s business name", valueProperty: "businessName" },
    {
      label: "Supplier’s business email id",
      valueProperty: "numberOfEmployees",
    },
    {
      label: "Supplier’s business contact number",
      valueProperty: "exportedGoods",
    },
    { label: "Supplier’s country", valueProperty: "registeredAddress" },
    { label: "Salutation", valueProperty: "city" },
    { label: "Contact person full name", valueProperty: "country" },
  ];
}
