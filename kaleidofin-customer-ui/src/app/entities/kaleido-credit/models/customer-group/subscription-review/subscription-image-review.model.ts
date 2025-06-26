import { Customer } from "../../customer/customer.model";
import { NachMandate } from "../../nach-mandate/nach-mandate.model";
import { BankDetailDTO } from "./bank-detail.model";
import { CustomerSubscription } from "./customer-subscription.model";
import { KycKraStatus } from "./kyc-kra-status.model";

export class SubscriptionImageReview {
  constructor(
    public customerDTO?: Customer,
    public customerSubscriptionDTO?: CustomerSubscription,
    public customerFileMappingDTOs?: any,
    public entityFileMappingDTOs?: any[],
    public nachMandateDTO?: NachMandate,
    public docReviewStatusDTOs?: any[],
    public videoOTP?: string,
    public signzyUrl?: string,
    public reviewOptionList?: any[],
    public reasonOptionsModel?: any[],
    public techReviewOptionList?: any[],
    public techReasonOptionsModel?: any[],
    public bankDetailDTO?: BankDetailDTO,
    public kycStatusDTO?: KycKraStatus,
    public editDisabled?: boolean,
    public eMandateStatus?: string
  ) {}
}
