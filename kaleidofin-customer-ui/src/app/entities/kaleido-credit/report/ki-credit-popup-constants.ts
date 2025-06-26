import { ApplicationStatus } from "../loan/constant";

export const BUSINESS_REVIEW_POPUP_METADATA = {
  agreement: {
    isRemarksMandatory: false,
    rejectReasons: [
      {
        label: "Business profile related discrepancies",
        value: "BUSINESS_PROFILE",
      },
      {
        label: "Discrepancies in business documents",
        value: "BUSINESS_REGISTRATION_DOCUMENTS",
      },
      {
        label: "Discrepancies in KYC Documents",
        value: "KYC_DOCUMENTS",
      },
      {
        label: "Reference related Discrepancies",
        value: "SUPPLIER_REFERENCE",
      },
    ],
    rejectOptions: [
      { label: "Rework", value: "AGREEMENT_REWORK" },
      { label: "Cancelled", value: "CANCELLED" },
    ],
    title: "Are you sure you want to reject this agreement?",
  },
  review: {
    isRemarksMandatory: false,
    rejectReasons: [
      {
        label: "Business profile related discrepancies",
        value: "BUSINESS_PROFILE",
      },
      {
        label: "Discrepancies in business documents",
        value: "BUSINESS_REGISTRATION_DOCUMENTS",
      },
      {
        label: "Discrepancies in KYC Documents",
        value: "KYC_DOCUMENTS",
      },
      {
        label: "Reference related Discrepancies",
        value: "SUPPLIER_REFERENCE",
      },
    ],
    rejectOptions: [
      { label: "Rework", value: "REWORK" },
      { label: "Final Reject", value: "REJECTED" },
    ],
  },
};
export const POPUP_METADATA = {
  agreement: {
    displayActionRequired: true,
    actionRequired: [
      { value: "resubmitLoanApplication", label: "Resubmit Loan Application" },
      {
        value: "resubmitLoanDocuments",
        label: "Resubmit Loan Documents",
      },
    ],
    rejectionType: [
      { label: "Rework", value: ApplicationStatus.retry },
      { label: "Final Reject", value: ApplicationStatus.reject },
      { label: "Cancelled", value: ApplicationStatus.cancelled },
    ],
  },
  agreementReceived: {
    displayActionRequired: true,
    actionRequired: [
      { value: "Re-upload ADR", label: "Resubmit ADR File" },
      {
        value: "resubmitLoanDocuments",
        label: "Resubmit Loan Documents",
      },
    ],
    rejectionType: [
      { label: "Rework", value: ApplicationStatus.agreementretry },
      {
        label: "Move Application to Agreement Pending",
        value: ApplicationStatus.pendingagreement,
      },
    ],
    hideReasonValue: [ApplicationStatus.pendingagreement],
    updateButtonsByValue: {
      value: ApplicationStatus.pendingagreement,
      text: "Yes, Move",
    },
  },
  loanReview: {
    displayActionRequired: true,
    actionRequired: [
      { value: "resubmitLoanApplication", label: "Resubmit Loan Application" },
      { value: "resubmitLoanDocuments", label: "Resubmit Loan Documents" },
    ],
    rejectionType: [
      { label: "Rework", value: ApplicationStatus.retry },
      { label: "Final Reject", value: ApplicationStatus.reject },
      { label: "Cancelled", value: ApplicationStatus.cancelled },
    ],
  },
  retry: {
    displayActionRequired: false,
    actionRequired: [],
    rejectionType: [
      { label: "Final Reject", value: ApplicationStatus.forceReject },
      { label: "Cancelled", value: ApplicationStatus.cancelled },
    ],
    disableActionRequiredChecks: true,
    remarksPlaceholder: "Add Remarks",
  },
  agreementretry: {
    displayActionRequired: false,
    actionRequired: [],
    rejectionType: [
      {
        label: "Move Application to Agreement Pending",
        value: ApplicationStatus.pendingagreement,
      },
      { label: "Final Reject", value: ApplicationStatus.reject },
      { label: "Cancelled", value: ApplicationStatus.cancelled },
    ],
    updateButtonsByValue: {
      value: ApplicationStatus.pendingagreement,
      text: "Yes, Move",
    },
    hideReasonValue: [ApplicationStatus.pendingagreement],
    disableActionRequiredChecks: true,
    remarksPlaceholder: "Add Remarks",
  },
  default: {
    displayActionRequired: true,
    actionRequired: [
      { value: "resubmitLoanApplication", label: "Resubmit Loan Application" },
      { value: "resubmitLoanDocuments", label: "Resubmit Loan Documents" },
    ],
    rejectionType: [
      { label: "Rework", value: ApplicationStatus.retry },
      { label: "Final Reject", value: ApplicationStatus.reject },
    ],
  },
};

export const getBusinessReviewPopupConstant = (
  applicationStatus: string = ""
) => {
  switch (true) {
    case ApplicationStatus.AGREEMENT_PENDING.includes(applicationStatus):
    case ApplicationStatus.pendingagreement.includes(applicationStatus):
    case ApplicationStatus.AGREEMENT_RECEIVED.includes(applicationStatus):
    case ApplicationStatus.APPROVED.includes(applicationStatus):
    case ApplicationStatus.agreement.includes(applicationStatus):
    case ApplicationStatus.agreementretry.includes(applicationStatus):
      return BUSINESS_REVIEW_POPUP_METADATA.agreement;
    default:
      return BUSINESS_REVIEW_POPUP_METADATA.review;
  }
};

export const getPopupConstant = (applicationStatus: string = "") => {
  switch (true) {
    case ApplicationStatus.agreementreceived.includes(applicationStatus):
      return POPUP_METADATA.agreementReceived;
    case typeof applicationStatus === "object":
    case ApplicationStatus.externalpending.includes(applicationStatus):
    case ApplicationStatus.pending.includes(applicationStatus):
      return POPUP_METADATA.loanReview;
    case ApplicationStatus.pendingagreement.includes(applicationStatus):
    case ApplicationStatus.agreement.includes(applicationStatus):
      return POPUP_METADATA.agreement;
    case ApplicationStatus.retry.includes(applicationStatus):
      return POPUP_METADATA.retry;
    case ApplicationStatus.agreementretry.includes(applicationStatus):
      return POPUP_METADATA.agreementretry;

    default:
      return POPUP_METADATA.default;
  }
};

export const CB_DATA_EXPIRED_ALERT = `CB Data outdated(over 15 days). New CB Data will be fetched for the
      recalculating the ki score which will affect the credit scores of
      applicant, co applicant and guarantor.`;
export const CB_DATA_NOT_AVAILABLE = `CB Data is not available. New CB Data will be fetched for the recalculating the ki score which will affect the credit scores of applicant, co applicant and guarantor.`;
export const CB_DATA_RESUBMISSION = `CB data older than 15 days. BC Partner must resubmit the CB Data`;
export const CB_DATA_NOT_AVAILABLE_FROM_PARTNER = `CB data not available. BC Partner must submit the CB Data.`;
export const RETRY_KI_SCORE_SUCCESS = `ki score Recalculated Successfully`;
export const RETRY_KI_SCORE_FAILED = `Some error occurred while recalculating ki score`;
