
export class BankDetails {
    constructor(
        public id?: number,
        public version?: number,
        public customerId?: number,
        public bankAccountNum?: any,
        public ifscCode?: any,
        public micrCode?: any,
        public bankName?: any,
        public bankAccountType?: any,
        public accountHolderName?: any,
        public bankCode?: any,
        public bankBranch?: any,
        public bankAddress?: any,
        public bankContact?: any,
        public bankCity?: any,
        public bankState?: any,
        public defaultBank?: any,
        public reviewStatus?: any,
        public techIssueStatus?: any,
        public techIssueReason?: any,
        public fileMappingId?: any,
        public validateAccount?: any,
        public accountVerificationStatus?: any,
        public isNachModeOffline?: any,
        public provider?: any,
        public providerResponseCode?: any,
        public rejectedAccountCount?: number,
        public providerDescription?: any,
        public accountVerificationDetailedStatus?: any,
        public accountHolderNameInBank?: any,
        public nachReviewStatus?: any,
        public isAadhaarLinked?: boolean,
        public bankDistrict?: any
) {
    }

}
