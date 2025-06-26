import { EventEmitter, Injectable, Output } from "@angular/core";
import { CustomerSubscription } from "../../../models/customer-group/subscription-review/customer-subscription.model";
import { Partners } from "../../../models/partners/partners.model";

@Injectable()
export class SubscriptionReviewModelService {
  customerSubscription: CustomerSubscription = null;
  errorStatus: string = "";
  deactivateStatus: boolean = false;
  bankDetailReviewStatus: string = "";
  nachImageReviewStatus: string = "";
  nachDataReviewStatus: string = "";
  nachAcceptStatus: string = "";
  msaImageReviewStatus: string = "";
  msaDataReviewStatus: string = "";
  msaAcceptStatus: string = "";
  kycImageReviewStatus: string = "";
  kycDataReviewStatus: string = "";
  kycVideoReviewStatus: string = "";
  kycAcceptStatus: string = "";
  notifyAgentStatus: boolean = false;
  partner: Partners = null;
  skipKyc: boolean = false;
  @Output() smsDisableOrEnable: EventEmitter<any> = new EventEmitter();
  constructor() {
    this.deactivateStatus = false;
  }

  setCustomerSubscription(customerSubscription) {
    this.customerSubscription = customerSubscription;
  }

  getCustomerSubscription() {
    return this.customerSubscription;
  }

  setBankDetailReviewStatus(bankDetailReviewStatus) {
    this.bankDetailReviewStatus = bankDetailReviewStatus;
  }

  getBankDetailReviewStatus() {
    return this.bankDetailReviewStatus;
  }

  setNachImageReviewStatus(nachImageReviewStatus) {
    this.nachImageReviewStatus = nachImageReviewStatus;
  }

  getNachImageReviewStatus() {
    return this.nachImageReviewStatus;
  }

  setNachDataReviewStatus(nachDataReviewStatus) {
    this.nachDataReviewStatus = nachDataReviewStatus;
  }

  getNachDataReviewStatus() {
    return this.nachDataReviewStatus;
  }

  setNachAcceptStatus(nachAcceptStatus) {
    this.nachAcceptStatus = nachAcceptStatus;
  }

  getNachAcceptStatus() {
    return this.nachAcceptStatus;
  }

  setMsaImageReviewStatus(msaImageReviewStatus) {
    this.msaImageReviewStatus = msaImageReviewStatus;
  }

  getMsaImageReviewStatus() {
    return this.msaImageReviewStatus;
  }

  setMsaDataReviewStatus(msaDataReviewStatus) {
    this.msaDataReviewStatus = msaDataReviewStatus;
  }

  getMsaDataReviewStatus() {
    return this.msaDataReviewStatus;
  }

  setMsaAcceptStatus(msaAcceptStatus) {
    this.msaAcceptStatus = msaAcceptStatus;
  }

  getMsaAcceptStatus() {
    return this.msaAcceptStatus;
  }

  setKycImageReviewStatus(kycImageReviewStatus) {
    this.kycImageReviewStatus = kycImageReviewStatus;
  }

  getKycImageReviewStatus() {
    return this.kycImageReviewStatus;
  }

  setKycDataReviewStatus(kycDataReviewStatus) {
    this.kycDataReviewStatus = kycDataReviewStatus;
  }

  getKycDataReviewStatus() {
    return this.kycDataReviewStatus;
  }

  setKycVideoReviewStatus(kycVideoReviewStatus) {
    this.kycVideoReviewStatus = kycVideoReviewStatus
  }

  getKycVideoReviewStatus() {
    return this.kycVideoReviewStatus;
  }

  setKycAcceptStatus(kycAcceptStatus) {
    this.kycAcceptStatus = kycAcceptStatus
  }

  getKycAcceptStatus() {
    return this.kycAcceptStatus;
  }

  setErrorStatus(errorStatus) {
    this.errorStatus = errorStatus
  }

  getErrorStatus() {
    return this.errorStatus;
  }

  setDeactivateStatus(deactivateStatus) {
    this.deactivateStatus = deactivateStatus
  }

  getDeactivateStatus() {
    return this.deactivateStatus;
  }

  setNotifyAgentStatus(notifyAgentStatus) {
    this.notifyAgentStatus = notifyAgentStatus
  }

  getNotifyAgentStatus() {
    return this.notifyAgentStatus;
  }

  setSmsDisableOrEnable(smsDisableOrEnable) {
    this.smsDisableOrEnable.emit(smsDisableOrEnable);
  }

  getSmsDisableOrEnable() {
    return this.smsDisableOrEnable;
  }

  setPartner(partner) {
    this.partner = partner;
  }

  getPartner() {
    return this.partner;
  }

  setKycSkip(skipKyc: boolean) {
    this.skipKyc = skipKyc;
  }
  getKycSkip() {
    return this.skipKyc;
  }
}
