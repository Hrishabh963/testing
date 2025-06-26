import { sum } from "lodash";
import { ApplicationStatus } from "../../loan/constant";
import { AbstractLoanApplicationMetrics } from "./abstract-loan-application-metrics";

/**
 * Loan entry phase metrics for all substages
 */
export class LoanEntryStageMetrics extends AbstractLoanApplicationMetrics {
  incomplete: number;
  complete: number;
  all: number;

  constructor(response: any) {
    super(response);
    this.incomplete = this.countApplications([
      ApplicationStatus.incomplete,
      ApplicationStatus.error,
    ]);
    this.complete = this.countApplications([ApplicationStatus.complete]);
    this.all = sum([this.incomplete, this.complete]);
  }
}

/**
 * All sub stages for loan review stage
 */
export class LoanReviewStageMetrics extends AbstractLoanApplicationMetrics {
  pending: number;
  rejected: number;
  rework: number;
  approved: number;
  cancelled: number;
  all: number;

  constructor(response: any) {
    super(response);
    this.pending = this.countApplications([
      ApplicationStatus.pending,
      ApplicationStatus.externalpending,
    ]);
    this.rejected = this.countApplications([ApplicationStatus.reject]);
    this.rework = this.countApplications([ApplicationStatus.retry]);
    this.approved = this.countApplications([
      ApplicationStatus.conditionalapprove,
    ]);
    this.cancelled = this.countApplications([ApplicationStatus.cancelled]);
    this.all = sum([
      this.pending,
      this.rejected,
      this.rework,
      this.approved,
      this.cancelled,
    ]);
  }
}

/**
 * all substrages for loan agreement
 */
export class LoanAgreementStageMetrics extends AbstractLoanApplicationMetrics {
  pending: number;
  received: number;
  rework: number;
  approved: number;
  all: number;

  constructor(response: any) {
    super(response);
    this.pending = this.countApplications([
      ApplicationStatus.pendingagreement,
      ApplicationStatus.agreement,
    ]);
    this.received = this.countApplications([
      ApplicationStatus.agreementreceived,
    ]);
    this.rework = this.countApplications([ApplicationStatus.agreementretry]);
    this.approved = this.countApplications([ApplicationStatus.approve]);
    this.all = sum([this.pending, this.received, this.rework, this.approved]);
  }
}

/**
 * all substrages for loan agreement
 */
export class LoanBookingStageMetrics extends AbstractLoanApplicationMetrics {
  pending: number;
  booked: number;
  retry: number;
  recieved: number;
  rejected: number;
  all: number;

  constructor(response: any) {
    super(response);
    this.pending = this.countApplications([
      ApplicationStatus.externalbooking,
      ApplicationStatus.pendingbooking,
    ]);
    this.recieved = this.countApplications([ApplicationStatus.bookingReceived]);
    this.booked = this.countApplications([ApplicationStatus.booked]);
    this.retry = this.countApplications([ApplicationStatus.bookingRetry]);
    this.rejected = this.countApplications([
      ApplicationStatus.rejectedbooking,
      ApplicationStatus.rejectedexternalbooking,
    ]);
    this.all = sum([
      this.pending,
      this.recieved,
      this.booked,
      this.retry,
      this.rejected,
    ]);
  }
}

/**
 * all substrages for loan agreement
 */
export class LoanDisbursalStageMetrics extends AbstractLoanApplicationMetrics {
    pending: number;
    disbursed: number;
    authorize: number;
    all: number;

  constructor(response: any) {
    super(response);
    this.pending = this.countApplications([
      ApplicationStatus.pendingdisbursal,
      ApplicationStatus.externaldisbursal,
    ]);
    this.disbursed = this.countApplications([ApplicationStatus.disbursed]);
        this.authorize = this.countApplications([ApplicationStatus.AUTHORIZE]);
    this.all = sum([this.pending, this.disbursed,this.authorize]);
  }
}
/**
 * all substrages for Ki score stages
 */
export class KiscoreResultsStageMetrics extends AbstractLoanApplicationMetrics {
  all: number;
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
  constructor(response: any) {
    super(response);
    this.pending = this.countApplications([
      ApplicationStatus.pending,
      ApplicationStatus.incomplete,
      ApplicationStatus.externalpending,
    ]);
    this.approved = this.countApplications([ApplicationStatus.scoredapproved]);
    this.rejected = this.countApplications([ApplicationStatus.scoredrejected]);
    this.cancelled = this.countApplications([ApplicationStatus.cancelled]);
    this.all = sum([
      this.pending,
      this.approved,
      this.rejected,
      this.cancelled,
    ]);
  }
}
/**
 * All sub stages for loan review stage
 */
export class BusinessReviewStageMetrics extends AbstractLoanApplicationMetrics {
  pending: number;
  rejected: number;
  rework: number;
  approved: number;
  cancelled: number;
  all: number;

  constructor(response: any) {
    super(response);
    this.pending = this.countApplications(["REVIEW_PENDING"]);
    this.rejected = this.countApplications(["REJECTED"]);
    this.rework = this.countApplications(["REWORK"]);
    this.all = sum([this.pending, this.rejected, this.rework]);
  }
}
/**
 * All sub stages for loan review stage
 */
export class BusinessAgreementStageMetrics extends AbstractLoanApplicationMetrics {
  pending: number;
  received: number;
  rework: number;
  approved: number;
  cancelled: number;
  all: number;

  constructor(response: any) {
    super(response);
    this.pending = this.countApplications(["AGREEMENT_PENDING"]);
    this.received = this.countApplications(["AGREEMENT_RECEIVED"]);
    this.rework = this.countApplications(["AGREEMENT_REWORK"]);
    this.approved = this.countApplications(["APPROVED"]);
    this.cancelled = this.countApplications(["CANCELLED"]);
    this.all = sum([
      this.pending,
      this.received,
      this.rework,
      this.approved,
      this.cancelled,
    ]);
  }
}
