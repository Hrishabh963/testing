export class LoanApplicationSearchSpecification{
    constructor(
    public  customerName?: string,
	public  applicationNumber?: any,
	public  customerSubscriptionNumber?: string,
	public  status?: any,
	public  lendingPartnerCode ?: string,
	public  appliedFromDate?: any,
	public  appliedToDate?: any,
	public  lienFromDate?: any,
	public  lienToDate?: any,
	public  loanState?: string,
	public  loanClosedFromDate?: any,
	public  loanClosedToDate?: any,
	public  any?: string
    ){}
}