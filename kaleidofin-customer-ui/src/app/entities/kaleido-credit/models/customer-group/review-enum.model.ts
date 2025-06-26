export enum ReviewType {
  Review = "Review",
  Approve = "Approve",
  REJECT = "REJECT",
  UPLOAD_PENDING="UploadPending"
}

export enum SubscriptionReviewMode {
  KYC = "KYC",
  PAYMENT = "PAYMENT",
  MSA = "MSA",
}

export enum UserRoleType {
  Reviewer = "Reviewer",
  Approver = "Approver",
  Supervisor = "Supervisor",
}

export enum SubscriptionType {
  KF_GOAL = "KF_GOAL",
  PARTNER_LOAN = "PARTNER_LOAN",
}

export enum DocReviewType {
  KYC = "KYC",
  MSA = "MSA",
  NACH = "NACH",
  PAYMENT = "PAYMENT",
  LOAN_APPLICATION = "LOAN_APPLICATION",
  LOAN_DOCUMENT = "LOAN_DOCUMENT",
  ENTREPRENEUR = "ENTREPRENEUR",
  LOAN_OBLIGATOR = "LOAN_OBLIGATOR",
  CO_APPLICANT_KYC = "CO_APPLICANT_KYC",
}

export enum ReviewEntity {
  Customer = "Customer",
  CustomerSubscription = "CustomerSubscription",
  LoanApplication = "LoanApplication",
}
