import { Component, Input, OnInit } from "@angular/core";
import { getProperty } from "src/app/utils/app.utils";
import { FIELD_MAPS } from "../cams.report.constants";

@Component({
  selector: "app-financial-liability-details",
  templateUrl: "./financial-liability-details.component.html",
  styleUrls: [
    "../cams-report.component.scss",
  ],
})
export class FinancialLiabilityDetailsComponent implements OnInit {
  @Input() reportData: Array<any> = [];
  @Input() index: number = 0;
  fields: Array<any> = [];
  constructor() {}

  ngOnInit(): void {
    if (getProperty(this.reportData, "length", 0) === 0) {
      this.reportData = [{}];
      this.fields = FIELD_MAPS.financeLiability;
    } else {
      let data = getProperty(this.reportData, "[0]", {});
      let fields = Object.keys(data);
      this.fields = FIELD_MAPS.financeLiability.filter((field) =>
        fields.includes(field?.propertyKey)
      );
    }
  }
}
