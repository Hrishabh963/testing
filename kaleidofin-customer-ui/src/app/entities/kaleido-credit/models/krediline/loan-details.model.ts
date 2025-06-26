export class LoanDetails {
  constructor(
    public applicationNumber?: number,
    public id?: number,
    public loan?: any,
    public customer?: any,
    public mutualFundLienHoldings?: any,
    public loanURL?: string,
    public lienURL?: string,
    public bankDetails?: any,
    public mandateStart?: string,
    public formNo?: string,
    public applicationStatus?: string,
    public isLoanSelected?: boolean,
    public approvePhase?: any,
    public rejectPhase?: any,
    public bookingStatus?: string,
    //@author Yoharaj, @description Task - #13734: Adding a Warning Icon
    public showWarningIcon?: boolean,
    //Extra
    public eligibility?: boolean,
    public kiscore?: any,
    public loanAmount?: any,
    public partnerCustomerId?: any,
    public partnerId?: any,
    public secondaryMobileNumber?: any,
    public customerName?: any,
    public applicationDate?: any,
    public partnerLoanId?: any,
    public accountNumber?: any,
    public groupId?: any,
    public centerCode?: any,
    public dedupeCompleted?: any,
    public breDecision?: any,
    public invalidFields?: string,
    public notificationCount?: number
  ) {}
}
