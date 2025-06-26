import { BehaviorSubject } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class UpdatedSubscriptionDataService {
  // NOTE This service is added to have a common place to store the updated subscription data and to be able to access it from all the components
  constructor() {}
  entityReviewDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  customerSubscriptionData: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  currentTab: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  allocatedSubscriptionSpan: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  setLocallyStatusAndPush(type: "MSA" | "KYC" | "PAYMENT", status: string) {
    console.log("Locally setting status for " + type + " to " + status);
    let dat = this.customerSubscriptionData.getValue();
    if (type == "MSA") {
      dat.customerSubscriptionDTO.msaReviewStatus = status;
    } else if (type == "KYC") {
      dat.customerDTO.kycReviewStatus = status;
    } else if (type == "PAYMENT") {
      dat.customerSubscriptionDTO.nachReviewStatus = status;
    }
    this.customerSubscriptionData.next(dat);
  }
}
