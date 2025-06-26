//Kaleido-Credit

import {
  KALEIDO_SERVER_API_URL,
  KREDILINE_SERVER_URL,
  OAUTH_API_URL,
  getBankingServerHost,
} from "src/app/app.constants";
export const ACCOUNT_API = `${KALEIDO_SERVER_API_URL}api/anonymous-v2/account`;
export const SAMPLE_NACH_FORM_TEMPLATE = `${KALEIDO_SERVER_API_URL}api/anonymous/static/stream/SAMPLE_NACH_FORM_TEMPLATE`;
// Customer Service
export const BACKOFFICE_CUSTOMER_URL = `${KREDILINE_SERVER_URL}api/backoffice/customer`;
export const REJECT_CUSTOMER_URL = `${KALEIDO_SERVER_API_URL}api/backoffice/customer/rejectCustomer/`;
export const BACKOFFICE_REF_URL = `api/backoffice/_refs/reference-codes`;
export const BACKOFFICE_ENROLLMENT_TEMPLATE_URL = `api/backoffice/enrollmentTemplate`;

export const CUSTOMER_FILE_MAPPER_URL = `${BACKOFFICE_CUSTOMER_URL}/customerFileMapper`;
export const CB_PENDING_CUSTOMER_SEARCH_URL = `${BACKOFFICE_CUSTOMER_URL}/searchCBPendingCustomers`;
export const PAGINATED_SEARCH_URL = `${BACKOFFICE_CUSTOMER_URL}/searchPaginated`;
export const ALL_REFS_CODES_URL = `${BACKOFFICE_REF_URL}/all/codes`;
export const COMPLETE_REFS_CODES_URL = `${BACKOFFICE_REF_URL}/complete/codes`;
export const HIGH_MARKET_REQUEST_URL = `api/highMarkRequest`;
export const GET_ANSWERED_QUESTIONAIRE_URL = `${BACKOFFICE_ENROLLMENT_TEMPLATE_URL}/getAnsweredQuestionnaire`;
/* Ki-Credit */
export const PARTNER_WISE_LOAN_COUNT = `${KREDILINE_SERVER_URL}api/backoffice/loans/applications/partner/loancount`;
export const FETCH_LOAN_STATES_BY_LENDER = "api/internal/lender/config";
export const GET_ALL_LOAN_PRODUCT_CODES =
  "api/backoffice/loans/applications/getAllLoanProductCodes";
export const VALIDATE_PRODUCT_CODES =
  "api/backoffice/loans/applications/validateLoanProductChanges";
export const GET_FILE_DATA = `api/backoffice/file/streamv2`;
export const DOWNLOAD_LOAN_REPORTS = `api/backoffice/download`;
export const UPLOAD_DECISIONING_REPORTS = `api/backoffice/report/upload`;
export const FETCH_UPLOAD_DECISIONING_REPORTS = `api/backoffice/reports`;
/* Credit-Bureau */
export const GET_EXTERNAL_CB_REPORT = `api/backoffice/loanReview/externalCbReportData`;
export const GET_BRE_DATA = `api/backoffice/bre`;
/* Document Tags */
export const GET_DOCUMENT_TAG_DATA = `api/backoffice/loans/applications/document/tagging/meta-data`;
export const TAG_DOCUMENTS = `/api/backoffice/loans/applications/document/tag`;
export const TAG_DOCUMENTS_IDS = `api/backoffice/loans/applications/kycIds`;
export const AADHAAR_VERIFICATION = `${KREDILINE_SERVER_URL}api/backoffice/kyc/verification/aadhaar`;
export const PAN_VERIFICATION = `${KREDILINE_SERVER_URL}api/backoffice/kyc/verification/pan`;
export const GET_KI_SCORE_REPORT = `api/backoffice/kiscore/report`;
/* Dedupe */
export const GET_LOANS_BY_CUSTOMER = `api/lender/ui/dedupe/loan`;
export const GET_DEDUPE_LOANS = `api/lender/ui/dedupe/response`;
export const DEDUPE_MARK_CUSTOMER = `api/lender/ui/dedupe/group`;
export const REJECT_DEDUPE = `${KREDILINE_SERVER_URL}api/lender/ui/dedupe/reject`

/* UI-Configuartions. To update configurations: PUT: api/config/lender/ui/structure */
export const GET_UI_CONFIG = `${KREDILINE_SERVER_URL}api/anonymous/lender/ui/configuration`;
export const GET_UI_CONFIG_SECTION = `${KREDILINE_SERVER_URL}api/anonymous/lender/ui/configuration/section`;

