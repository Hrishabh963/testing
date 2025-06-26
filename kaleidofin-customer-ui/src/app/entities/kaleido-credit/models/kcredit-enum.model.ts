export enum LoanTypeEnum {
    Krediline = 'Krediline',
    JLG = 'JLG',
    Entrepreneural = 'Entrepreneural'
}

export enum ReviewEntity {
    Customer = 'Customer',
    CustomerSubscription = 'CustomerSubscription',
    LoanApplication = 'LoanApplication'
}

export enum BankValidationStatus {
    Verified = 'VERIFIED',
    NotVerified = 'NOT_VERIFIED',
    Initiated = 'INITIATED',
    Failure = 'FAILURE'
}

export enum DedupeEntityType {
    applicant = 'applicant',
    co_applicant = 'co_applicant'
}

export enum DocumentUploadStatus {
    NOT_APPLICABLE = 'NOT_APPLICABLE',
    PENDING = 'PENDING',
    UPLOAD_PENDING = 'UPLOAD_PENDING',
    RECEIVED = 'RECEIVED',
    DELAYED = 'DELAYED',
    APPROVED = 'APPROVED'
}

export enum IdfyEntity {
    KycDetails = 'KycDetails',
    CoapplicantKycDetails = 'CoapplicantKycDetails'
}

