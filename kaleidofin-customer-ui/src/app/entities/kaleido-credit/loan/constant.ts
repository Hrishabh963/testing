import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { AUTHORITES } from "../constants/authorization.constants";

export const LoanDetailSections = {
  loan: {
    title: "Loan",
    showInNav: false,
  },
  loanOverview: {
    title: "Loan Overview",
    showInNav: true,
  },
  beneficiaryCheck: {
    title: "",
    showInNav: false,
  },
  agentInfo: {
    title: "Agent Info",
    showInNav: true,
    navTitle: "Agent Info",
  },
  basicCustomerInfo: {
    title: "Basic Customer Info",
    showInNav: true,
  },
  fiDetails: {
    title: "",
    showInNav: true,
    navTitle: "FI Details",
  },
  assetDetails: {
    title: "",
    showInNav: true,
    navTitle: "Asset Details",
  },
  landAndCropDetails: {
    title: "",
    showInNav: true,
    navTitle: "Land and Crop Details",
  },
  otherIncomeDetails: {
    title: "",
    showInNav: true,
    navTitle: "Other Income Details",
  },
  kyc: {
    title: "Applicant KYC Documents",
    showInNav: true,
  },
  aml: {
    title: "",
    showInNav: false,
  },
  creditBureauInfo: {
    title: "",
    showInNav: false,
  },
  kiScore: {
    title: "",
    showInNav: true,
  },
  bre: {
    title: "",
    showInNav: false,
  },
  aboutTheEntrepreneur: {
    title: "About the Entrepreneur",
    showInNav: true,
  },
  aboutTheLoan: {
    title: "About the Loan",
    showInNav: true,
  },
  familyInfo: {
    title: "Family Info",
    showInNav: true,
  },
  aboutTheBusiness: {
    title: "About the Business",
    showInNav: false,
  },
  associateEntity: {
    title: "Associate Entity",
    showInNav: false,
  },
  projectFundingDetails: {
    title: "Project Funding Details",
    showInNav: false,
  },
  financialDetails: {
    title: "Financial Details",
    showInNav: false,
  },
  familyAssets: {
    title: "Family Assets",
    showInNav: false,
  },
  propertyDetails: {
    title: "Property Details",
    showInNav: false,
  },
  existingLoans: {
    title: "Existing Loans",
    showInNav: true,
  },
  bankDetails: {
    title: "Bank Details",
    showInNav: false,
  },
  //   preSanctionDocuments: {
  //     title: "Pre-Sanction Documents",
  //     showInNav: false,
  //   },
  //   postSanctionDocuments: {
  //     title: "Post-Sanction Documents",
  //     showInNav: false,
  //   },
  //   postBookingDocuments: {
  //     title: "Post-Booking Documents",
  //     showInNav: false,
  //   },
  //   postDisbursementDocuments: {
  //     title: "Post-Disbursement Documents",
  //     showInNav: false,
  //   },
  nomineeInfo: {
    title: "Nominee Info",
    showInNav: false,
  },
  //     witnesses: {
  //         title: 'Witnesses',
  //         showInNav: false
  //     },
  // reference: {
  //     title: 'References',
  //     showInNav: false
  // },
  coApplicant: {
    title: "Co-applicant",
    showInNav: false,
  },
  guarantor: {
    title: "Guarantor",
    showInNav: false,
  },
  contactPerson: {
    title: "Contact Person",
    showInNav: false,
  },
  partnerInfo: {
    title: "Partner Info",
    showInNav: false,
  },
  groupInfo: {
    title: "Group Info",
    showInNav: false,
  },
  loanApplication: {
    title: "",
    showInNav: false,
  },
  loanAgreement: {
    title: "",
    showInNav: false,
  },
  BankStatement: {
    title: "",
    showInNav: false,
  },
  supportingDocuments: {
    title: "",
    showInNav: false,
  },
  additionalDocuments: {
    title: "",
    showInNav: false,
  },
  kcplFeeDetails: {
    title: "KCPL fee details",
    showInNav: false,
  },
  tradeReferences: {
    title: "Trade References",
    showInNav: false,
  },
  additionalData: {
    title: "Additional Data",
    showInNav: false,
  },
  dedupe: {
    title: "",
    showInNav: true,
    navTitle: "Dedupe",
  },
};

export const DocumentTypes = {
  application: "Application",
  creditBureau: "CreditBureau",
  bankStatement: "BankStatement",
  additionalDocument: "AdditionalDocument",
  supportingDocument: "SupportingDocument",
  agreement: "Agreement",
};

export const ObligatorTypes = {
  reference: "REFERENCE",
  witness: "WITNESS",
  coApplicant: "CO_APPLICANT",
  guarantor: "GUARANTOR",
};

export const ApplicationStatus = {
  incomplete: "incomplete",
  error: "error",
  complete: "complete",
  pending: "pending",
  externalpending: "externalpending",
  conditionalapprove: "conditionalapprove",
  approve: "approve",
  retry: "retry",
  reject: "reject",
  pendingagreement: "pendingagreement",
  agreementreceived: "agreementreceived",
  agreementretry: "agreementretry",
  agreement: "agreement",
  externalbooking: "externalbooking",
  pendingbooking: "pendingbooking",
  rejectedbooking: "rejectedbooking",
  rejectedexternalbooking: "rejectedexternalbooking",
  booked: "booked",
  externaldisbursal: "externaldisbursal",
  pendingdisbursal: "pendingdisbursal",
  disbursed: "disbursed",
  forceReject: "forceReject",
  cancelled: "cancelled",
  bookingRetry: "bookingretry",
  bookingReceived: "bookingreceived",
  scoredrejected: "scoredrejected",
  scoredapproved: "scoredapproved",
  REVIEW_PENDING: "REVIEW_PENDING",
  REVIEW_PENDING_REJECT: "REVIEW_PENDING_REJECT",
  REVIEW_PENDING_APPROVE: "REVIEW_PENDING_APPROVE",
  AGREEMENT_PENDING: "AGREEMENT_PENDING",
  APPROVED: "APPROVED",
  AGREEMENT_RECEIVED: "AGREEMENT_RECEIVED",
  CANCELLED: "CANCELLED",
  AGREEMENT_REWORK: "AGREEMENT_REWORK",
  COMPLETE: "COMPLETE",
  AUTHORIZE: "authorize",
};
/**
 * @description We can use this Errors object to group all error messages related to KCredit-loan-component
 */
