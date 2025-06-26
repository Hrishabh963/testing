import {Injectable} from '@angular/core';
import {KcreditLoanDetailsModel} from './loan/kcredit-loanDetails.model';
import {ObligatorTypes} from './loan/constant';

@Injectable()
export class KcreditInterDataService {
  loanReviewDedupe: boolean = false;
  public coApplicants: any[] = [];
  constructor() {}

  setLoanReviewDedupe(value: boolean) {
    this.loanReviewDedupe = value;
  }

  getLoanReviewDedupe() {
    return this.loanReviewDedupe;
  }

  getCoApplicant(loanDetails: KcreditLoanDetailsModel) {
    this.coApplicants = [];
    if (loanDetails?.loanObligatorDTOList) {
      loanDetails.loanObligatorDTOList.forEach((x, i) => {
        if (x.type == ObligatorTypes.coApplicant) {
          this.coApplicants.push(x);
        }
      });
    }
    return this.coApplicants;
  }

  getGuarantor(loanDetails: KcreditLoanDetailsModel): Array<any> {
    if (loanDetails?.loanObligatorDTOList) {
      const guarantors: Array<any> = loanDetails.loanObligatorDTOList.filter((obligator) => {
        if (obligator.type === "GUARANTOR") return obligator;
      });
      return guarantors;
    }
    return [];
  }
}
