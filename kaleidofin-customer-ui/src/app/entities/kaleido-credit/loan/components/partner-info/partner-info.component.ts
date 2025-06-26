import { Component, Input, OnInit } from "@angular/core";
import { Partner } from "../../../models/partner.model";
import { KcreditLoanDetailsModel } from "../../kcredit-loanDetails.model";

@Component({
  selector: "jhi-partner-info",
  templateUrl: "./partner-info.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class PartnerInfoComponent implements OnInit {
  @Input() loanDetails: KcreditLoanDetailsModel;
  partner: Partner;

  ngOnInit() {
    this.partner = { ...this.loanDetails.partnerDTO };
  }
}
