export class LoanInfoDTO {
    constructor(
        public closureAmount?: number,
        public  emi?:number,
        public  amountDueToday?: number,
        public  currentDate?: Date,
        public  minInstallmentAmount?: number,
        public repaymentDate?: Date
	
    ) {
    }
}
