import { Component, Input, OnInit } from "@angular/core";
import { KcreditLoanDetailsModel } from "../../kcredit-loanDetails.model";

@Component({
  selector: "jhi-contact-person",
  templateUrl: "./contact-person.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class ContactPersonComponent implements OnInit {
  @Input() loanDetails: KcreditLoanDetailsModel;
  contactPerson: any;

  ngOnInit() {
    this.contactPerson = { ...this.loanDetails };
  }
}
