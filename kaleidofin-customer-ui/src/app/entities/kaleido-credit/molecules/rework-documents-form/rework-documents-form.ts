import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { KcreditInterDataService } from "../../kcredit-inter-data.service";
import { KcreditLoanService } from "../../loan/kcredit-loan.service";
import { KcreditLoanDetailsModel } from "../../loan/kcredit-loanDetails.model";
import {
  APPLICANT_TAG,
  CO_APPLICANT_TAG,
  GUARANTOR_TAG,
  NOMINEE_TAG,
} from "../../shared/loan-application-documents/tag-dialog/document-tag.constants";
import { getProperty } from "src/app/utils/app.utils";
import { get } from "lodash";
import { DocumentsService } from "../../services/documents.service";
import { AssociateLenderService } from "../../services/associate-lender/associate-lender.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "rework-documents-form",
  templateUrl: "./rework-documents-form.html",
  styleUrls: ["./rework-documents-form.css"],
})
export class ReworkDocumentsFormComponent implements OnInit {
  numberOfDocs: number = 1;
  docsArray: number[] = [1];
  @Input() type: string = "rework";
  unfilledRecordExists: boolean = true;
  receivedDocuments: {
    [key: number]: {
      entityType: string;
      documentType: string;
      entityId: number;
      proofType: string;
      loanStage: string;
      reviewRemarks: string;
    };
  } = {};
  userTypeList: any[] = [];
  documentCategoryList: [] = [];
  documentTypeList: [] = [];
  loanDocumentTypes: any = { applicants: [], coApplicants: [] };
  branchId: number = null;
  partnerId: string = "";
  rework: string = "";
  docsRecorded: number = 0;
  maxDocsAllowed = 5;
  @Output() documentsSelected = new EventEmitter<any[]>();
  ngOnInit(): void {
    this.rework = this.type;
    let loanDetails: KcreditLoanDetailsModel =
      this.loanDetailService.getLoanDetails();
    this.updatePartnerAndBranchData(loanDetails);
    this.fetchLoanDocTypes(loanDetails);
    this.maxDocsAllowed =
      this.associateLenderService.maxRequestableOptionalDocs;
  }

  constructor(
    private readonly loanDetailService: KcreditLoanService,
    private readonly kcreditInterDataService: KcreditInterDataService,
    private readonly documentTagService: DocumentsService,
    private readonly associateLenderService: AssociateLenderService,
    private readonly snackBar: MatSnackBar
  ) {}

  onDocumentUpdate(data: {
    id: number;
    entityType: string;
    documentType: string;
    entityId: number;
    remarks: "";
    proofType: string;
    loanStage: string;
  }) {
    if (this.docsRecorded > this.maxDocsAllowed) {
      this.snackBar.open(
        "Maximum documents allowed are  " + this.maxDocsAllowed,
        "Error",
        {
          duration: 2000,
        }
      );
      return;
    }
    if (this.receivedDocuments[data.id] == null) {
      this.docsRecorded++;
    }
    this.receivedDocuments[data.id] = {
      entityType: data.entityType,
      documentType: data.documentType,
      entityId: data.entityId,
      loanStage: this.type === "rework" ? data?.loanStage : "POST_DISBURSEMENT",
      proofType: data.proofType,
      reviewRemarks: data.remarks,
    };
    this.userTypeList.forEach((user) => {
      if (user.value === data.entityType && user.entityId === data.entityId) {
        user.docs = user.docs.filter(
          (doc) => doc.document !== data.documentType
        );
      }
    });
    this.emitUpdate();
    this.unfilledRecordExists = false;
  }

  addDocument(): void {
    if (this.docsArray.length === this.maxDocsAllowed) {
      this.snackBar.open(
        "Maximum documents allowed are  " + this.maxDocsAllowed,
        "Error",
        {
          duration: 2000,
        }
      );
      return;
    }
    if (!this.unfilledRecordExists) {
      this.numberOfDocs++;
      this.docsArray.push(this.numberOfDocs);
      this.unfilledRecordExists = true;
    }
  }

  removeDocument(index: number): void {
    if (this.numberOfDocs === 0) {
      return;
    }
    if (this.docsArray.length === 0) {
      this.docsArray = [1];
      return;
    }
    let deletedDoc = this.receivedDocuments[index];
    delete this.receivedDocuments[index];
    this.docsArray = this.docsArray.filter((x) => x !== index);
    if (!deletedDoc) {
      this.unfilledRecordExists = false;
      this.emitUpdate();
      this.docsRecorded--;
      return;
    }
    this.userTypeList.forEach((user) => {
      if (
        user.value === deletedDoc.entityType &&
        user.entityId === deletedDoc.entityId
      ) {
        if (user.value === "APPLICANT") {
          this.loanDocumentTypes.applicants.forEach((doc) => {
            if (doc.document === deletedDoc.documentType) {
              this.insertIntoSortedArray(user.docs, doc);
            }
          });
        } else if (this.type === "rework") {
          this.loanDocumentTypes.coApplicants.forEach((doc) => {
            if (doc.document === deletedDoc.documentType) {
              this.insertIntoSortedArray(user.docs, doc);
            }
          });
        }
      }
    });
    this.emitUpdate();
    this.docsRecorded--;
  }

  updatePartnerAndBranchData(loanDetails: KcreditLoanDetailsModel = null) {
    this.branchId = get(loanDetails, "customerDTO.branchId", null);
    this.partnerId = get(loanDetails, "customerDTO.partnerId", null);
  }

