import { Component, Input, OnInit } from "@angular/core";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-mfi-cam-other-yearly-income",
  templateUrl: "./mfi-cam-other-yearly-income.component.html",
  styleUrls: [
    "./mfi-cam-other-yearly-income.component.scss",
    "../cams-report/cams-report.component.scss",
  ],
})
export class MfiCamOtherYearlyIncomeComponent implements OnInit {
  @Input() reportData: any = {};
  otherIncome: Array<any> = new Array<any>();
  tableRow: Array<any> = [
    {
      id: 8,
      title: "Yearly other income of Hosuehold",
      propertyKey: "yearlyOtherIncomeOfHousehold",
      type: "overall",
      pipe: "currency"
    },
    {
      id: 9,
      title: "Yearly Income",
      propertyKey: "yearlyIncome",
      type: "overall",
      pipe: "currency"
    },
    {
      id: 10,
      title: "Total Yearly Household Income",
      propertyKey: "totalYearlyHouseholdIncome",
      type: "overall",
      pipe: "currency"
    },
    {
      id: 11,
      title: "Avg monthy Household Income",
      propertyKey: "avgMonthlyHouseholdIncome",
      type: "overall",
      pipe: "currency"
    },
  ];
  

  ngOnInit(): void {
    this.otherIncome = getProperty(this.reportData, "otherYearlyIncome", []);
  }
}
