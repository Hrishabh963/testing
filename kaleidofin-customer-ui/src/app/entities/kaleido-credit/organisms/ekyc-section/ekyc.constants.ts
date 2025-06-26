interface KycData {
  type: string;
  value: string | TableValue | number | null;
  editable: boolean;
}

interface TableValue {
  govData: string | number | null;
  bcData: string | number | null;
  isMatched: boolean | null;
}

export interface KycObject {
  dateTime?: KycData;
  pincode?: KycData;
  country?: KycData;
  postoffice?: KycData;
  address?: KycData;
  gender?: KycData;
  locality?: KycData;
  message?: KycData;
  referenceNumber?: KycData;
  dob?: KycData;
  street?: KycData;
  district?: KycData;
  name?: KycData;
  state?: KycData;
  landmark?: KycData;
  village?: KycData;
  referenceKey?: KycData;
  fileId?: KycData;
}

export interface KYCResponseObject {
    title?: string | null,
    formPost?: string | null,
    fields?: KycObject,
    subSections?: Array<any> | null
}