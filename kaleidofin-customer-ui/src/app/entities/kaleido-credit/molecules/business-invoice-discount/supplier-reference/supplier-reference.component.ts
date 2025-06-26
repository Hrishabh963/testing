import { Component, Input, OnInit } from "@angular/core";
import { get } from "lodash";
import { getProperty } from "src/app/utils/app.utils";
import { BusinessInvoiceService } from "../../../services/business-invoice/business-invoice.service";

const VALUE_MAP = {
  businessName: "businessName",
  emailId: "emailId",
  mobileNumber: "mobileNumber",
  country: "country",
  salutation: "salutation",
  fullName: "contactPersonName",
};

@Component({
  selector: "app-supplier-reference",
  templateUrl: "./supplier-reference.component.html",
  styleUrls: ["../business-review-details.scss"],
})
export class SupplierReferenceComponent implements OnInit {
  @Input() data: any = {};

  suppliers: Array<any> = [];

  fields = [
    { label: "Business name", valueProperty: "businessName" },
    {
      label: "Business email id",
      valueProperty: "emailId",
    },
    {
      label: "Business contact number",
      valueProperty: "mobileNumber",
    },
    { label: "Country", valueProperty: "country" },
    { label: "Salutation", valueProperty: "salutation" },
    { label: "Contact person full name", valueProperty: "fullName" },
  ];

  constructor(private readonly businessReviewService: BusinessInvoiceService) {}

  ngOnInit(): void {
    this.businessReviewService.businessReviewInfo.subscribe(
      (reviewInfo) =>
        (this.suppliers = get(reviewInfo, "businessReferenceEntityDtoList", []))
    );
  }

  getValue(key = "", supplier = {}) {
    return getProperty(supplier, VALUE_MAP[key], "--");
  }
}
