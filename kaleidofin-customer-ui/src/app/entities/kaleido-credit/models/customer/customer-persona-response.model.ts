import { CustomerMutualFundSubscriptionsDTOs } from "./customer-mutual-fund-subscriptions.model";

export class CustomerSubscriptionsDTO {
  constructor(
    public id?: number,
    public version?: number,
    public customerId?: number,
    public subscriptionDate?: any,
    public endDate?: any,
    public message1?: string,
    public message2?: string,
    public productNote?: string,
    public contributionAmount?: number,
    public finalContributionAmount?: number,
    public frequency?: string,
    public agreementId?: number,
    public status?: any,
    public schemes?: CustomerMutualFundSubscriptionsDTOs,
    public schemeCode?: string,
    public solution?: string,
    public contributionPeriod?: string,
    public accountNum?: string,
    public solutionCode?: string,
    public actualContributionAmount?: string,
    public nextContributionDate?: any,
    public partnerId?: number,
    public customerName?: string,
    public enrollmentTemplateResponseHeaderId?: number
  ) {}
}
