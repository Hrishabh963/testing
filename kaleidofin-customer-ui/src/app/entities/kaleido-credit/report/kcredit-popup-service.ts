import { Injectable, Component } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class LoanReviewPopupService {
  private isOpen = false;

  /**
   * @description Ref to keep track of the current opened modal
   **/
  private dialogRef: NgbModalRef | null = null;
  constructor(private readonly modalService: NgbModal) {}

  setDialogRef(ref: NgbModalRef): void {
    this.dialogRef = ref;
  }

  open(component: Component, data?: any, ...rest): NgbModalRef {
    if (this.isOpen) {
      return null;
    }
    this.isOpen = true;
    this.onOpen();
    const [
      checkedListWithEligibilityPassed,
      checkedListWithEligibilityFailed,
      eligibilityFailedForLoanApplication,
      jlgMinimumSizeBreachedList,
      metaData = {},
      rejectReasons = [],
      customClass = "",
    ] = rest;
    return this.cropperModalRef(
      component,
      data,
      checkedListWithEligibilityPassed,
      checkedListWithEligibilityFailed,
      eligibilityFailedForLoanApplication,
      jlgMinimumSizeBreachedList,
      metaData,
      rejectReasons,
      customClass
    );
  }

  openPopup(component: Component, data?: any, ...rest): NgbModalRef {
    if (this.isOpen) {
      return null;
    }
    this.isOpen = true;
    this.onOpen();

    return this.cropperModalRef(component, data);
  }

  cropperModalRef(component: Component, data, ...rest): NgbModalRef {
    const [
      checkedListWithEligibilityPassed,
      checkedListWithEligibilityFailed,
      eligibilityFailedForLoanApplication,
      jlgMinimumSizeBreachedList,
      metaData = {},
      rejectReasons = [],
      customClass = "",
    ] = rest;
    const modalRef = this.modalService.open(component, {
      size: "lg",
      backdrop: "static",
      windowClass: customClass,
    });
    this.onOpen();
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.noOfEntries = data;
    modalRef.componentInstance.checkedListWithEligibilityPassed =
      checkedListWithEligibilityPassed;
    modalRef.componentInstance.checkedListWithEligibilityFailed =
      checkedListWithEligibilityFailed;
    modalRef.componentInstance.eligibilityFailedForLoanApplication =
      eligibilityFailedForLoanApplication;
    modalRef.componentInstance.jlgMinimumSizeBreachedList =
      jlgMinimumSizeBreachedList;
    modalRef.componentInstance.metaData = metaData;
    modalRef.componentInstance.rejectReasons = rejectReasons;

    modalRef.result.then(
      () => {
        this.isOpen = false;
        this.onClose();
      },
      () => {
        this.isOpen = false;
        this.onClose();
      }
    );
    this.setDialogRef(modalRef);
    return modalRef;
  }

  onOpen(): void {
    window.addEventListener("popstate", this.closePopup);
  }

  /**
   * @description an event to close the current opened modal, if exists;
   * */
  closePopup = (): void => {
    this.onClose();
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  };

  onClose(): void {
    window.removeEventListener("popstate", this.closePopup);
  }
}
