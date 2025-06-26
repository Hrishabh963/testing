
export class ExistingLoan {
    constructor(
    public  id?: number,
    public  version?: number,
    public  customerId?: number,
    public  loanType?: any,
    public  instituteName?: any,
    public  accountNumber?: any,
    public  loanAmount?: number,
    public  tenure?: number,
    public  emiAmount?: number,
    public  outstandingAmount?: number,
    public  loanApplicationNumber?: number
    ) {
    }
}
