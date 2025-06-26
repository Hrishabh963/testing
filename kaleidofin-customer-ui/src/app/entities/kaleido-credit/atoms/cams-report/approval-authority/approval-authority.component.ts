import { Component, Input, OnInit } from "@angular/core";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-approval-authority",
  templateUrl: "./approval-authority.component.html",
  styleUrls: [
    "./approval-authority.component.scss",
    "../cams-report.component.scss",
  ],
})
export class ApprovalAuthorityComponent implements OnInit {
  @Input() reportData: any = {};
  @Input() index: number = 0;

  constructor() {}

  ngOnInit(): void {
    if (getProperty(Object.keys(this.reportData), "length", 0) === 0) {
      this.reportData = [{}];
    }
  }
}