  fetchLoanDocTypes(loanDetails: any ) {
    this.documentTagService
      .getLoanDocumentTags(this.partnerId, this.branchId)
      .then((response: any) => {
        if (response) {
          this.loanDocumentTypes = this.extractUniqueProofTypes(response);
          if (this.loanDocumentTypes?.applicants) {
            this.loanDocumentTypes.applicants.sort((a, b) =>
              a.document.localeCompare(b.document)
            );
          }
          if (this.loanDocumentTypes?.coApplicants) {
            this.loanDocumentTypes.coApplicants.sort((a, b) =>
              a.document.localeCompare(b.document)
            );
          }
          this.updateDocumentOwnerData(loanDetails);
        }
      })
      .catch((error) => {
        console.error("Error fetching loan document types:", error);
      });
  }

  extractDocsTypes(docs, target: any, stage: string) {
    if (!docs) return;
    docs.forEach((doc) => {
      if (!doc.entityType) {
        this.updateDocs(target.applicants, stage, doc);
      }
      if (this.type === "rework") {
        if (doc.entityType === "GUARANTOR") {
          this.updateDocs(target.guarenters, stage, doc);
        }
        if (doc.entityType === "CO_APPLICANT") {
          this.updateDocs(target.coApplicants, stage, doc);
        }
        if (doc.entityType === "NOMINEE") {
          this.updateDocs(target.nominees, stage, doc);
        }
      }
    });
  }

  updateDocs(targetArray: any, stage, doc: any) {
    let proofType = doc.proofType;
    let optionalDocs = doc.optionalDocs || [];
    const documents = [...optionalDocs, proofType].filter(
      (value, index, self) => {
        return self.indexOf(value) === index;
      }
    );
    documents.forEach((document) => {
      targetArray.push({ document, stage, proofType });
    });
    
  }

  extractUniqueProofTypes(data): any {
    const uniqueProofTypes: any = {
      applicants: [],
      coApplicants: [],
      guarenters: [],
      nominees: [],
    };
    data.loanTypes.forEach((loanType) => {
      if (
        this.loanDetailService.getLoanDetails().loanApplicationDTO.legacyLoanType ===
        loanType.loanType
      ) {
        loanType.stages.forEach((stage) => {
          this.extractDocsTypes(
            stage.applicantRequiredDocs,
            uniqueProofTypes,
            stage.loanStage
          );
          this.extractDocsTypes(
            stage.coapplicantRequiredDocs,
            uniqueProofTypes,
            stage.loanStage
          );
        });
    }});
    this.associateLenderService.documents.loanTypes.forEach((loanType) => {
      if(this.loanDetailService.getLoanDetails().loanApplicationDTO.loanType === loanType.loanType) {
        loanType.stages.forEach((stage) => {
          this.extractDocsTypes(
            stage.applicantRequiredDocs,
            uniqueProofTypes,
            stage.loanStage
          );
          this.extractDocsTypes(
            stage.coapplicantRequiredDocs,
            uniqueProofTypes,
            stage.loanStage
          );
        });
    }});
    
    uniqueProofTypes.applicants = Array.from(
      new Set(uniqueProofTypes.applicants)
    );
    uniqueProofTypes.coApplicants = Array.from(
      new Set(uniqueProofTypes.coApplicants)
    );
    return uniqueProofTypes;
  }

  updateDocumentOwnerData(loanDetails: KcreditLoanDetailsModel = null) {
    let applicantName = get(loanDetails, "customerDTO.name", "");
    this.userTypeList = [
      {
        value: APPLICANT_TAG.value,
        viewValue: `${APPLICANT_TAG.viewValue} (${applicantName})`,
        entityId: null,
        docs: this.loanDocumentTypes.applicants,
      },
    ];
    if (this.type === "rework") {
      let co_applicants =
        this.kcreditInterDataService.getCoApplicant(loanDetails);
      co_applicants = co_applicants.map((co_applicant) => ({
        value: CO_APPLICANT_TAG.value,
        viewValue: `${CO_APPLICANT_TAG.viewValue} (${co_applicant.name})`,
        entityId: co_applicant.id,
        docs: this.loanDocumentTypes.coApplicants,
      }));
      let guarantors = this.kcreditInterDataService.getGuarantor(loanDetails);
      guarantors = guarantors.map((guarantor) => ({
        value: GUARANTOR_TAG.value,
        viewValue: `${GUARANTOR_TAG.viewValue} (${guarantor.name})`,
        entityId: guarantor.id,
        docs: this.loanDocumentTypes.guarenters,
      }));
      const nomineeDetail: any = getProperty(
        loanDetails,
        "nomineeDetails",
        null
      );
      this.userTypeList = [
        ...this.userTypeList,
        ...co_applicants,
        ...guarantors,
      ];
      if (nomineeDetail) {
        const nominee = {
          value: NOMINEE_TAG.value,
          viewValue: `${NOMINEE_TAG.viewValue} (${nomineeDetail.name})`,
          entityId: nomineeDetail.id,
          docs: this.loanDocumentTypes.nominees,
        };
        this.userTypeList = [...this.userTypeList, nominee];
      }
    }
  }

  emitUpdate() {
    const documentsArray: any[] = Object.values(this.receivedDocuments);
    this.documentsSelected.emit(documentsArray);
  }

  insertIntoSortedArray(arr: any[], value: any): string[] {
    let low = 0;
    let high = arr.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (arr[mid].document.localeCompare(value.document) < 0) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    arr.splice(low, 0, value);
    return arr;
  }
}
