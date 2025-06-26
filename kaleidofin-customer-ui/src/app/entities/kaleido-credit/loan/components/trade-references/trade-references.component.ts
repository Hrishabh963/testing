import { Component, EventEmitter, Input, Output } from "@angular/core";
import { KcreditLoanDetailsModel } from "../../kcredit-loanDetails.model";

@Component({
  selector: "jhi-trade-references",
  templateUrl: "./trade-references.component.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class TradeReferencesComponent {
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() disableEdit: boolean;
  @Output() reloadAfterSave = new EventEmitter<any>();
  error: boolean;
  public tradeReferences: any[];


  ngOnInit() {
    const profileInfo = JSON.parse(this.loanDetails.customerDTO.profile);
    this.tradeReferences = [
      "Trade Reference 1",
      "Trade Reference 2",
      "Trade Reference 3",
    ].filter((i) => profileInfo[i]);
  }

  onSuccess(res) {
    this.reloadAfterSave.emit("Trade References");
  }
}
