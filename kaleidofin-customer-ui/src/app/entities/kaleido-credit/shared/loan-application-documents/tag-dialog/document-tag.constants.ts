export const APPLICANT_TAG = { viewValue: "Applicant", value: "APPLICANT" };
export const CO_APPLICANT_TAG = {
  viewValue: "Co-Applicant",
  value: "CO_APPLICANT",
};
export const GUARANTOR_TAG = {
  viewValue: "Guarantor",
  value: "GUARANTOR",
}

export const NOMINEE_TAG = {
  viewValue: "Nominee",
  value: "NOMINEE"
}

export const POI_TAG = { value: "POI", viewValue: "KYC POI" };
export const POA_TAG = { value: "POA", viewValue: "KYC POA" };
export const LOAN_APPLICATION_TAG = {
  value: "LOAN_APPLICATION",
  viewValue: "Loan Documents",
};

export const TAG_DATA = {
  documentCategoryList: [POI_TAG, POA_TAG, LOAN_APPLICATION_TAG],
  documentTypeList: {
    LOAN_APPLICATION: ["SupportingDocument", "Aggreement"],
    POI: ["Driver's License", "Voter Id", "Aadhar Card", "Pan Card"],
    POA: ["Aadhar Card", "Pan Card"],
  },
};
export const DEFAULT_SUCCESS_TAG_TEXT = "Document successfully tagged";
export const DEFAULT_ERROR_TAG_TEXT =
  "Tagging failed due to some technical error";
