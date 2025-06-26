import { Component, Input, OnInit } from "@angular/core";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-deviations",
  templateUrl: "./deviations.component.html",
  styleUrls: ["../cams-report.component.scss"],
})
export class DeviationsComponent implements OnInit {
  @Input() reportData: Array<any> = [];
  @Input() index: number = 0;

  constructor() {}

  ngOnInit(): void {
    if (getProperty(this.reportData, "length", 0) === 0) {
      this.reportData = [{}];
    }
  }

}
