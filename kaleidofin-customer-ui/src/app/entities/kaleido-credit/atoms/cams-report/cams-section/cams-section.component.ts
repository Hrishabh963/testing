import { Component, Input, OnInit } from "@angular/core";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-cams-section",
  templateUrl: "./cams-section.component.html",
  styleUrls: ["../cams-report.component.scss"],
})
export class CamsSectionComponent implements OnInit {
  @Input() reportData: Array<any> = [];
  @Input() tableMap: any = {};
  @Input() title: string = "";

  getKeys() {
    return Object.keys(this.tableMap || {});
  }

  ngOnInit(): void {
    if (getProperty(this.reportData, "length", 0) === 0) {
      this.reportData = [{}];
    }
  }
}
