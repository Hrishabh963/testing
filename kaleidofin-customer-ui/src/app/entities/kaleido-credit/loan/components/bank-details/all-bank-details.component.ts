import { Component, EventEmitter, Input, Output } from "@angular/core";
import { KcreditLoanDetailsModel } from "../../kcredit-loanDetails.model";

@Component({
  selector: "jhi-all-bank-details",
  templateUrl: "./all-bank-details.component.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class AllBankDetailsComponent {
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() disableEdit: boolean;
  @Output() reloadAfterSave = new EventEmitter<any>();
  BankDetails: any = {};
  error: boolean;

  ngOnInit() {
    this.BankDetails = this.loanDetails?.bankDetail ?? {};
  }

  onSuccess(res) {
    this.reloadAfterSave.emit("Bank Details");
  }
}
