import { KCreditLoanApplication } from "../report/kcredit-loan-application.model";

import { CreditBureauInfo } from "../models/credit-bureau-info.model";
import { LoanFee } from "../models/loan-fee.model";
import { PropertyDetails } from "../models/property-details.model";
import { BankDetails } from "../models/customer/bank-details.model";
import { Customer } from "../models/customer/customer.model";
import { RiskCategorisation } from "../models/customer/customer-risk-categorisation.model";

export class KcreditLoanDetailsModel {
  constructor(
    public loanApplicationDTO?: KCreditLoanApplication,
    public customerDTO?: Customer,
    public customerFileMappingDTOList?: any[],
    public loanReferenceDTOList?: any[],
    public nomineeDetails?: any,
    public partnerDTO?: any,
    public branchDTO?: any,
    public centerDTO?: any,
    public bankDetail?: any,
    public existingLoansDTOList?: any[],
    public customerFileMappingDTOs?: any,
    public addressDTOList?: any[],
    public familyDetailsList?: any[],
    public loanObligatorDTOList?: any,
    public loanFeeDTO?: LoanFee,
    public propertyDetails?: PropertyDetails,
    public creditBureauInfoDTO?: CreditBureauInfo,
    public enableLoanApproval?: boolean,
    public isReferred?: boolean,
    public customerRiskProfileDTO?: Array<RiskCategorisation>,
    public isBreNeeded?: boolean,
  ) {}
}
