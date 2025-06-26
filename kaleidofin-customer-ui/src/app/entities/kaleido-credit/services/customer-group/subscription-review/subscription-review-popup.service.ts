import { Component, Injectable } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class SubscriptionReviewPopupService {
  private isOpen = false;
  constructor(private readonly modalService: NgbModal) {}

  open(component: Component, data?: any): NgbModalRef {
    if (this.isOpen) {
      return null;
    }
    this.isOpen = true;
    return this.cropperModalRef(component, data);
  }

  cropperModalRef(component: Component, data): NgbModalRef {
    const modalRef = this.modalService.open(component, {
      size: "lg",
      backdrop: "static",
    });
    modalRef.componentInstance.customerId = data;

    modalRef.result.then(
      () => {
        this.isOpen = false;
      },
      () => {
        this.isOpen = false;
      }
    );
    return modalRef;
  }

  openNachRetryUploadDialogComponent(
    component: Component,
    nachEntityFileMapping?: any,
    oldNachImage?: any,
    partnerId?: any
  ): NgbModalRef {
    if (this.isOpen) {
      return null;
    }
    this.isOpen = true;
    return this.nachImageUploadPopupModalRef(
      component,
      nachEntityFileMapping,
      oldNachImage,
      partnerId
    );
  }

  nachImageUploadPopupModalRef(
    component: Component,
    nachEntityFileMapping,
    oldNachImage,
    partnerId
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, {
      size: "lg",
      backdrop: "static",
    });
    modalRef.componentInstance.nachEntityFileMapping = nachEntityFileMapping;
    modalRef.componentInstance.oldNachImage = oldNachImage;
    modalRef.componentInstance.partnerId = partnerId;

    modalRef.result.then(
      (result) => {
        this.isOpen = false;
      },
      (reason) => {
        this.isOpen = false;
      }
    );
    return modalRef;
  }

  openPennyDropPopup(component: Component, modelData: any): NgbModalRef {
    if (this.isOpen) {
      return null;
    }
    this.isOpen = true;
    return this.pennyDropModalRef(component, modelData);
  }

  pennyDropModalRef(component: Component, modelData): NgbModalRef {
    const modalRef = this.modalService.open(component, {
      windowClass: "col-md-4 mx-auto",
      backdrop: "static",
    });
    modalRef.componentInstance.modelData = modelData;
    modalRef.result.then(
      (result) => {
        this.isOpen = false;
      },
      (reason) => {
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
