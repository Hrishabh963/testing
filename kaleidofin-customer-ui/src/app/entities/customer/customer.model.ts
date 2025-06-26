export class Customer {
    constructor(
      public partnerCustomerId?: string,
      public customerId?: number,
      public customerName?: string,
      public subscriptionDate?: string,
      public time?: string,
      public subscriptionId?: number,
      public accountNumber?: string,
      public accountStatus?: string,
      public accountType?: string,
      public paymentMode?: string,
      public paymentModeId?: string,
      public paymentModeStatus?: string,
      public subscriptionStatus?: string,
      public branch?: string,
      public branchCode?: string,
      public center?: string,
      public centerCode?: string,
      public branchId?: number,
      public centerId?: number,
      public agentName?: string,
      public agentId?: string,
      public createdDate?: string
    ) {}
  }
  
  export class CustomerPage {
    constructor(
      public content?: Customer[],
      public size?: number,
      public number?: number,
      public totalPages?: number,
      public totalElements?: number,
      public first?: boolean,
      public last?: boolean
    ) {}
  }
  