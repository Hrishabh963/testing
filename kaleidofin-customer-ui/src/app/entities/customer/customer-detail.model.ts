export class AgentDetailsDTO {
    constructor(
      public branch?: string,
      public branchCode?: string,
      public city?: string,
      public state?: string,
      public center?: string,
      public centerCode?: string,
      public agentName?: string,
      public agentId?: string,
      public designation?: string,
      public mobileNumber?: number,
      public agentEmail?: string
    ) {}
  }
  
  export class BankDetailsDTO {
    constructor(
      public branch?: string,
      public branchCode?: string,
      public city?: string,
      public state?: string,
      public center?: string,
      public centerCode?: string,
      public agentName?: string,
      public agentId?: string,
      public designation?: string,
      public mobileNumber?: number,
      public agentEmail?: string
    ) {}
  }
  
  export class PaymentDTO {
    constructor(
      public paymentDate?: string,
      public totalAmount?: number,
      public paymentMode?: string,
      public status?: string,
      public transactionReferenceId?: string
    ) {}
  }
  
  export class SubscriptionDetailsDTO {
    constructor(
      public goal?: string,
      public subscriptionDate?: string,
      public paymentMode?: string,
      public nachMandateId?: string,
      public accountNum?: string,
      public status?: string,
      public statusString?: string,
      public createdDate?: string,
      public endDate?: string,
      public nextContributionDate?: string,
      public nachReviewAcceptedDate?: string,
      public nachReviewStatus?: string,
      public paymentsList?: PaymentDTO[]
    ) {}
  }
  
  export class CustomerDetails {
    constructor(
      public partnerCustomerId?: string,
      public customerName?: string,
      public customerId?: string,
      public primaryMobileNumber?: number,
      public email?: string,
      public panNumber?: string,
      public aadhaarNumber?: number,
      public pekrnNumber?: string,
      public branch?: string,
      public branchCode?: string,
      public center?: string,
      public centerCode?: string,
      public branchCity?: string,
      public branchState?: string,
      public bankDetailsList?: BankDetailsDTO[],
      public agentDetailsList?: AgentDetailsDTO[],
      public customerSubscriptionsList?: SubscriptionDetailsDTO[]
    ) {}
  }
  