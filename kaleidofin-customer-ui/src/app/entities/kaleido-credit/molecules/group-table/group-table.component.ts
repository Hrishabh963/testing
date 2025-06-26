import { Component, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { LoanApplicationReviewRejectDialogComponent } from "../../report/kcredit-confirmation-reject-dialog";
import { LoanReviewPopupService } from "../../report/kcredit-popup-service";
import { LoanReviewService } from "../../report/loan-review.service";
import { AssociateLenderService } from "../../services/associate-lender/associate-lender.service";
import { CustomDisplayPopupComponent } from "../../shared/custom-display-popup/custom-display-popup.component";

@Component({
  selector: "group-info-table",
  templateUrl: "./group-table.component.html",
  styleUrls: ["./group-table.component.scss"],
})
export class GroupTableComponent {
  @Input() tableData: Array<any> = [];
  showDetail: boolean = true;
  selectedRowCount: number = 0;
  modalRef: NgbModalRef;
  headerCheckbox: boolean = false;
  cannotSubmit: Array<any> = [];
  evaluationType: string = "";
  reason: string = "";

  updateSelectedRowCount() {
    this.selectedRowCount = this.tableData.filter(data => data.selected).length;
  }

  constructor(
    private readonly loanReviewPopupService: LoanReviewPopupService,
    private readonly associate: AssociateLenderService,
    public readonly dialog: MatDialog,
    private readonly loanReviewService: LoanReviewService,
    private readonly snackBar: MatSnackBar

  ) { }

  updateDetailsDisplay() {
    this.showDetail = !this.showDetail;
  }

  canSubmitIds() {
    return this.tableData.filter(selectedData => selectedData.selected && !["disbursed", "externaldisbursal"].includes(selectedData.applicationStatus))
      .map(data => data?.loanApplicationId);
  }

  rejectIds(bookingRejectionConfirmed = false, canProceed = false) {

    const canBulkReject: boolean = this.canSubmit();
    if (canProceed || canBulkReject) {

      const booked = this.alertStatuses();
      if (!bookingRejectionConfirmed && booked.length > 0) {
        this.dialog.open(CustomDisplayPopupComponent, {
          maxWidth: "43vw",
          minHeight: "40vh",
          minWidth: "30vw",
          data: {
            title: " ",
            dialogTitle: "Confirmation",
            description: "Loan application ID " + this.getCannotSubmitList(booked) + " is already booked, do you still wish to reject this application?",
            isErrorDisplay: true,
            dialogClass: "bulk-reject",
            actionButtons: [
              {
                buttonText: "Cancel bulk Reject",
                buttonClassName: "btn-secondary",
                onClickHandler: () => { }
              },
              {
                buttonText: "Yes, reject",
                buttonClassName: "btn-primary",
                onClickHandler: () => { this.rejectIds(true, true) }
              },
            ],
          },
        });
      }
      if (bookingRejectionConfirmed || booked.length === 0) {
        bookingRejectionConfirmed = true;
        this.modalRef = this.loanReviewPopupService.open(
          <Component>LoanApplicationReviewRejectDialogComponent,
          "",
          0,
          0,
          false,
          1,
          this.associate.fetchCustomPopupMetadata("groupReject")
        )
      }
    } else {
      this.dialog.open(CustomDisplayPopupComponent, {
        maxWidth: "40vw",
        minHeight: "40vh",
        minWidth: "30vw",
        data: {
          title: " ",
          dialogTitle: "Confirmation",
          description: "You can not reject application " + this.getCannotSubmitList(this.cannotSubmit) + " since this application's loan status is Loan disbursed",
          isErrorDisplay: true,
          dialogClass: "bulk-reject",
          actionButtons: [
            {
              buttonText: "Cancel",
              buttonClassName: "btn-secondary",
              onClickHandler: () => this.dialog.closeAll()
            },
            {
              buttonText: "Proceed for others",
              buttonClassName: "btn-primary",
              onClickHandler: () => this.rejectIds(false, true)
            },
          ],
        },
      });
    }
    this.modalRef?.result?.then((result) => {

      if (result !== undefined && result.event === "confirm" && bookingRejectionConfirmed) {

        this.bulkReject(result);
      }
    });
  }

  prepareToBulkReject() {

    this.dialog.closeAll();

    this.modalRef = this.loanReviewPopupService.open(
      <Component>LoanApplicationReviewRejectDialogComponent,
      "",
      0,
      0,
      false,
      1,
      this.associate.fetchCustomPopupMetadata("groupReject"),
    )
    this.modalRef.result.then((result) => {

      this.dialog.closeAll();

      if (result !== undefined && result.event === "confirm") {
        this.bulkReject(result);
      }
      this.modalRef.result = undefined;
    });
  }

  bulkReject(result: any) {

    const ids = this.canSubmitIds();
    if (ids.length === 0) {
      this.snackBar.open("No applications to reject", "Error", {
        duration: 3000,
      });
    }

    else {
      this.loanReviewService.bulkReject(this.canSubmitIds(), result.rejectionType, result.rejectionReason, result.actionRequired).subscribe((response: Array<any>) => {
        this.snackBar.open("Applications rejected succesfully", "Success", {
          duration: 3000,
        });

        this.tableData.filter(selectedData => selectedData.selected && !["disbursed", "externaldisbursal"].includes(selectedData.applicationStatus)).forEach((data) => {
          data.applicationStatus = result.rejectionType;
        })
        this.tableData.filter(selectedData => selectedData.selected).forEach((data) => {
          data.selected = null;
        })
        this.selectedRowCount = 0;
        this.headerCheckbox = false;
      },
        (error) => {
          this.snackBar.open(error?.error?.message || "Error while rejecting applications", "Error", {
            duration: 4000,
          });
        }
      );
    }
  }

  selectAllRows() {
    this.tableData.forEach(data => (data.selected = this.headerCheckbox));
    this.updateSelectedRowCount();
  }

  getCannotSubmitList(list: Array<string>) {
    let str = "";
    list.forEach((st, index) => {
      str = str + st;
      if (index < list.length - 1) {
        str += ",";
      }
    })
    return str;
  }

  loanReview(loanApplicationId: string) {
    window.open("/#/kcredit/loan/" + loanApplicationId);
  }

  canSubmit() {

    let flag: boolean = true;
    this.cannotSubmit = [];
    this.tableData.filter(selectedData => selectedData.selected).forEach((data) => {
      if (data.applicationStatus === "disbursed" || data.applicationStatus === "externaldisbursal") {
        flag = false;
        this.cannotSubmit.push(data.partnerLoanId);
      }
    });
    return flag;
  }

  alertStatuses() {

    const booked = [];
    this.tableData.filter(selectedData => selectedData.selected).forEach((data) => {
      if (data.applicationStatus === "booked" || data.applicationStatus === "pendingdisbursal") {

        booked.push(data.partnerLoanId);
      }
    });
    return booked;
  }
}