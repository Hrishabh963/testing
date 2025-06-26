export const LOAN_REVIEW = "LOAN_REVIEW";
export const LOAN_DISBURSEMENT = "LOAN_DISBURSEMENT";
export const LOAN_AGREEMENT = "LOAN_AGREEMENT";
export const DEFAULT_UPLOAD_REPORT_TITLE = "Upload Decisioning Report";
export const UPLOAD_DISBURSEMENT_REPORT = "Upload Disbursement Report";
export const UPLOAD_REVIEW_REPORT = "Upload Review Decisioning Report";
export const UPLOAD_REPAYMENT_SCHEDULE = "Upload Repayment Schedule";
export const UPLOAD_REPAYMENT_DUE_SCHEDULE = "Upload Repayment Due Schedule";
export const UPLOAD_AGREEMENT_REPORT = "Upload Agreement Decisioning Report";
export const LOAN_BOOKING = "LOAN_BOOKING";
export const LOAN_BOOKING_DECISIONING_REPORT_TITLE =
  "Loan Booking Decisioning Report";

export const LOAN_REPORTS_UPLOAD_TYPES = [
  {
    viewValue: "Loan review decisioning report",
    value: LOAN_REVIEW,
    dialogTitle: UPLOAD_REVIEW_REPORT,
  },
  {
    viewValue: "Loan agreement decisioning report",
    value: LOAN_AGREEMENT,
    dialogTitle: UPLOAD_AGREEMENT_REPORT,
  },
  {
    viewValue: "Disbursement report",
    value: LOAN_DISBURSEMENT,
    dialogTitle: UPLOAD_DISBURSEMENT_REPORT,
  },
  {
    viewValue: "Loan booking decisioning report",
    value: LOAN_BOOKING,
    dialogTitle: LOAN_BOOKING_DECISIONING_REPORT_TITLE,
  },
];

export const REPAYMENT_SCHEDULE = {
  viewValue: "Repayment Schedule",
  value: "REPAYMENT_SCHEDULE",
  dialogTitle: UPLOAD_REPAYMENT_SCHEDULE,
};

export const REPAYMENT_DUE_SCHEDULE = {
  viewValue: "Repayment Due Schedule",
  value: "REPAYMENT_DUE_SCHEDULE",
  dialogTitle: UPLOAD_REPAYMENT_DUE_SCHEDULE,
};
export const LOAN_CKYC_REPORTS_UPLOAD_TYPES = [
  {
    viewValue: "CKYC periodic result file",
    value: "CKYC_PERIODIC_FILE",
    dialogTitle: "Upload Periodic file Report",
    reportTableValue: "CKYC periodic result file",
    reportTableKey: "CKYC_PERIODIC_FILE_UPLOAD",
  },
  {
    viewValue: "CKYC stage 1 file",
    value: "CKYC_PHASE1_FILE",
    dialogTitle: "Upload Stage 1 file Report",
    reportTableValue: "CKYC stage 1 file",
    reportTableKey: "CKYC_STAGE1_FILE_UPLOAD",
  },
];

export const UPLOAD_LOAN_STAGE = {
  LOAN_REVIEW,
  LOAN_DISBURSEMENT,
  LOAN_AGREEMENT,
  LOAN_BOOKING,
};
export const UPLOAD_REPORTS_STATUS_MAP = {
  READY: {
    value: "Ready",
    class: "success",
    statusMessage: "All rows are successfully processed",
  },
  IN_PROGRESS: {
    value: "In Progress",
    class: "warning",
    statusMessage:
      "File upload is in progress. Do check after some-time to download result file.",
  },
  FAILED: {
    value: "Failed",
    class: "error",
    statusMessage:
      "File upload has failed. Do check file format and column names, and then try again",
  },
};

export const LOAN_STAGE_UPLOAD_VALUE_MAP = {
  LOANREVIEW: LOAN_REVIEW,
  LOANAGREEMENT: LOAN_AGREEMENT,
  LOANDISBURSAL: LOAN_DISBURSEMENT,
  LOANBOOKING: LOAN_BOOKING,
};
