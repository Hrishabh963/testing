export type DEDUPE_TYPE_ENUM = "FULL" | "HARD" | "SOFT" | "NO_MATCH";
export class DedupeData {
  public id;
  public title;
  public type;
  public customerInformation;
  constructor(
    id: number,
    title: string,
    type: string,
    customerInformation: Object
  ) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.customerInformation = customerInformation;
  }
}

export interface DedupeResponseDTO {
  id: number;
  partnerId: number;
  loanId: number;
  productCode: string;
  loanNumber: number | string;
  createdDate: string;
  dedupeReferenceId: number;
  dedupeMatchReferenceId: number;
  name: string;
  dedupeType: DEDUPE_TYPE_ENUM;
  dedupeParameter: string;
  dedupeReferenceType: string;
  selected?: boolean;
}

export interface DedupeResponseWrapper {
  dedupeResponseDTOList?: DedupeResponseDTO[];
  matchingParameterList?: string[];
  dedupeType?: DEDUPE_TYPE_ENUM;
  rejectEnable?: boolean;
}

export const DEFAULT_DEDUPE_ERROR_TEXT =
  "This customer can not be marked as new customer since mobile number is duplicate.";
export const DEFAULT_DEDUPE_NEW_CUSTOMER_TEXT =
  "Marked as new customer  with customer ID ";
export const DEFAULT_DEDUPE_OLD_CUSTOMER_TEXT =
  "Application is marked with existing customer ID ";

export const matchingParamsMapper: Record<string, string> = {
  LastName: "Last Name",
  FirstName: "First Name",
  MiddleName: "Middle Name",
  DOB: "Date of Birth",
  Address: "Address",
  PostalCode: "Postal Code",
  City: "City",
  State: "State",
  MotherMaidenName: "Mother's Maiden Name",
  Email: "Email",
  Phone: "Phone Number",
  Aadhaar: "Aadhaar Number",
  Pan: "PAN Number",
  Voterid: "Voter ID",
  DrivingLicense: "Driving License Number",
  Dl: "Driving License Number",
  BankAccountNumber: "Bank Account Number",
};
