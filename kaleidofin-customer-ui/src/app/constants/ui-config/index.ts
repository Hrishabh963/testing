export type MENU_ENUM = "DISABLE_PROFILE_INFO" | "DISABLE_CHANGE_PASSWORD" | "DISABLE_LOGOUT" | "DISABLE_HELP";
export interface UiField {
  type?: string;
  value?: any;
  editable?: boolean;
}

export interface UiFields {
  [key: string]: UiField;
}

export interface UiFieldsDto {
  title?: string;
  formPost?: string;
  subSections?: Array<UiFieldsDto>;
  fields?: UiFields;
}

export const UI_COMPONENTS = {
  LOAN_REPORTS: "LOAN_REPORTS",
  NAV_ROUTES: "NAV_ROUTES",
  UPLOAD_REPORTS: "UPLOAD_REPORTS",
  DOCUMENT_TAGS: "DOCUMENT_TAGS",
  LOAN_REVIEW: "LOAN_REVIEW",
  KYC_VERIFICATION_RESULTS: "KYC_VERIFICATION_RESULTS",
  LOAN_ENTRY: "LOAN_ENTRY",
  LOAN_APPLICATIONS_REVIEW: "LOAN_APPLICATIONS_REVIEW",
  PLATFORM: "PLATFORM",
  USER_INACTIVITY: "USER_INACTIVITY",
  LOAN_OVERVIEW_REVIEW: "LOAN_OVERVIEW_REVIEW",
  DEVIATIONS: "DEVIATIONS",
  CKYC_REPORTS: "CKYC_REPORTS",
  CKYC_UPLOADS: "CKYC_UPLOADS",
  USER_ACCESS_MANAGEMENT: "USER_ACCESS_MANAGEMENT",
};

