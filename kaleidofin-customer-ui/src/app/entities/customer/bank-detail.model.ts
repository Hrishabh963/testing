export class BankDetailDTO {
    constructor(
      public id?: number,
      public customerId?: number,
      public bankAccountNum?: string,
      public ifscCode?: string,
      public micrCode?: string,
      public bankName?: string,
      public bankAccountType?: string,
      public accountHolderName?: string,
      public bankCode?: string,
      public bankBranch?: string,
      public bankAddress?: string,
      public bankContact?: string,
      public bankCity?: string,
      public bankDistrict?: string,
      public bankState?: string,
      public defaultBank?: boolean,
      public reviewStatus?: any,
      public rejectReason?: string,
      public techIssueStatus?: string,
      public techIssueReason?: string,
      public fileMappingId?: number,
      public validateAccount?: boolean,
      public accountVerificationStatus?: string,
      public accountVerificationDetailedStatus?: string,
      public providerResponseCode?: string,
      public providerDescription?: string,
      public accountHolderNameInBank?: string,
      public rejectedAccountCount?: number
    ) {}
  }
  