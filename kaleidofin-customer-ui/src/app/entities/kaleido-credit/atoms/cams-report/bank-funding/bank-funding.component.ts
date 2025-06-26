import { Component, Input } from "@angular/core";
import { FIELD_MAPS } from "../cams.report.constants";

@Component({
  selector: "app-bank-funding",
  templateUrl: "./bank-funding.component.html",
  styleUrls: ["../cams-report.component.scss"],
})
export class BankFundingComponent {
  @Input() index: number = 0;
  @Input() reportData: any = {};

  tractorDetails = {
    title: "a. Tractor Information",
    tableMap: FIELD_MAPS.tractorDetails,
  };
  bankFundingDetails = {
    title: "",
    tableMap: FIELD_MAPS.bankFundingDetails,
  };
  fundingDetails = {
    title: "b. Funding Details",
    tableMap: FIELD_MAPS.fundingDetails,
  };
}
