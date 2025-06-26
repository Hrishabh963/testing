import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { get } from "lodash";
import { CustomMessageDisplayComponent } from "../../shared/custom-message-display/custom-message-display.component";
import {
  DEDUPE_TYPE_ENUM,
  DEFAULT_DEDUPE_ERROR_TEXT,
  DEFAULT_DEDUPE_NEW_CUSTOMER_TEXT,
  DEFAULT_DEDUPE_OLD_CUSTOMER_TEXT,
  DedupeResponseDTO,
} from "../dedupe.models";
import { DedupeService } from "../dedupe.service";
import { AuthorizationService } from "../../services/authorization.service";
import { DedupeCheckPopupComponent } from "../../molecules/dedupe-check-popup/dedupe-check-popup.component";

@Component({
  selector: "app-dedupe-data",
  templateUrl: "./dedupe-data.component.html",
  styleUrls: ["./dedupe-data.component.scss"],
})
export class DedupeDataComponent implements OnInit {
  @Input() tableItems: DedupeResponseDTO[] = [];
  @Input() customerId: number = null;
  @Input() paramsObject: Record<string, string> = {};
  @Input() dedupeType: DEDUPE_TYPE_ENUM;
  @Input() enableReject: boolean = false;
  @Input() matchingText: string;
  @Input() dedupeReferenceType: string = null;
  @Input() dedupeReferenceId: number = null;

  disableMarkingNewCustomer: boolean = false;
  selectedItems: DedupeResponseDTO[] = [];

  displayedColumns: string[] = [
    "select",
    "name",
    "partnerId",
    "loanNumber",
    "createdDate",
    "dedupeParameter",
    "productCode",
    "link",
  ];

  constructor(
    private readonly dedupeService: DedupeService,
    private readonly dialog: MatDialog,
    private readonly authorityService: AuthorizationService
  ) {
    this.disableMarkingNewCustomer =
      !this.authorityService.validateEditAccess();
  }

  ngOnInit(): void {
    this.matchingText = this.getMatchingText();
  }

  getMatchingText(): string {
    const labels = Object.values(this.paramsObject);
    if (labels.length === 0) return "";
    if (labels.length === 1) return labels[0];
    if (labels.length === 2) return `${labels[0]} & ${labels[1]}`;
    return `${labels.slice(0, -1).join(", ")} & ${labels[labels.length - 1]}`;
  }

  masterToggle() {
    const allSelected = this.isAllSelected();
    this.tableItems.forEach((item) => (item.selected = !allSelected));
    this.updateSelectedItems();
  }

  isAllSelected() {
    return this.tableItems.every((item) => item.selected);
  }

  selectItem(item: DedupeResponseDTO) {
    item.selected = !item.selected;
    this.updateSelectedItems();
  }

  updateSelectedItems() {
    this.selectedItems = this.tableItems.filter((item) => item.selected);
  }

  openLoan(loanData) {
    const loanId = get(loanData, "loanId") || null;
    if (loanId) {
      window.open(`/#/kcredit/loan/${loanId}?dedupe=false`, "_blank");
    } else {
      alert("Loan ID is not available");
    }
  }
  markDedupe(isExistingCustomer: boolean = false) {
    this.dedupeService
      .markDedupe(
        this.customerId,
        this.selectedItems,
        isExistingCustomer,
        this.dedupeReferenceId,
        this.dedupeReferenceType
      )
      .subscribe(
        () => this.handleSuccess(isExistingCustomer),
        (error) => this.handleErrors(error)
      );
  }

  handleSuccess(isExistingCustomer: boolean = false) {
    this.openDialog(
      isExistingCustomer
        ? `${DEFAULT_DEDUPE_OLD_CUSTOMER_TEXT}${this.customerId}`
        : `${DEFAULT_DEDUPE_NEW_CUSTOMER_TEXT}${this.customerId}`
    );
  }
  handleErrors(error: any = {}) {
    let description = get(error, "error");
    if (description instanceof Object) {
      description = DEFAULT_DEDUPE_ERROR_TEXT;
    }
    this.openDialog(description, true, false);
  }

  openDialog(
    description: string = "",
    isError: boolean = false,
    canReload: boolean = true
  ) {
    const dialogRef = this.dialog.open(CustomMessageDisplayComponent, {
      maxWidth: "40vw",
      minHeight: "40vh",
      minWidth: "30vw",
      data: {
        description: description,
        isErrorDisplay: isError,
        canReload,
      },
    });

    dialogRef.afterClosed().subscribe((canReload) => {
      if (canReload) {
        window.location.reload();
      }
    });
  }

  rejectDedupe(): void {
    this.dialog.open(DedupeCheckPopupComponent, {
      width: "45vw",
      data: {
        title: "Confirmation",
        selectedDedupes: this.selectedItems,
        type: "REJECT",
      },
    });
  }

  approveAll(): void {
    this.dialog.open(DedupeCheckPopupComponent, {
      width: "45vw",
      data: {
        title: "Confirmation",
        selectedDedupes: this.tableItems,
        customerId: this.customerId,
        dedupeReferenceId: this.dedupeReferenceId,
        dedupeReferenceType: this.dedupeReferenceType
      },
    });
  }
}
