import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { get } from "lodash";
import { PrincipalService } from "src/app/core";
import { getProperty } from "src/app/utils/app.utils";
import { AssociateLenderService } from "../services/associate-lender/associate-lender.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "jhi-loan-review-dialog",
  templateUrl: "./kcredit-confirmation-reject-dialog.html",
  styleUrls: ["./kcredit-confirmation-reject-dialog.css"],
})
export class LoanApplicationReviewRejectDialogComponent implements OnInit {
  errorText: any = [];
  errorStatus: string;
  selectedDocuments: any[] = [];
  rejectionType: any = {};
  rejectionReason: string;
  noOfEntries: number;
  jlgMinimumSizeBreachedList: number;

  actionRequired: string[] = [];
  rejectReasons: any = [];
  metaData: any = {
    displayActionRequired: false,
    actionRequired: [],
    rejectionType: [],
    hideReasonValue: [],
    updateButtonsByValue: null,
    disableActionRequiredChecks: false,
    remarksPlaceholder: "Type a Reason",
    remarksLabel: "",
    titleText: undefined,
    subTitle: undefined,
  };

  disableRejectButton: boolean = false;
  hideRejectReason: boolean = false;
  rejectButtonText: string = "";
  remarks: string = "";
  selectedRejectReasons: string[] = [];

  constructor(
    public readonly activeModal: NgbActiveModal,
    private readonly principalService: PrincipalService,
    private readonly associateLenderService: AssociateLenderService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.rejectButtonText = "Yes,Evaluate";
    let rejectionTypes = getProperty(this.metaData, "rejectionType", []);
    if (rejectionTypes?.length) {
      const role = this.principalService.getUserRole();
      this.metaData.rejectionType = this.filterRejectionTypesByRole(
        rejectionTypes,
        role
      );
    }
  }
  filterRejectionTypesByRole(rejectionTypes = [], role = "") {
    return rejectionTypes.filter(
      (rejectionType) => !rejectionType.role || rejectionType.role === role
    );
  }

  cancel() {
    this.activeModal.close({ event: "cancel" });
  }

  reject() {
    if (this.selectedRejectReasons.length > 0 && !this.hideRejectReason) {
      this.rejectionReason = `${this.rejectionReason}:${this.selectedRejectReasons.join(", ")}`;
    }
    if(this.hasDuplicates(this.selectedDocuments)) {
      this.snackBar.open("Please remove the duplicate documents", "Error", {
        duration: 2000,
      });
      return;
    }
    this.activeModal.close({
      event: "confirm",
      rejectionType: this.rejectionType?.value,
      rejectionReason: this.rejectionReason,
      actionRequired: this.actionRequired,
      requiredDocuments: this.selectedDocuments
    });
  }
  onCheckboxChange(event: any, value: string) {
    event.checked
      ? this.actionRequired.push(value)
      : this.actionRequired.splice(this.actionRequired.indexOf(value), 1);
  }

  isDisabled(): boolean {
    if (
      !this.rejectionType?.value ||
      (this.checkActionRequired() && this.actionRequired.length === 0) ||
      (!this.checkAndHideRejectReason() && this.rejectionReason == null) ||
      (this.rejectionReason != null && this.rejectionReason.trim() == "")
    ) {
      return true;
    }
    return false;
  }

  isDefaultSelection(): boolean {
    if (
      this.rejectionType?.value == null ||
      (this.rejectionType?.value != null && this.rejectionType?.value === "reject")
    ) {
      return true;
    }
    return false;
  }

  checkActionRequired() {
    return (
      !this.metaData.disableActionRequiredChecks &&
      this.rejectionType?.value?.includes("retry")
    );
  }
  checkAndHideRejectReason() {
    return (
      this.rejectionType?.value &&
      this.metaData?.hideReasonValue?.includes(this.rejectionType?.value)
    );
  }
  getRejectButtons() {
    let rejectText = get(this.metaData, "updateButtonsByValue.value", null);
    return rejectText === this.rejectionType?.value
      ? get(this.metaData, "updateButtonsByValue.text", this.rejectButtonText)
      : this.rejectButtonText;
  }
  selectedRejectReasonChange(reasons: Array<any>): void {
    if(reasons && reasons?.length > 0) {
      this.selectedRejectReasons = reasons.map((reason)=> reason?.value);
    }
  }
  showOptionalDocuments() {
    return this.actionRequired.includes("resubmitLoanDocuments") && this.associateLenderService.isRequestOptionalDocsEnabled;
  }

  onDocumentsUpdate(data: any[]) {
    this.selectedDocuments = data
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); 
      this.cancel();
    }
  }

  hasDuplicates(documents: any[]): boolean {
    const seen = new Set<string>();
    for (const doc of documents) {
      const key = `${doc.entityType}-${doc.documentType}-${doc.entityId}-${doc.loanStage}`;
      if (seen.has(key)) {
        return true;
      }
      seen.add(key);
    }
    return false;
  }

  hideRejectReasonDropDown(event: Event): void {
    const selectedEvaluationType: any = getProperty(event, "value", {});
    this.hideRejectReason = get(selectedEvaluationType, "hideMultiRejectReasons", false);
  }

}
