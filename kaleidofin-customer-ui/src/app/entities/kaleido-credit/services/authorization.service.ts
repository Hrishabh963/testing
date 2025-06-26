import { Injectable } from "@angular/core";
import { ApplicationStatus } from "../loan/constant";
import { LoanReviewService } from "../report/loan-review.service";
import { AUTHORITES } from "../constants/authorization.constants";

@Injectable({
  providedIn: "root",
})
export class AuthorizationService {
  authorities: Array<string> = [];

  constructor(
    private readonly loanApplicationReviewService: LoanReviewService
  ) {}

  setAuthorities(authorities: Array<string> = []) {
    this.authorities = authorities;
  }
  hasAuthority(authority: string = "") {
    return this.authorities.includes(authority);
  }
  hasAuthorityByStage(authority: string = "", loanStage: string = "") {
    switch (loanStage) {
      case ApplicationStatus.pending:
      case ApplicationStatus.externalpending:
      case ApplicationStatus.reject:
      case ApplicationStatus.retry:
      case "LOANREVIEW":
      case "Review":
        return this.authorities.includes(`LOANREVIEW_${authority}`);
      case ApplicationStatus.agreement:
      case ApplicationStatus.pendingagreement:
      case ApplicationStatus.agreementretry:
      case ApplicationStatus.agreementreceived:
      case "LOANAGREEMENT":
      case "Agreement":
        return this.authorities.includes(`LOANAGREEMENT_${authority}`);
      case ApplicationStatus.disbursed:
      case ApplicationStatus.pendingdisbursal:
      case ApplicationStatus.externaldisbursal:
      case ApplicationStatus.AUTHORIZE:
      case "LOANDISBURSAL":
      case "Disbursal":
        return this.authorities.includes(`LOANDISBURSED_${authority}`);
      case ApplicationStatus.booked:
      case ApplicationStatus.rejectedbooking:
      case ApplicationStatus.pendingbooking:
      case ApplicationStatus.externalbooking:
      case ApplicationStatus.rejectedexternalbooking:
      case "LOANBOOKING":
      case "Booking":
        return this.authorities.includes(`LOANBOOKING_${authority}`);
      default:
        return this.authorities.includes(authority);
    }
  }

  validateEditAccess(authority = AUTHORITES.EDIT_DETAILS) {
    return this.hasAuthorityByStage(
      authority,
      this.loanApplicationReviewService.getLoanStatus()
    );
  }
}
