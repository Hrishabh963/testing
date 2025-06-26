import { Input, Component, OnInit } from "@angular/core";
import { getProperty } from "src/app/utils/app.utils";
import { FIELD_MAPS } from "../cams.report.constants";

@Component({
  selector: "app-field-visit-reference",
  templateUrl: "./field-visit-reference.component.html",
  styleUrls: ["../cams-report.component.scss"],
})
export class FieldVisitReferenceComponent implements OnInit {
  @Input() index: number = 0;
  @Input() reportData: Array<any> = [];
  fields: Array<any> = [];
  constructor() {}

  ngOnInit(): void {
    if (getProperty(this.reportData, "length", 0) === 0) {
      this.reportData = [{}];
    } else {
      let data = getProperty(this.reportData, "[0]", {});
      let fields = Object.keys(data);
      this.fields = FIELD_MAPS.fieldVisitReference.filter((field) =>
        fields.includes(field?.propertyKey)
      );
    }
  }
}
