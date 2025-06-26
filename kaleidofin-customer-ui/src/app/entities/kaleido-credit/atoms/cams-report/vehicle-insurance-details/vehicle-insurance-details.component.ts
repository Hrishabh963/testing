import { Component, Input, OnInit } from "@angular/core";
import { getProperty } from "src/app/utils/app.utils";
import { FIELD_MAPS } from "../cams.report.constants";

@Component({
  selector: "app-vehicle-insurance-details",
  templateUrl: "./vehicle-insurance-details.component.html",
  styleUrls: ["../cams-report.component.scss"],
})
export class VehicleInsuranceDetailsComponent implements OnInit {
  @Input() index: number = null;
  @Input() reportData: Array<any> = [];
  fields: Array<any> = [];
  constructor() {}

  ngOnInit(): void {
    if (getProperty(this.reportData, "length", 0) === 0) {
      this.reportData = [{}];
    } else {
      let data = getProperty(this.reportData, "[0]", {});
      let fields = Object.keys(data);
      this.fields = FIELD_MAPS.vehicleLoans.filter((field) =>
        fields.includes(field?.propertyKey)
      );
    }
  }
}
