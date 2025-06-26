import { Component, OnInit } from "@angular/core";
import { get } from "lodash";
import { getProperty } from "src/app/utils/app.utils";
import { BusinessInvoiceService } from "../../../services/business-invoice/business-invoice.service";

const VALUE_MAP = {
  businessName: "businessDetailsDTO.businessName",
  numberOfEmployees: "businessDetailsDTO.numberOfEmployees",
  exportedGoods: "businessDetailsDTO.exportedGoods",
  registeredAddress: "tenantAddressDTO.address1",
  city: "tenantAddressDTO.city",
  country: "tenantAddressDTO.country",
  poBoxNumber: "tenantAddressDTO.pincode",
  yearlySalesTurnover: "businessDetailsDTO.yearlySalesTurnover",
  yearlyProfitability: "businessDetailsDTO.yearlyProfitability",
  hasPackHouseAddress: "businessDetailsDTO.isPackHouseAddressAvailable",
  packHouseAddress: "businessDetailsDTO.packHouseAddress",
  hasFarmAddress: "businessDetailsDTO.isFarmAddressAvailable",
  farmAddress: "businessDetailsDTO.farmAddress",
};

@Component({
  selector: "app-business-profile-details",
  templateUrl: "./business-profile-details.component.html",

  styleUrls: ["../business-review-details.scss"],
})
export class BusinessProfileDetailsComponent implements OnInit {
  businessReviewDetails: any = {};
  fields = [
    { label: "Business name", valueProperty: "businessName" },
    { label: "No of employees", valueProperty: "numberOfEmployees" },
    { label: "Exported goods", valueProperty: "exportedGoods" },
    { label: "Registered address", valueProperty: "registeredAddress" },
    { label: "City", valueProperty: "city" },
    { label: "Country", valueProperty: "country" },
    { label: "P.O.Box number", valueProperty: "poBoxNumber" },
    { label: "Yearly Sales turnover", valueProperty: "yearlySalesTurnover" },
    {
      label: "Yearly profitability(for the past five years)",
      valueProperty: "yearlyProfitability",
    },
    { label: "Do you have Pack house?", valueProperty: "hasPackHouseAddress" },
    { label: "Pack house address", valueProperty: "packHouseAddress" },
    { label: "Do you have farm?", valueProperty: "hasFarmAddress" },
    { label: "Fack address", valueProperty: "farmAddress" },
  ];

  // Reject button logic
  isRejected = false;
  showRejectField = false;
  rejectReason = "";
  constructor(private readonly businessReviewService: BusinessInvoiceService) {}

  ngOnInit(): void {
    this.businessReviewService.businessReviewInfo.subscribe(
      (reviewInfo) => (this.businessReviewDetails = reviewInfo)
    );
  }

  rejectSection(event) {
    event?.stopPropagation();
    if (this.rejectReason.trim() !== "") {
      const businessId = get(
        this.businessReviewDetails,
        "businessDetailsDTO.id",
        null
      );
      const sectionName = "BusinessProfile";
      this.businessReviewService
        .rejectBusinessSection(this.rejectReason, businessId, sectionName)
        .subscribe((response) => {
          this.isRejected = true;
          this.showRejectField = false;
        });
    }
  }
  handleReasonClick(event) {
    event?.stopPropagation();
  }
  handleReject(event) {
    event?.stopPropagation();
    this.showRejectField = true;
  }
  cancelReject(event) {
    event?.stopPropagation();
    this.showRejectField = false;
    this.rejectReason = "";
  }

  undoReject(event) {
    event?.stopPropagation();
    this.isRejected = false;
    this.rejectReason = "";
  }

  getValue(key = "") {
    return getProperty(this.businessReviewDetails, VALUE_MAP[key], "--");
  }
}
