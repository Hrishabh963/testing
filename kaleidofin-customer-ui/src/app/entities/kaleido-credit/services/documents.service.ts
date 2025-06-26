import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { KREDILINE_SERVER_URL } from "src/app/app.constants";
import {
  GET_DOCUMENT_TAG_DATA,
  TAG_DOCUMENTS,
  TAG_DOCUMENTS_IDS,
} from "src/app/shared/constants/Api.constants";
import { getProperty } from "src/app/utils/app.utils";
import { SubscriptionReviewSupportService } from "./customer-group/subscription-review/subscription-review-support.service";
import { FileService } from "./files/file.service";
import { UiConfigService } from "./ui-config.service";
import { UI_COMPONENTS } from "src/app/constants/ui-config";
import { get, isEmpty, noop } from "lodash";
import { AssociateLenderService } from "./associate-lender/associate-lender.service";
import { KcreditLoanService } from "../loan/kcredit-loan.service";
import { PrincipalService } from "src/app/core";
import { DocumentRejectReasonComponent } from "../molecules/document-reject-reason/document-reject-reason.component";
import { MatDialog } from "@angular/material/dialog";
import { REVIEW_STATUS } from "./kyc-verification.service";
import { CoapplicantLoanApplicationDocumentDTO } from "../models/loan-application-document.model";

interface UniqueProofTypes {
  applicants: string[];
  coApplicants: string[];
}

@Injectable({
  providedIn: "root",
})
export class DocumentsService implements OnInit {
  private readonly selectedDocuments = new BehaviorSubject<{
    [category: string]: string[];
  }>({});
  selectedCategory: string | null = null;

  documentSizeLimit: number = null;
  isDcbLender: boolean = false;
  assignee: string = undefined;
  currentUser: string = undefined;
  kycRejectionReasons: Array<any> = [];
  ekycRejectionReasons: Array<any> = [];
  loanDocumentRejectionReasons: Array<any> = [];
  additionalDocumentRejectionReasons: Array<any> = [];
  businessApplicationRejectionReasons: Array<any> = [];
  

  constructor(
    private readonly http: HttpClient,
    private readonly subscriptionReviewService: SubscriptionReviewSupportService,
    private readonly fileService: FileService,
    private readonly uiConfigService: UiConfigService,
    private readonly associateLenderService: AssociateLenderService,
    private readonly loanService: KcreditLoanService,
    private readonly principalService: PrincipalService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    this.isDcbLender = (
      this.associateLenderService.getLenderCode() || ""
    ).includes("DCB");
    let loanDetails = this.loanService.getLoanDetails();
    this.currentUser = this.principalService.getUserLogin();
    this.assignee = getProperty(loanDetails, "loanApplicationDTO.assignee");
  }
  loadDocumentProperties() {
    this.uiConfigService
      .getUiConfigBySection(
        UI_COMPONENTS.DOCUMENT_TAGS,
        UI_COMPONENTS.LOAN_REVIEW
      )
      .subscribe((response: Array<any>) => {
        let documentConfigs = this.uiConfigService.getUiConfigurationsBySection(
          response,
          UI_COMPONENTS.DOCUMENT_TAGS,
          true
        );
        this.documentSizeLimit = getProperty(
          documentConfigs,
          "documentSizeLimit",
          null
        );
      });
  }

  tagDocuments(request: any = null): Promise<any> {
    return this.http
      .post(`${KREDILINE_SERVER_URL}${TAG_DOCUMENTS}`, request)
      .toPromise();
  }

  getLoanDocumentTags(partnerId = null, branchId = null): Promise<any> {
    let params = new HttpParams();
    params = params.append("partnerId", partnerId).append("branchId", branchId);
    return this.http
      .get(`${KREDILINE_SERVER_URL}${GET_DOCUMENT_TAG_DATA}`, { params })
      .toPromise();
  }

  getDocumentIDS(documentType = null, entityType = null, kycGroupId = null, entityId = ""): Promise<any> {
    let params = new HttpParams();
    params = params.append("documentType", documentType).append("entityType", entityType).append("kycGroupId", kycGroupId).append("entityId", entityId);
    return this.http
      .get(`${KREDILINE_SERVER_URL}${TAG_DOCUMENTS_IDS}`, { params })
      .toPromise();
  }

  extractDocsTypes(docs, targetArray: string[]) {
    if (!docs) return;
    docs.forEach((doc) => {
      if (doc.mandatory) {
        targetArray.push(...doc.mandatory);
      }
      if (doc.optionalDocs) {
        targetArray.push(...doc.optionalDocs);
      }
    });
  }
  extractUniqueProofTypes(data): UniqueProofTypes {
    const uniqueProofTypes: UniqueProofTypes = {
      applicants: [],
      coApplicants: [],
    };

    data.loanTypes.forEach((loanType) => {
      loanType.stages.forEach((stage) => {
        this.extractDocsTypes(
          stage.applicantRequiredDocs,
          uniqueProofTypes.applicants
        );
        this.extractDocsTypes(
          stage.coapplicantRequiredDocs,
          uniqueProofTypes.coApplicants
        );
      });
    });

    uniqueProofTypes.applicants = Array.from(
      new Set(uniqueProofTypes.applicants)
    );
    uniqueProofTypes.coApplicants = Array.from(
      new Set(uniqueProofTypes.coApplicants)
    );

    return uniqueProofTypes;
  }

