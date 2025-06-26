export interface Food {
  value: string;
  viewValue: string;
}
export const MANDATE_STATUS_MAP = {
  ACTIVE: { label: "Active", cssClass: "status-success" },
  CLOSED: { label: "Closed", cssClass: "status-error" },
  SUCCESS: { label: "Success", cssClass: "status-success" },
  FAILED: { label: "Failed", cssClass: "status-error" },
};
export const DURATION = [
  { value: "last30Days", viewValue: "Last 30 days" },
  { value: "last3Months", viewValue: "Last 3 months" },
  { value: "last6Months", viewValue: "Last 6 months" },
  { value: "lastYear", viewValue: "Last year" },
  { value: "dateRange", viewValue: "Date range" },
];

export const SEARCH_ENTITY_MAP = {
  NAME: "Name",
  MOBILE_NUMBER: "Mobile Number",
  MANDATE_ID: "Mandate ID",
  LOAN_ID: "Loan ID",
};
export interface UserData {
  customerName: string;
  mobileNumber: string;
  startDate: string;
  endDate: string;
  loanId: string;
  emiAmount: string;
  frequency: string;
  status: string;
  createdDate: Date;
}

export interface PaymentMandateData {
  customerName: string;
  startDate: string;
  endDate: string;
  loanId: string;
  amount: string;
  frequency: string;
  status: string;
  customerId: string;
  mandateReferenceId: string;
  emisCollected: string;
  carryForwardLimit: string;
  reason: string;
  retryAfter: string;
}
export const MOCK_DATA = [
  {
    noOfRetries: "2",
    emiCollected: "4/2",
    customerName: "Rama",
    customerId: "242",
    loanId: "2",
    mandateReferenceId: "154",
    startDate: "2018-03-16",
    endDate: "2023-12-12",
    amount: "50000.0",
    frequency: "MONTHLY",
    status: "ACTIVE",
    mobileNo: "8210658347",
  },
  {
    noOfRetries: "2",
    emiCollected: "4/2",
    customerName: "Geeta Rani",
    customerId: "242",
    loanId: "2",
    mandateReferenceId: "156",
    startDate: "2018-03-16",
    endDate: "2023-12-12",
    amount: "50000.0",
    frequency: "MONTHLY",
    status: "ACTIVE",
    mobileNo: "8210658347",
  },
];

export const STATUS_VIEW_MAPPER = {
  READY: "Ready",
  IN_PROGRESS: "In Progress",
  FAILED: "Failed",
  SUCCESS: "Success",
  FAIL: "Failed",
};
