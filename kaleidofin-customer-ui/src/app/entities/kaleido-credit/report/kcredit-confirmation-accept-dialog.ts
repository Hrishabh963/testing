import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "jhi-loan-review-dialog",
  templateUrl: "./kcredit-confirmation-accept-dialog.html",
})
export class LoanApplicationReviewAcceptDialogComponent{
  errorText: any = [];
  errorStatus: string;
  applicationStatus: string;
  noOfEntries: number;
  constructor(
    public readonly activeModal: NgbActiveModal
  ) {

  }


  cancel() {
    this.activeModal.close("cancel");
  }

  approve() {
    this.activeModal.close("confirm");
  }

}
