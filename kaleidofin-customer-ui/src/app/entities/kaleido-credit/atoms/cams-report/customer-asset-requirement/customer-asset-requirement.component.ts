import { Component, Input, OnInit } from "@angular/core";
import { FIELD_MAPS } from "../cams.report.constants";

@Component({
  selector: "app-customer-asset-requirement",
  templateUrl: "./customer-asset-requirement.component.html",
  styleUrls: [
    "../cams-report.component.scss"
  ],
})
export class CustomerAssetRequirementComponent implements OnInit {
  @Input() reportData: any = {};
  sections: Array<any> = [];

  sectionMap = {
    assetDetails: {
      apiDataKey: "customerRequirementAssetDetailsDtos",
      subHeading: "",
      sectionData: [],
      fields: [],
    },
    assetInformation: {
      apiDataKey: "customerRequirementAssetInformationDtos",
      subHeading: "a. Asset Information",
      sectionData: [],
      fields: [],
    },
    rmVisitReports: {
      apiDataKey: "rmVisitReports",
      subHeading: "b. RM Visit Report",
      sectionData: [],
      fields: [],
    },
    fundingEligibilityCriteriaDtos: {
      apiDataKey: "fundingEligibilityCriteriaDtos",
      subHeading: "c. Funding Eligibility Criteria",
      sectionData: [],
      fields: [],
    },
  };
  assetData: Array<any> = [];
  assetInformation: Array<any> = [];
  rmVisitReports: Array<any> = [];

  fields: Array<any> = [];
  constructor() {}

  ngOnInit(): void {
    let {
      customerRequirementAssetDetailsDtos,
      customerRequirementAssetInformationDtos,
      fundingEligibilityCriteriaDtos,
      rmVisitReports,
    } = this.reportData;

    if (customerRequirementAssetDetailsDtos) {
      this.sectionMap.assetDetails = {
        ...this.sectionMap.assetDetails,
        sectionData: customerRequirementAssetDetailsDtos,
        fields: this.getFields(
          customerRequirementAssetDetailsDtos,
          "assetDetails"
        ),
      };
      this.sections = [this.sectionMap.assetDetails];
    } else {
      this.sectionMap.assetInformation = {
        ...this.sectionMap.assetInformation,
        sectionData: customerRequirementAssetInformationDtos,
        fields: this.getFields(
          customerRequirementAssetInformationDtos,
          "assetInformation"
        ),
      };
      this.sectionMap.rmVisitReports = {
        ...this.sectionMap.rmVisitReports,
        sectionData: rmVisitReports,
        fields: this.getFields(rmVisitReports, "rmVisitReports"),
      };
      this.sectionMap.fundingEligibilityCriteriaDtos = {
        ...this.sectionMap.fundingEligibilityCriteriaDtos,
        sectionData: fundingEligibilityCriteriaDtos,
        fields: this.getFields(
          fundingEligibilityCriteriaDtos,
          "fundingEligibility"
        ),
      };
      this.sections = [
        this.sectionMap.assetInformation,
        this.sectionMap.rmVisitReports,
        this.sectionMap.fundingEligibilityCriteriaDtos,
      ];
    }
  }

  getFields(data: Array<any> = [], dataKey: string = "") {
    data = data?.length > 0 ? data[0] : {};
    let fields = Object.keys(data);
    let map = FIELD_MAPS[dataKey];
    return map.filter((field) => fields.includes(field?.propertyKey));
  }
}
