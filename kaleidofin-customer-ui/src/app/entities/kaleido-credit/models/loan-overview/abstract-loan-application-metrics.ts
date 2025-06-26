import { sum } from "lodash";

export abstract class AbstractLoanApplicationMetrics {

    protected loanStatusMetrics: any;

    constructor(countMetrics: any) {
        this.loanStatusMetrics = countMetrics
    }

    protected countApplications(statuses: string[]): number {
        return sum(statuses.map(s => this.loanStatusMetrics[s] || 0));
    }

}