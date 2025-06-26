import { Injectable } from "@angular/core";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { SubscriptionReviewModelService } from "./subscription-review-model.service";

@Injectable()
export class SubscriptionReviewSupportService {
  readonly modalRef: NgbModalRef;

  constructor(
    private readonly subscriptionReviewModelService: SubscriptionReviewModelService
  ) {}

  dataURItoBlob(dataURI): any {
    const byteString = window.atob(dataURI) || "";
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    byteString.split("").forEach((elm, index) => {
      int8Array[index] = elm.charCodeAt(0);
    });
    return new Blob([arrayBuffer], { type: "image/jpeg" });
  }

  docReviewStatus(docReviewStatusDTOs, docType, docSubType): any {
    for (let elm of docReviewStatusDTOs) {
      const docReview = elm;
      if (docReview.type === docType && docReview.subType === docSubType) {
        return docReview;
      }
    }
  }

  updateSmsDisableOrEnable() {
    const partner = this.subscriptionReviewModelService.getPartner();
    const customerSubscription = this.subscriptionReviewModelService.getCustomerSubscription();
    const statuses = this.getStatuses();
    const skipKyc = this.subscriptionReviewModelService.getKycSkip();

    console.log("Statuses: ", statuses, "skipKyc: ", skipKyc);

    if (this.isSmsEnabled(statuses, skipKyc)) {
      this.subscriptionReviewModelService.setSmsDisableOrEnable(true);
    } else if (this.isSmsDisabledForPartnerType1(partner, customerSubscription, statuses, skipKyc)) {
      this.subscriptionReviewModelService.setSmsDisableOrEnable(false);
    } else if (this.isSmsDisabledForPartnerType2(partner, customerSubscription, statuses, skipKyc)) {
      this.subscriptionReviewModelService.setSmsDisableOrEnable(false);
    } else {
      console.log("Statuses: ", statuses, "skipKyc: ", skipKyc);
    }
  }

  getStatuses() {
    return {
      nachDataStatus: this.subscriptionReviewModelService.getNachDataReviewStatus(),
      nachImageStatus: this.subscriptionReviewModelService.getNachImageReviewStatus(),
      bankDetailStatus: this.subscriptionReviewModelService.getBankDetailReviewStatus(),
      kycDataStatus: this.subscriptionReviewModelService.getKycDataReviewStatus(),
      kycImageStatus: this.subscriptionReviewModelService.getKycImageReviewStatus(),
      kycVideoStatus: this.subscriptionReviewModelService.getKycVideoReviewStatus(),
      msaImageStatus: this.subscriptionReviewModelService.getMsaImageReviewStatus(),
      msaDataStatus: this.subscriptionReviewModelService.getMsaDataReviewStatus(),
      nachAcceptStatus: this.subscriptionReviewModelService.getNachAcceptStatus(),
      kycAcceptStatus: this.subscriptionReviewModelService.getKycAcceptStatus(),
      msaAcceptStatus: this.subscriptionReviewModelService.getMsaAcceptStatus(),
    };
  }

  isSmsEnabled(statuses, skipKyc) {
    return this.helperFunctionForAccept(statuses.nachAcceptStatus) &&
      (skipKyc || this.helperFunctionForAccept(statuses.kycAcceptStatus)) &&
      this.helperFunctionForAccept(statuses.msaAcceptStatus);
  }

  isSmsDisabledForPartnerType1(partner, customerSubscription, statuses, skipKyc) {
    return partner.typeOfPartner === "1" &&
      (customerSubscription.paymentMode !== "NACH" ||
        (customerSubscription.paymentMode === "NACH" &&
          statuses.nachDataStatus && statuses.nachDataStatus !== "PENDING" &&
          statuses.nachImageStatus && statuses.nachImageStatus !== "PENDING")) &&
      this.helperFunction(statuses.bankDetailStatus) &&
      (skipKyc ||
        (this.helperFunction(statuses.kycDataStatus) &&
          this.helperFunction(statuses.kycImageStatus) &&
          this.helperFunction(statuses.kycVideoStatus))) &&
      this.helperFunction(statuses.msaImageStatus) &&
      this.helperFunction(statuses.msaDataStatus);
  }

  isSmsDisabledForPartnerType2(partner, customerSubscription, statuses, skipKyc) {
    return partner.typeOfPartner === "2" &&
      (customerSubscription.paymentMode !== "NACH" ||
        (customerSubscription.paymentMode === "NACH" &&
          this.helperFunction(statuses.nachDataStatus) &&
          this.helperFunction(statuses.nachImageStatus) &&
          this.helperFunction(statuses.bankDetailStatus) &&
          (skipKyc ||
            (this.helperFunction(statuses.kycDataStatus) &&
              this.helperFunction(statuses.kycImageStatus) &&
              this.helperFunction(statuses.kycVideoStatus)))));
  }

  helperFunctionForAccept(data) {
    return data === "ACCEPT";
  }

  

  helperFunction(data) {
    return data !== null && data !== undefined && data !== "PENDING";
  }

  fatchReviewStatus(docReviewStatusDTOs, docType, docSubType) {
    const docReview = this.docReviewStatus(docReviewStatusDTOs, docType, docSubType);
    if (docReview !== undefined && docReview.reviewStatus !== undefined) {
      return docReview.reviewStatus;
    } else {
      return null;
    }
  }
}
