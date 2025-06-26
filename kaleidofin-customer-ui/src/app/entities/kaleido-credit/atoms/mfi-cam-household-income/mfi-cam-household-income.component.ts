import { Component, Input, OnInit } from "@angular/core";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-mfi-cam-household-income",
  templateUrl: "./mfi-cam-household-income.component.html",
  styleUrls: [
    "./mfi-cam-household-income.component.scss",
    "../cams-report/cams-report.component.scss",
  ],
})
export class MfiCamHouseholdIncomeComponent implements OnInit {
  @Input() reportData: any = {};

  houseHoldIncome: Array<any> = new Array<any>();
  otherIncome;

  tableRow: Array<any> = [
    { title: "Name", propertyKey: "name" },
    {
      title: "Relationship with Applicant",
      propertyKey: "relationshipWithApplicant",
    },
    {
      title:
        "Sector of Work (Agriculture & Allied activities, Trading, Manufacturing, Services etc.)",
      propertyKey: "sectorOfWork",
    },
    { title: "Working since", propertyKey: "workingSince" },
    {
      title: "Months / Days of employment over the last one year",
      propertyKey: "employmentOverLastOneYear",
    },
    {
      title: "Frequency of Income (Daily/Weekly/Monthly)",
      propertyKey: "frequencyOfIncome",
    },
    { title: "Nature of work", propertyKey: "natureOfWork" },
    {
      title: "Educational Qualification",
      propertyKey: "educationalQualification",
    },
    {
      title:
        "Self-Declared yearly Household Income/Income from proofs (bank statement/ITR)",
      propertyKey: "selfDeclaredYearlyHouseholdIncomeFromProof",
      type: "overall",
      pipe: "currency",
    },
    { title: "Type of Business", propertyKey: "typeOfBusiness" },
    {
      title: "Average Turnover per month",
      propertyKey: "avgTurnoverPerMonth",
      pipe: "currency",
    },
    { title: "Gross Margin", propertyKey: "grossMargin", pipe: "currency" },
    {
      title: "Business Income per month",
      propertyKey: "businessIncomePerMonth",
      pipe: "currency",
    },
  ];

  otherIncomeTable: Array<any> = [
    {
      id: 1,
      title: "1. Rent (Rent Agreement)",
      propertyKey: "rent",
      type: "otherIncome",
      pipe: "currency",
    },
    {
      id: 2,
      title: "2. Tutions",
      propertyKey: "tuition",
      type: "otherIncome",
      pipe: "currency",
    },
    {
      id: 3,
      title: "3. Remittance",
      propertyKey: "remittance",
      type: "otherIncome",
      pipe: "currency",
    },
    {
      id: 4,
      title: "4. Pension",
      propertyKey: "pension",
      type: "otherIncome",
      pipe: "currency",
    },
    {
      id: 5,
      title: "5. Gov. Transfer",
      propertyKey: "govTransfer",
      type: "otherIncome",
      pipe: "currency",
    },
    {
      id: 6,
      title: "6. Scholarship",
      propertyKey: "scholarship",
      type: "otherIncome",
      pipe: "currency",
    },
    {
      id: 7,
      title: "7. Others",
      propertyKey: "others",
      type: "otherIncome",
      pipe: "currency",
    },
  ];

  ngOnInit(): void {
    this.houseHoldIncome = getProperty(this.reportData, "houseHoldIncome", []);
    this.otherIncome = getProperty(this.reportData, "otherYearlyIncome", []);
  }
}
