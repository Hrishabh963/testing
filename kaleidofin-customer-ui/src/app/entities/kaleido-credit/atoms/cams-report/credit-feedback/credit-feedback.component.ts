import { Component, Input, OnInit } from "@angular/core";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-credit-feedback",
  templateUrl: "./credit-feedback.component.html",
  styleUrls: [
    "../cams-report.component.scss"
  ],
})
export class CreditFeedbackComponent implements OnInit {
  tableMap = {
    "Credit Analyst Name": {propertyKey: "creditAnalystName"},
    "Date of Discussion": {propertyKey: "dateOfDiscussion", pipe: "date", format: "dd-MM-yyyy"},
    "Time of Discussion": {propertyKey: "timeOfDiscussion"},
    "Additional Credit Comments": {propertyKey: "additionalCreditComments"},
  };
  @Input() reportData: Array<any> = [];
  @Input() index: number = 0;

  constructor() {}

  ngOnInit(): void {
    if (getProperty(this.reportData, "length", 0) === 0) {
      this.reportData = [{}];
    }
  }
  getKeys() {
    return Object.keys(this.tableMap);
  }
}