  convertDocsToFiles(documents: any[], updatedDocument: any): File[] {
    const files: File[] = [];
    documents.forEach((doc) => {
      let docId: number = getProperty(doc, "id", "");
      if (!docId) {
        return;
      }
      let docImage: string = updatedDocument[docId];
      if (!docImage) {
        return;
      }
      let imageBlob = this.subscriptionReviewService.dataURItoBlob(docImage);
      if (imageBlob) {
        const imageFile = new File([imageBlob], docId + ".jpg", {
          type: "image/jpeg",
        });
        files.push(imageFile);
      }
    });
    return files;
  }
  async uploadDocumentsToS3(
    files: File[],
    updatedDocument: any = {},
    loanReviewDocs: Array<any> = [],
    partnerId: number = null
  ) {
    if (files.length > 0 && partnerId) {
      let fileDTOs = await this.fileService
        .uploadKaleidofinImage(files, "S3", partnerId)
        .toPromise();
      if (fileDTOs !== undefined) {
        const updatedDocTypes = Object.keys(updatedDocument);
        let currentFile = 0;

        loanReviewDocs.forEach((doc) => {
          if (updatedDocTypes.indexOf(doc.id + "") !== -1) {
            doc.documentFileId = fileDTOs[currentFile].id;
            currentFile = currentFile + 1;
          }
        });
      }
    }
    return loanReviewDocs;
  }

  async saveEditedDocs(
    documents: Array<any> = [],
    updatedDocument: any = {},
    partnerId: number = null
  ) {
    const files: Array<any> = this.convertDocsToFiles(
      documents,
      updatedDocument
    );

    return await this.uploadDocumentsToS3(
      files,
      updatedDocument,
      documents,
      partnerId
    );
  }
  checkAndDisableActions(doc: any = {}) {
    if (this.isDcbLender) {
      if (!this.assignee) {
        return true;
      }
      if (this.currentUser !== this.assignee) {
        return true;
      }
    }

    if (doc) {
      return (
        ["REJECT", "ACCEPT", "Rejected"].includes(
          get(doc, "reviewStatus", "")
        ) ||
        ["REJECT", "ACCEPT", "Rejected"].includes(
          get(doc, "verificationStatus", "")
        ) ||
        !(get(doc, "documentFileId", null) || get(doc, "fileId", null))
      );
    }
    return false;
  }

  getSelectedDocuments(): Observable<{ [category: string]: string[] }> {
    return this.selectedDocuments.asObservable();
  }

  updateSelectedDocuments(category: string, documents: string[]): void {
    const currentSelection = this.selectedDocuments.getValue();
    currentSelection[category] = documents;
    this.selectedDocuments.next(currentSelection);
  }

  clearSelection(category: string): void {
    const currentSelection = this.selectedDocuments.getValue();
    currentSelection[category] = [];
    this.selectedDocuments.next(currentSelection);
  }

  clearAll(): void {
    this.selectedDocuments.next({});
  }

  handleDocumentRejection(
    reviewStatus: string = null,
    rejectionReasons: Array<string> = [],
    purpose: string = null,
    subtype: string = null,
    loanReviewDocs: Array<any> = [],
    updatedDocuments: Array<any> = [],
    partnerId: number = null,
    saveDocStatus: Function = noop
  ): void {
    if (reviewStatus === "REJECT") {
      const dialogRef = this.dialog.open(DocumentRejectReasonComponent, {
        width: "50rem",
        data: {
          documentCategory: `${purpose} - ${subtype}`,
          rejectionReasons: rejectionReasons ?? [],
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result?.rejected) {
          let reasons: Array<string> = result?.reason || [];
          loanReviewDocs.forEach((doc) => {
            doc.reviewStatus = reviewStatus;
            doc.disableAccept = true;
            doc.reviewRemarks = reasons.join(",");
          });
          this.updateDocument(loanReviewDocs, updatedDocuments, partnerId, saveDocStatus);
        }
      });
    } else {
      loanReviewDocs.forEach((doc) => {
        doc.reviewStatus = reviewStatus;
        doc.disableAccept = true;
      });
      this.updateDocument(loanReviewDocs, updatedDocuments, partnerId, saveDocStatus);
    }
  }

  async updateDocument(
    documents: Array<any> = [],
    updatedDocument: Array<any> = [],
    partnerId: number = null,
    saveDocStatus:Function = noop
  ) {
    let loanReviewDocs = [];
    loanReviewDocs = documents.filter(
      (doc) => !REVIEW_STATUS.includes(doc?.verificationStatus)
    );
    if (!isEmpty(updatedDocument)) {
      await this.saveEditedDocs(loanReviewDocs, updatedDocument, partnerId);
    }
    saveDocStatus(loanReviewDocs);
  }

  addOthersOption(): void {
    this.kycRejectionReasons.push({ value: "Others" });
    this.ekycRejectionReasons.push({ value: "Others" });
    this.loanDocumentRejectionReasons.push({ value: "Others" });
    this.additionalDocumentRejectionReasons.push({ value: "Others" });
  }

  extractPan(loanDetailDocuments: any = {}): any {
    if (loanDetailDocuments?.hasOwnProperty("Pan")) {
      let allDocuments = getProperty(loanDetailDocuments, "Pan", {});
      let documents = [];
      Object.keys(allDocuments).forEach((key)=> {
        if(key?.toLowerCase() === "pan") {
          documents.push(...allDocuments[key]);
          delete(allDocuments[key]);
        }
      })
    if(documents?.length) {
      const extractEntityPan = (entityType: string = null) => {
        return documents.filter((doc: CoapplicantLoanApplicationDocumentDTO)=> {
          if(entityType?.length) {
            return doc?.entityType === entityType;
          }
          return !doc?.entityType;
        })
      }
      const panDocuments = {};
      panDocuments["APPLICANT"]= extractEntityPan();
      panDocuments["CO_APPLICANT"] = extractEntityPan("CO_APPLICANT");
      panDocuments["GUARANTOR"]= extractEntityPan("GUARANTOR");
      return panDocuments;
    }
  }
  }

}
