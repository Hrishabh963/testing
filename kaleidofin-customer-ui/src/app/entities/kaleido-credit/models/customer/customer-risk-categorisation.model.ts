export class RiskCategorisation {
  constructor(
    public id?: number,
    public version?: number,
    public loanApplicationId?: number,
    public partnerLoanId?: string,
    public partnerCustomerId?: string,
    public entityId?: string,
    public entityType?: string,
    public pepStatus?: string,
    public occupationStatus?: string,
    public kycIdRiskCategory?: string,
    public kycRiskCategory?: string
  ) {}
}
