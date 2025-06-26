import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AssociateLenderService } from "../services/associate-lender/associate-lender.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "jhi-loan-review-dialog",
  templateUrl: "./kcredit-confirmation-dialog.html",
  styleUrls: ["./kcredit-confirmation-reject-dialog.css"]
})
export class LoanApplicationReviewDialogComponent{
  errorText: any = [];
  errorStatus: string;
  noOfEntries: number;
  checkedListWithEligibilityPassed: number;
  checkedListWithEligibilityFailed: number;
  eligibilityFailedForLoanApplication: boolean;
  pddSelection: string = "";
  requestPddDocs: boolean;
  pddList: any =  [{label: "Yes", value: "Yes"}, {label: "No", value: "No"}];
  comment: string = "";
  selectedDocuments: any[];
  isEnabled: boolean = true;
  constructor(
    public readonly activeModal: NgbActiveModal,
    private readonly associateLenderService: AssociateLenderService,
    private readonly snackBar: MatSnackBar
  ) {}


  cancel() {
    this.activeModal.close("cancel");
  }

  approve() {
    if(this.associateLenderService.isPDDDocumentsUpdateEnabled) {
      if (this.pddSelection === "") {
        this.snackBar.open("Please choose if PDD documents are required", "Error", {
          duration: 2000,
        });
        return;
      }
      if (this.pddSelection === "Yes" && this.selectedDocuments.length == 0) {
        this.snackBar.open("Please specify at least one PDD document", "Error", {
          duration: 2000,
        });
        return;
      }
      if(!this.isEnabled) {
        this.snackBar.open("Please add remarks for all the documents", "Error", {
          duration: 2000,
        });
        return;
      }
    }
    this.activeModal.close({
      event: "confirm",
      comment: this.comment,
      requiredDocuments: this.selectedDocuments
    });
  }


  showPDDDocuments() {
    return this.pddSelection === "Yes";
  }

  isPDDEnabled() {
    return this.associateLenderService.isPDDDocumentsUpdateEnabled;
  }

  onDocumentsUpdate(data: any[]) {
    this.selectedDocuments = data;
    this.isEnabled = true;
    for (const doc of data) {
      if (doc.remarks === "") {
        this.isEnabled = false;
      }
    }
  }
}
