import { Component, Input, OnInit } from "@angular/core";
import { LoanFee } from "../../../models/loan-fee.model";
import { KcreditLoanDetailsModel } from "../../kcredit-loanDetails.model";

@Component({
  selector: "jhi-kcpl-fee-details",
  templateUrl: "./kcpl-fee-details.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class KcplFeeDetailsComponent implements OnInit {
  @Input() loanDetails: KcreditLoanDetailsModel;
  loanFee: LoanFee;

  ngOnInit() {
    this.loanFee = { ...this.loanDetails.loanFeeDTO };
  }
}
