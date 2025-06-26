import { Component, Input, OnInit } from "@angular/core";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-customer-criteria",
  templateUrl: "./customer-criteria.component.html",
  styleUrls: [
    "./customer-criteria.component.scss",
    "../cams-report.component.scss",
  ],
})
export class CustomerCriteriaComponent implements OnInit {
  @Input() index: number = null;
  branch : string =  "";
  dateOfCamPreparation : string = ""; 
  headers = [
    "Branch",
    "Date of CAM Preparation",
    "Status",
    "Name",
    "Address",
    "Contact No",
    "Cibil Score",
  ];

  secondHeaders = [
    "Own Land",
    "Lease Land",
    "Validated Through",
    "Total Land"
  ]
  @Input() reportData: Array<any> = [];

  constructor() {}

  ngOnInit(): void {
    if (getProperty(this.reportData, "length", 0) === 0) {
      this.reportData = [{}];
    }
    this.branch = getProperty(this.reportData, '[0].branch');
    this.dateOfCamPreparation = getProperty(this.reportData, '[0].dateOfCamPreparation');
  }
}