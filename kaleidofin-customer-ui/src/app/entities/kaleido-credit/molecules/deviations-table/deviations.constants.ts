import { DocumentDTO } from "../../shared/file-upload/file.constants";

export const DEVIATION_TABLE_DATA: any = [
  {
    label: "",
    type: "checkbox",
  },
  {
    label: "Rule Description",
    type: "text",
    propertyKey: "ruleDescription",
  },
  {
    label: "Variable Name",
    type: "var",
    propertykey: "deviationTypeAndValue",
  },
  {
    label: "Variable Actual Value",
    type: "default",
    propertyKey: "value",
  },
  {
    label: "Deviation Approver",
    type: "default",
    propertyKey: "value",
  },
  {
    label: "Approve Deviation",
    type: "approve",
    propertyKey: "approveDeviations",
  },
  {
    label: "Remarks",
    type: "default",
  },
  {
    label: "",
    type: "default",
  }
];

export interface DeviationTypeAndValue {
  name: string;
  value: string;
  calculatedVariablesList?: DeviationTypeAndValue[]
}

export interface ApproveDeviation {
  deviationApprover?: string | null;
  approveDeviation?: string;
  remarks?: string;
  enableDeviationApproval?: boolean;
  deviationId?: number;
  deviationFilesDto?: Array<DocumentDTO>; 
  selectedDocuments?: Array<File>,
  hasHigherAuthority?: boolean,
  approverComment?: string
}

export interface DeviationDTO {
  ruleDescription?: string;
  featureDescription?: string;
  featureDescriptionList?: DeviationTypeAndValue[];
  approveDeviations?: ApproveDeviation[];
  approvingAuthorities?: string[];
  documentsAuthorities?: string[];
}