/* Info section All-In-One section endpont*/
export const GET_UI_ELEMENTS = `api/lender/ui/loan-review/info-section`;
/* Reports */
export const REPORTS = `${KREDILINE_SERVER_URL}api/lender/ui/report`;
export const GENERATE_REPORTS = `${REPORTS}/generate`;
export const UPLOAD_REPORTS = `${REPORTS}/upload`;
export const UPLOAD_KISCORE_REPORTS = `${KREDILINE_SERVER_URL}api/lender/kiscore/upload`;
/* Upload */
export const CREATE_PRE_SIGNED_S3_URL = `api/lender/pre-signed-urls`;
export const CREATE_BULK_PRE_SIGNED_S3_URL = `api/lender/pre-signed-urls/bulk`;
/* Task Details */
export const REPLAY_REPORT_PROCESSING = `${KREDILINE_SERVER_URL}api/lender/ui/task-detail/retry`;
/*ATD Sheets */
export const GET_LENDER_ATD_REPORTS = `api/lender/ui/atd-sheet`;
/* CAMS */
export const GET_LENDER_CAMS_REPORT = `api/lender/ui/cam-sheet`;
/* KYC Verification */
export const GET_KYC_VERIFICATION_STATUS = `${KREDILINE_SERVER_URL}api/backoffice/kyc/results`;
export const VERIFY_KYC = `${KREDILINE_SERVER_URL}api/backoffice/kyc/verify`;
export const KYC_CONFIG = `${KREDILINE_SERVER_URL}api/backoffice/kyc/config`;
/* Co-Applicant */
export const UPDATE_CO_APPLICANT_DETAILS = `api/backoffice/loanObligator`;
/* Activity Section */
export const GET_ALL_ACTIVITY = `api/lender/activity-section`;
export const POST_COMMENT = `api/lender/activity-section/comments`;
/* Beneficiary Check API */
export const RETRY_BENEFICIARY_CHECK = `${KREDILINE_SERVER_URL}api/lender/ui/bank-detail/retry`;

/* AML Verification */
export const GET_AML_DETAILS = `api/backoffice/aml`;
export const VERIFY_AML = `api/backoffice/aml/verify`;
export const INITIATE_AML = `api/backoffice/aml/initiate`;

/* Loan Application Search-Filters */
export const LOAN_APP_SEARCH_FILTERS = `${KREDILINE_SERVER_URL}api/lender/ui/search-filter`;
/* Loan Count */
export const LOAN_APPLICATION_COUNT = `${KREDILINE_SERVER_URL}api/backoffice/loans/applications/metrics/count`;
export const LOAN_APPLICATIONS = `${KREDILINE_SERVER_URL}api/backoffice/loans/applications`;

/* Update Editable Fields */
export const UPDATE_EDITABLE_FIELDS = `${KREDILINE_SERVER_URL}api/lender/ui/`;
/* Assign to User */
export const ASSIGN_TO_USER = `${KREDILINE_SERVER_URL}api/lender/ui/loan-overview/user-assign`;
export const LOGOUT = `${OAUTH_API_URL}api/logout`;

/*Check For approval button*/
export const GET_APPROVAL_BUTTON_CHECK = `${KREDILINE_SERVER_URL}api/lender/ui/review-section`;
/* Fraud Check */
export const INITIATE_FRAUD_CHECK = `api/backoffice/fraud-check`;
export const VERIFY_FRAUD_CHECK = `api/backoffice/fraud-check/verify`;

/* Enable Approve Button */
export const ENABLE_APPROVE_BUTTON = `${KREDILINE_SERVER_URL}api/lender/ui/review-section/loan-approval`;

/* KCredit group apis */
export const BULK_REJECT_URL =
  KREDILINE_SERVER_URL + "api/backoffice/loanGroup/bulkRejectOrRetry";
export const BULK_REVIEW = "api/backoffice/loanReview/bulkReview";
/* Retry Loan Booking */
export const RETRY_LOAN_BOOKING = `${KREDILINE_SERVER_URL}api/backoffice/loans/applications/retry-booking`;
/* Deviations */
export const POST_DEVIATION_REMARKS = `${KREDILINE_SERVER_URL}api/lender/ui/bre-section/deviations`;
export const SAVE_DEVIATION_COMMENT = `${KREDILINE_SERVER_URL}api/lender/ui/bre-section/comment`

