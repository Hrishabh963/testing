
export interface LoanApplicationDocumentDTO {
    id?: number;
    version?: number;
    documentName?: string;
    documentType?: string;
    documentCategory?: string;
    loanApplicationId?: number;
    documentFileId?: number;
    reviewStatus?: string;
  }
  
  export interface CoapplicantLoanApplicationDocumentDTO {
    id?: number;
    version?: number;
    documentName?: string;
    documentType?: string;
    documentCategory?: string | null;
    loanDocumentStage?: string | null;
    documentFileId?: number;
    loanApplicationId?: number;
    coapplicantId?: number | null;
    reviewStatus?: string;
    reviewRemarks?: string | null;
    entityId?: number;
    entityType?: string;
  }
  


  export interface LoanApplicationDocumentDTOList {
    loanApplicationDocumentDTOList?: LoanApplicationDocumentDTO[];
    coapplicantLoanApplicationDocumentDTOList?: CoapplicantLoanApplicationDocumentDTO[];
  }
  