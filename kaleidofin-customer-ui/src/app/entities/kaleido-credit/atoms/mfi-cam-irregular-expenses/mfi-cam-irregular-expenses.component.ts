import { Component, Input, OnInit } from "@angular/core";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-mfi-cam-irregular-expenses",
  templateUrl: "./mfi-cam-irregular-expenses.component.html",
  styleUrls: [
    "./mfi-cam-irregular-expenses.component.scss",
    "../cams-report/cams-report.component.scss",
  ],
})
export class MfiCamIrregularExpensesComponent implements OnInit {
  @Input() reportData: any = {};
  irregularExpenses: any = {};
  tableRow: Array<any> = [
    { title: "Medical", propertyKey: "medical", type: "otherIncome", pipe : "currency" },
    {
      title: "Asset Purchase",
      propertyKey: "assetPurchase",
      type: "otherIncome",
      pipe : "currency" 
    },
    { title: "House Renovation expenses", propertyKey: "houseRenovation", pipe : "currency" },
    { title: "Other Expenses", propertyKey: "others", pipe : "currency"  },
    {
      title: "Yearly Household Expense",
      propertyKey: "yearlyHouseholdExpense",
      pipe : "currency" 
    },
    { title: "Avg Monthly Expenses", propertyKey: "avgMonthlyExpense", pipe : "currency" },
    {
      title: "Total Existing EMI Obligation",
      propertyKey: "totalExistingEmiObligation",
      pipe : "currency" 
    },
    { title: "Tenor ( In months)", propertyKey: "tenor" },
    { title: "Rate of Interest", propertyKey: "rateOfInterest" },
    { title: "Loan Amount ( Rs.)", propertyKey: "loanAmount",pipe : "currency" },
    { title: "EMI", propertyKey: "emi", pipe : "currency" },
    { title: "FOIR", propertyKey: "foir" },
    { title: "BC Recommendation", propertyKey: "bCRecommendation" },
    { title: "DCB Credit Remarks", propertyKey: "dcbCreditRemarks" },
    { title: "Deviation (If Any)", propertyKey: "deviation" },
    { title: "DCB Credit Decision", propertyKey: "dcbCreditDecision" },
    { title: "DCB Credit Emp Code", propertyKey: "dcbCreditEmpCode" },
  ];
  ngOnInit(): void {
    this.irregularExpenses = getProperty(
      this.reportData,
      "houseHoldIrregularExpense",
      {}
    );
  }
}