/* Acceptable EMI Amounts */
export const GET_EMI_AMOUNTS = `${KREDILINE_SERVER_URL}api/lender/additional-loan-overview/acceptable-emi-amounts/`;
/* Payment Mandate */
export const GET_MANDATE_TRANSACTIONS = `${getBankingServerHost()}ops/mandate/transactions`;
export const GET_PARTNER_PAYMENT_MANDATES = `${getBankingServerHost()}ops/mandate`;
export const GENERATE_MANDATE_REPORTS = `${KALEIDO_SERVER_API_URL}api/partnerBackOffice/mandate/report`;
export const GET_ALL_PARTNER_REPORTS = `${KALEIDO_SERVER_API_URL}api/partnerBackOffice/report`;
export const CLOSE_PAYMENT_MANDATE = `${KALEIDO_SERVER_API_URL}api/partnerBackOffice/mandate/close`;
export const SEARCH_PAYMENT_MANDATES = `${getBankingServerHost()}ops/mandate/search`;
// Save File Upload
export const UPDATE_FILES = `api/lender/pre-signed-urls/save-doc-details`;
// Get Loan Stage Check
export const LOAN_STAGE_CHECK = `${KREDILINE_SERVER_URL}api/lender/loan-stage-check`;
// Generate Loan Reports -
export const GENERATE_LOAN_REPORTS = `${KALEIDO_SERVER_API_URL}api/backoffice/generateLoanReport`;
export const GET_KCREIDT_LOAN_REPORTS = `${KALEIDO_SERVER_API_URL}api/backoffice/upload/paginatedKCreditReports`;
export const RETRY_KI_SCORE = `${KREDILINE_SERVER_URL}api/backoffice/kiscore/retry`;
export const FETCH_KISCORE_REPORTS = `${KREDILINE_SERVER_URL}api/lender/kiscore/jobDetail`;
export const FETCH_CUSTOMER_KISCORE_REPORTS = `${KREDILINE_SERVER_URL}api/lender/kiscore/jobs`;
//  KCPL - Business Details
export const BUSINESS_DETAILS = `${KREDILINE_SERVER_URL}api/backoffice/business-details`;

/* Recalculate BRE */
export const CHECK_RECALCULATION_STATUS = `${KREDILINE_SERVER_URL}api/lender/ui/bre-section/status`;
export const RECALCULATE_BRE_RULES = `${KREDILINE_SERVER_URL}api/lender/ui/bre-section`;

//Get Dynamic Dropdown values
export const GET_DROPDOWN_VALUES = `${KREDILINE_SERVER_URL}api/lender/ui/loan-review/dropdown-data`;

// Updating KYC Results
export const UPDATE_CUSTOMER_ADDRESS = `${KREDILINE_SERVER_URL}api/backoffice/kycDetails`;

// Loan Review Info APIs
export const GET_LOAN_DOCUMENTS = `${KREDILINE_SERVER_URL}api/backoffice/loans/applications/loanApplicationDocuments`;
export const GET_KYC_DOCUMENTS = `${KREDILINE_SERVER_URL}api/backoffice/loans/applications/loanApplicationKycDocuments`;
export const GET_LOAN_INFO = `${KREDILINE_SERVER_URL}api/backoffice/loans/applications/loanApplicationInfo`;

// Recalculate Demand Schedule
export const RECALCULATE_DEMAND_SCHEDULE = `${KREDILINE_SERVER_URL}api/lender/ui/demand-schedule/recalculate`;
//Reset Password
export const RESET_PASSWORD = `${KALEIDO_SERVER_API_URL}api/anonymous-v2/account/forgot-password`;
export const CHANGE_PASSWORD_URL = `${KALEIDO_SERVER_API_URL}api/anonymous-v2/account/change-password`;
/**
 * Business Invoice Discounting
 */
export const FETCH_ALL_BUSINESS = `${KREDILINE_SERVER_URL}api/backoffice/business`;
export const FETCH_BUSINESS_REVIEW_INFORMATION = `${KREDILINE_SERVER_URL}api/backoffice/business/getBusinessInfo`;
export const UPDATE_BUSINESS_DOC_STATUS = `${KREDILINE_SERVER_URL}api/backoffice/saveDocumentReview`;
export const APPROVE_OR_REJECT_BUSINESS = `${KREDILINE_SERVER_URL}api/backoffice/business/review`;
export const SECTION_LEVEL_REJECT = `${KREDILINE_SERVER_URL}api/backoffice/evaluate/section`;
export const SAVE_FACTORING_LIMIT = `${KREDILINE_SERVER_URL}api/backoffice/factoringlimit`;
export const UPDATE_BUSINESS_DOCUMENT_DETAILS = `${KREDILINE_SERVER_URL}api/backoffice/business/documents/data`;
export const FETCH_BUSINESS_COUNT = `${KREDILINE_SERVER_URL}api/backoffice/business/overview`;


export const UPDATE_LOAN_DETAILS = `${KREDILINE_SERVER_URL}api/backoffice/loans/applications`


//authorize Loans
export const AUTHORIZE_LOANS = `${KREDILINE_SERVER_URL}api/backoffice/authorize`;

// UAM APIs
export const FETCH_UAM_USER = `${KREDILINE_SERVER_URL}api/backoffice/user/externalUser`;
export const CREATE_UPDATE_USER = `${KREDILINE_SERVER_URL}api/backoffice/user`;
export const FETCH_ALL_USERS = `${KREDILINE_SERVER_URL}api/backoffice/user`;
export const CHANGE_USER_STATUS = `${KREDILINE_SERVER_URL}api/backoffice/user/statusChange`;
export const GET_USER_COUNT = `${KALEIDO_SERVER_API_URL}api/backoffice/users/roleWiseCount`;

// Remove documents
export const DELETE_DOCUMENTS = `${KREDILINE_SERVER_URL}/api/backoffice/loans/applications/loanDocuments`;