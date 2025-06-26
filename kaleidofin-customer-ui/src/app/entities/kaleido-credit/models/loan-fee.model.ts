export class LoanFee {
  constructor(
    public id?: number,
    public version?: number,
    public loanApplicationId?: number,
    public totalProcessingFee?: number,
    public kcplProcessingFeePer?: number,
    public partnerProcessingFeePer?: number,
    public partnerProcessingFeeAmount?: number,
    public insurancePremiumAmount?: number,
    public stampDutyAmount?: number,
    public otherFeeAmount?: number,
    public kcplOtherFeePer?: number,
    public kcplOtherFeeAmount?: number,
    public partnerOtherFeePer?: number,
    public partnerOtherFeeAmount?: number,
    public kcplProcessingFeeAmount?: number
  ) {}
}