export const Errors = {
  minJlgBreach:
    "Rejecting this customer might breach JLG minimum member criteria.",
  panNumber: "Minimum length 10",
  aadhaarNumber: "Minimum length 12",
};

export class DefaultErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

export const DEFAULT_LOAN_APPLICATION_STAGES = [
  "Loan Review",
  "Loan Booking",
  "Loan Agreement",
  "Disbursal",
];

export const LOAN_APPLICATION_STAGE_VALUE_MAP = {
  LOANREVIEW: {
    label: "Loan Review",
    property: "loanReviewCount",
    substagePropertyKey: "LOANREVIEW",
    actionAuthority: AUTHORITES.GET_LOAN_REVIEW_INFO,
  },
  LOANBOOKING: {
    label: "Loan Booking",
    property: "loanBookingCount",
    substagePropertyKey: "LOANBOOKING",
    actionAuthority: AUTHORITES.GET_LOAN_REVIEW_INFO,
  },
  LOANAGREEMENT: {
    label: "Loan Agreement",
    property: "loanAgreementsCount",
    substagePropertyKey: "LOANAGREEMENT",
    actionAuthority: AUTHORITES.GET_LOAN_REVIEW_INFO,
  },
  LOANDISBURSAL: {
    label: "Disbursal",
    property: "loanDisbursalCount",
    substagePropertyKey: "LOANDISBURSAL",
    actionAuthority: AUTHORITES.GET_LOAN_REVIEW_INFO,
  },
};
export const getLoanApplicationStageValues = (stages = []) => {
  return stages.map((stage) => LOAN_APPLICATION_STAGE_VALUE_MAP[stage]);
};

export const LOAN_REPORTS_DOWNLOAD_TYPES = [
  {
    viewValue: "Download application details (xlsx)",
    value: "LoanApplicationDetails",
    confirmationText: "Do you wish to download selected application details?",
  },
  {
    viewValue: "Download documents",
    value: "LoanDocuments",
    confirmationText: "Do you wish to download selected application documents?",
  },
  {
    viewValue: "Download all",
    value: "LoanApplicationDetailsAndLoanDocuments",
    confirmationText:
      "Do you wish to download selected application details & documents?",
  },
];
export const LOAN_APPLICATION_STATUS = [
  {
    viewValue: LOAN_APPLICATION_STAGE_VALUE_MAP.LOANREVIEW.label,
    value: "loanReview",
    appendStatusTitle: true,
    subStatus: [
      {
        viewValue: "Pending",
        value: ApplicationStatus.pending,
      },
    ],
  },
  {
    viewValue: LOAN_APPLICATION_STAGE_VALUE_MAP.LOANAGREEMENT.label,
    value: "loanAgreement",
    appendStatusTitle: true,
    subStatus: [
      {
        viewValue: "Pending",
        value: ApplicationStatus.pendingagreement,
      },
      {
        viewValue: "Received",
        value: ApplicationStatus.agreementreceived,
      },
    ],
  },
  {
    viewValue: LOAN_APPLICATION_STAGE_VALUE_MAP.LOANBOOKING.label,
    value: "loanBooking",
    appendStatusTitle: true,
    subStatus: [
      {
        viewValue: "Approve",
        value: ApplicationStatus.approve,
      },
      {
        viewValue: "Pending",
        value: ApplicationStatus.pendingbooking,
      },
      {
        viewValue: "Booked",
        value: ApplicationStatus.booked,
      },
    ],
  },
  {
    viewValue: LOAN_APPLICATION_STAGE_VALUE_MAP.LOANDISBURSAL.label,
    value: "loanDisbursal",
    appendStatusTitle: true,
    subStatus: [
      {
        viewValue: "Pending",
        value: ApplicationStatus.pendingdisbursal,
      },
    ],
  },
];

export const REPORTS_PURPOSE_VALUES = [
  { viewValue: "Internal", value: "internal" },
  { viewValue: "External", value: "external" },
];
export interface MatSelectOption {
  isDataDump?: boolean;
  isDefault?: boolean;
  viewValue: string;
  value: any;
  reportTableValue?: string;
  id?: number;
}

export const REPORT_TYPE_JOB_NAME_MAP = {
  Approval: "GenerateApprovalReport",
  Disbursal: "GenerateDisbursementReport",
  Disbursement: "GenerateDisbursementReport",
  CMS: "GenerateCMSReport",
  "Group Details": "GenerateGroupDetails",
  Booking: "GenerateBookedReport",
  "Penny Drop MIS": "PennyDropReport",
};

export const ACCOUNT_TEMPORARILY_LOCKED = {
  DCB: 'Your account is locked. Please contact the UAM team for assistance.',
  DEFAULT:
    "Your account has been temporarily locked due to multiple instances of using invalid credentials. Please reset your password via email to regain access.",
};
