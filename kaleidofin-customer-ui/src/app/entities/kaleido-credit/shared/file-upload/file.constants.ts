export const ACCEPTED_FILE_TYPES = ["pdf", "doc", "docx", "eml"];
export const FILE_UPLOAD_SIZE_LIMIT = 100;
export const FILE_UPLOAD_MAX_SIZE = FILE_UPLOAD_SIZE_LIMIT * 1024 * 1024; // 10MB
export const FILE_UPLOAD_LIMIT = 0;
export const ACCEPTED_FILE_TYPES_FOR_UPLOAD = ["xlsx", "xls", "csv", "eml"];
export const ACCEPTED_FILE_TYPES_FOR_KISCORE_UPLOAD = [
  "xlsx",
  "xls",
  "csv",
  "zip",
  "json",
  "xml",
];
export const FILE_TYPE_ERROR_MESSAGE_FOR_UPLOAD =
  "File should be in one of the following formats: ";
export const FILE_SIZE_ERROR_MESSAGE_FOR_UPLOAD =
  "File size should be less than 100 MB";
export const FILE_UPLOAD_SUCCESS_TEXT =
  "Documents Uploaded Successfully.\nPlease Reload the Loan Application to verify Updated Status";
export const FILE_LIMIT_ERROR_MESSAGE_FOR_UPLOAD =
  "Maximum 5 files are allowed size should be within 10MB ";
export const FILE_UPLOAD_INFO_TEXT =
  "Maximum 10 files are allowed size should be within 5MB ";
export const FILE_UPLOAD_REPORT_INFO_TEXT = "File size should be within 10 MB ";
// thumbnail-icons.ts
export const THUMBNAIL_ICONS: { [key: string]: string } = {
  pdf: "assets/images/common/pdf-icon.svg",
  xls: "assets/images/common/xls-icon.svg",
  csv: "assets/images/common/csv-file-icon.svg",
  xlsx: "assets/images/common/xls-icon.svg",
  doc: "assets/images/common/document-icon.svg",
  xml: "assets/images/common/xml-file-icon.svg",
  docx: "assets/images/common/document-icon.svg",
  json: "assets/images/common/json-file-icon.svg",
  eml: "assets/images/common/mail-icon.svg",
  zip: "assets/images/common/zip-file.svg",
};

export const getFileUploadLimitMessage = (limit: number = 10) => {
  return `Maximum ${limit} files are allowed, Size should be within ${FILE_UPLOAD_SIZE_LIMIT}MB `;
};

export interface DocumentDTO {
  id: number;
  version: number;
  documentName: string;
  documentType: string;
  documentCategory: string;
  loanDocumentStage: string;
  loanApplicationId: number;
  documentFileId: number;
  reviewStatus: string;
  reviewRemarks: string;
}
