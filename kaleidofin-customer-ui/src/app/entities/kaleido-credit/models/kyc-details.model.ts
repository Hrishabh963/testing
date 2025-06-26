export interface KycDetailsForLoan {
  id?: number;
  version?: number;
  customerId?: number;
  providerId?: number;
  providerName?: string;
  purpose?: string;
  verificationStatus?: string;
  message?: string | null;
  idNo?: string;
  maskedIdNo?: string | null;
  documentType?: string;
  documentName?: string;
  customerFileMappingId?: number | null;
  sortOrder?: number | null;
  expiryDate?: string | null;
  groupId?: string;
  isDefault?: boolean | null;
  fileId?: number | null;
  reviewRemarks?: string;
  idNoVerificationStatus?: string | null;
}

export interface CoApplicantKycDetail extends KycDetailsForLoan {
  entityId?: number;
  entityType?: string;
}

export interface KycDetails {
  coapplicantKycDetailsList?: Array<CoApplicantKycDetail>;
  kycDetailsList?: Array<KycDetailsForLoan>;
}


export const VERIFICATION_TYPE = {
  "CO_APPLICANT": "coApplicant",
  "GUARANTOR": "guarantor",
  "NOMINEE": "nominee"
}