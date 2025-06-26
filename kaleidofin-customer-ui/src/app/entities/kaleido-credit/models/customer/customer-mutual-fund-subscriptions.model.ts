export class CustomerMutualFundSubscriptionsDTOs {
  constructor(
    public id?: number,
    public version?: number,
    public customerSubscriptionsId?: number,
    public schemeCode?: string,
    public percentage?: number
  ) {}
}
