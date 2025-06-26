import { Component, Input } from "@angular/core";

@Component({
  selector: "app-mfi-cam-customer-info",
  templateUrl: "./mfi-cam-customer-info.component.html",
  styleUrls: [
    "./mfi-cam-customer-info.component.scss",
    "../cams-report/cams-report.component.scss",
  ],
})
export class MfiCamCustomerInfoComponent {
  @Input() customerInfo: any = {};

  tableRow: Array<any> = [
    { title: "Name of the Customer", propertyKey: "name" },
    { title: "Application Number", propertyKey: "applicationNumber" },
    { title: "Type of Customer Segment", propertyKey: "typeOfCustomerSegment" },
    { title: "Activity Type", propertyKey: "activityType" },
    { title: "Industry", propertyKey: "industry" },
    { title: "Loan Purpose", propertyKey: "loanPurpose" },
    {
      title: "No. of years In Business (If applicable)",
      propertyKey: "numberOfYearsInBusiness",
    },
    { title: "Residence Stability", propertyKey: "residenceStability" },
  ];
}
