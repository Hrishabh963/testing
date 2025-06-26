import { Component, Input, OnInit } from '@angular/core';
import { getProperty } from 'src/app/utils/app.utils';

@Component({
  selector: 'app-bank-funding-details',
  templateUrl: './bank-funding-details.component.html',
  styleUrls: ["../cams-report.component.scss"]
})
export class BankFundingDetailsComponent implements OnInit {
  tableMap = {
    "Loan amount on tractor": "totalLoanAmount",
    "Vehicle Insurance Premium Amount": "vehicleInsurancePremiumAmount",
    "Loan Cover Insurance Premium Amount": "loanCoverInsurancePremiumAmount",
    "Health Insurance Premium Amount": "healthInsurancePremiumAmount",
    "Total Loan Amount": "totalLoanAmount",
    "IRR": "irr",
    "Vehicle Insurance Tenure": "vehicleInsuranceTenure",
    "Loan Cover Insurance Tenure": "loanCoverTenure",
    "Health Insurance Tenor": "healthInsuranceTenure",
    "Processing Fees": "processingFee",
    "Frequency of Payment of total loan amount": "paymentFrequency",
    "Installment Value": "installmentValue",
    "Annual Installment": "maximumInstallmentPerYear",
    "Tenure": "tenure",
    "Maximum Installment Nos/year": "maximumInstallmentPerYear",
    "PDC / NPDC/CASH COLLECTION/ECS/NACH/SI": "pdcOrNpdcOrCashCollectionOrEcs",
    "LTV": "ltv",
  };
  @Input() reportData: Array<any> = [];

  constructor() {}

  getKeys() {
    return Object.keys(this.tableMap);
  }
  
  ngOnInit(): void {
    if (getProperty(this.reportData, "length", 0)=== 0) {
      this.reportData = [{}];
    }
  }
}