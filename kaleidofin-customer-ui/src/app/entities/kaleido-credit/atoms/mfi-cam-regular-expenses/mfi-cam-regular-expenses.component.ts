import { Component, Input, OnInit } from "@angular/core";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-mfi-cam-regular-expenses",
  templateUrl: "./mfi-cam-regular-expenses.component.html",
  styleUrls: [
    "./mfi-cam-regular-expenses.component.scss",
    "../cams-report/cams-report.component.scss",
  ],
})
export class MfiCamRegularExpensesComponent implements OnInit {
  @Input() reportData: any = {};
  regularExpenses: any = {};

  tableRow: Array<any> = [
    {
      title: "Food and Utility",
      propertyKey: "foodAndUtility",
      pipe: "currency",
    },
    { title: "Clothing", propertyKey: "clothing", pipe: "currency" },
    { title: "Rent (House)", propertyKey: "houseRent", pipe: "currency" },
    { title: "Rent (Shop)", propertyKey: "shopRent", pipe: "currency" },
    { title: "Fees School", propertyKey: "schoolFee", pipe: "currency" },
    { title: "Medical Fees", propertyKey: "medicalFee", pipe: "currency" },
    { title: "Other Expenses", propertyKey: "others", pipe: "currency" },
  ];

  ngOnInit(): void {
    this.regularExpenses = getProperty(
      this.reportData,
      "houseHoldRegularExpense",
      {}
    );
  }
}
