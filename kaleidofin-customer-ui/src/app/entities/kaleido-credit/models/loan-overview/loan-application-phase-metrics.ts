import { sum } from "lodash";
import { AbstractLoanApplicationMetrics } from "./abstract-loan-application-metrics";
import { LoanAgreementStageMetrics, LoanBookingStageMetrics, LoanDisbursalStageMetrics, LoanEntryStageMetrics, LoanReviewStageMetrics } from "./loan-application-status-metric";

export class LoanPhaseMetrics extends AbstractLoanApplicationMetrics {

    partnerName?: string;
    loanEntry: number;
    loanReview: number;
    loanAgreement: number;
    loanBooking: number;
    loanDisbursal: number;
    all: number;

    constructor(response: any) {
        super(response);
        this.loanEntry = new LoanEntryStageMetrics(this.loanStatusMetrics).all;
        this.loanReview = new LoanReviewStageMetrics(this.loanStatusMetrics).all;
        this.loanAgreement = new LoanAgreementStageMetrics(this.loanStatusMetrics).all;
        this.loanBooking = new LoanBookingStageMetrics(this.loanStatusMetrics).all;
        this.loanDisbursal = new LoanDisbursalStageMetrics(this.loanStatusMetrics).all;
        this.calculateSum();
    }

    private calculateSum(): void {
        this.all = sum([this.loanEntry, this.loanReview, this.loanAgreement, this.loanBooking, this.loanDisbursal]);
    }

    public addMoreCount(newMetrics: LoanPhaseMetrics): void {
        this.loanEntry += newMetrics.loanEntry;
        this.loanReview += newMetrics.loanReview;
        this.loanAgreement += newMetrics.loanAgreement;
        this.loanBooking += newMetrics.loanBooking;
        this.loanDisbursal += newMetrics.loanDisbursal;
        this.calculateSum();
    }

}