export const SECTION_INFORMATION = {
  OTHER_INCOME_DETAILS: {
    apiKey: "other-income",
    authority: "EDIT_OTHER_INCOME_DETAILS",
    sectionKey: "OTHER_INCOME_DETAILS",
    title: "Income Details",
  },
  LOAN_OVERVIEW: { apiKey: "loan-overview", authority: "EDIT_LOAN_OVERVIEW" },
  LAND_AND_CROP_DETAILS: {
    apiKey: "land-and-crop",
    authority: "EDIT_LAND_AND_CROP_DETAILS",
    sectionKey: "LAND_AND_CROP_DETAILS",
    title: "Land and Crop Details",
  },
  BRE_WITH_ELIGIBILITY: {
    apiKey: "bre-section/eligibility-norms",
    authority: "EDIT_BRE_ELIGIBILITY_NORMS",
    title: "BRE",
    sectionKey: "BRE_WITH_ELIGIBILITY",
  },
  BORROWER_DETAILS: {
    apiKey: "borrower-details-section",
    authority: "EDIT_BORROWER_DETAILS",
    title: "Borrower Details",
  },
  AGENT_INFO: {
    apiKey: "agent-section",
    authority: "EDIT_AGENT_DETAILS",
    title: "RM Info",
  },
  DEMAND_SCHEDULE: {
    apiKey: "demand-schedule",
    authority: "EDIT_DEMAND_SCHEDULE",
    sectionKey: "DEMAND_SCHEDULE",
    title: "Customer Demand Schedule",
  },
  BUSINESS_DATA_SHEET: {
    apiKey: "business-data-sheet",
    authority: "EDIT_BUSINESS_DATA_SHEET",
    title: "Business Data Sheet",
    scrollKey: "businessDataSheet"
  },
  COLLATERAL_MAINTENANCE_VEHICLE: {
    apiKey: "collateral-maintenance-vehicle",
    sectionKey: "COLLATERAL_MAINTENANCE_VEHICLE",
    authority: "EDIT_COLLATERAL_MAINTENANCE_VEHICLE",
  },
  LOAN_DETAILS: {
    apiKey: "loan-details",
    authority: "EDIT_LOAN_DETAILS",
    title: "Loan Details",
  },
  ASSET_DETAILS: {
    apiKey: "asset-section",
    authority: "EDIT_ASSET_DETAILS",
    title: "Asset Details",
  },
  BANK_DETAILS: {
    apiKey: "bank-detail",
    authority: "EDIT_BANK_DETAILS",
    title: "Beneficiary check details",
    sectionKey: "BENEFICIARY_CHECK_DETAILS",
  },
  FI_DETAILS: {
    apiKey: "fi-details",
    authority: "EDIT_FI_DETAILS",
    title: "FI Details",
  },
  APPLICANT_SCORE_CARD: {
    apiKey: "applicant-score-card",
    sectionKey: "APPLICANT_SCORE_CARD",
    title: "Applicant Score Card",
  },
  CREDIT_BUREAU_DATA: {
    apiKey: "credit-bureau-section",
    sectionKey: "CREDIT_BUREAU_DATA",
    authority: "EDIT_CREDIT_BUREAU",
    title: "Credit Bureau Data",
  },
  DEDUPE: {
    apiKey: "dedupe",
    sectionKey: "DEDUPE",
    title: "Dedupe",
  },
  DETAILED_DATA: {
    apiKey: "detailed-data",
    sectionKey: "DETAILED_DATA",
    authority: "EDIT_DETAILED_DATA",
  },
  OCCUPATION_DETAILS: {
    apiKey: "occupation-details",
    sectionKey: "OCCUPATION_DETAILS",
    authority: "EDIT_OCCUPATION_DETAILS",
  },
  HOUSEHOLD: {
    apiKey: "household",
    sectionKey: "HOUSEHOLD",
    authority: "EDIT_HOUSEHOLD",
  },
  NOMINEE_DETAILS: {
    apiKey: "nominee-detail",
    sectionKey: "NOMINEE_DETAILS",
    authority: "EDIT_NOMINEE_DETAIL",
  },
  FINANCIAL_LIABILITIES: {
    apiKey: "financial-liabilities",
    sectionKey: "FINANCIAL_LIABILITIES",
    authority: "EDIT_FINANCIAL_LIABILITIES",
  },
  EKYC_INFO: {
    sectionKey: "EKYC_INFO",
  },
  INSURANCE_DETAILS: {
    apiKey: "insurance",
    sectionKey: "INSURANCE_DETAILS",
    authority: "EDIT_INSURANCE_DETAILS",
  },
  EXPENSE: {
    apiKey: "expense",
    sectionKey: "EXPENSE",
    authority: "EDIT_EXPENSE"
  },
  HOUSEHOLD_INCOME_EXPENSE: {
    apiKey: "household/income",
    sectionKey: "HOUSEHOLD_INCOME_EXPENSE",
    authority: "EDIT_HOUSEHOLD_INCOME"
  },
  LOAN_OBLIGATOR_INCOME: {
    apiKey: "loan-obligator-income",
    sectionKey: "LOAN_OBLIGATOR_INCOME",
    authority: "EDIT_LOAN_OBLIGATOR_INCOME"
  },
  BUSINESS_INCOME_EXPENSE: {
    apiKey: "household/business",
    sectionKey: "BUSINESS_INCOME_EXPENSE",
    authority: "EDIT_BUSINESS_INCOME"
  },
  LOAN_OBLIGATION: {
    apiKey: "loan-obligation",
    sectionKey: "LOAN_OBLIGATION",
    authority: "EDIT_LOAN_OBLIGATION"
  },
  HOUSEHOLD_PROFILE_INCOME: {
    apiKey: "household/profile",
    sectionKey: "HOUSEHOLD_PROFILE_INCOME",
    authority: "EDIT_HOUSEHOLD_PROFILE"
  },
  LOAN_ELIGIBLITY: {
    apiKey: "loan-eligiblity",
    sectionKey: "LOAN_ELIGIBLITY",
    authority: "EDIT_LOAN_ELIGIBLITY"
  }
};
