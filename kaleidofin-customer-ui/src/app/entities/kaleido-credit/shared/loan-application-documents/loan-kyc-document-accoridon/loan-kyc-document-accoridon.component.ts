import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { get, isEmpty, set } from "lodash";
import { PrincipalService } from "src/app/core";
import { getProperty } from "src/app/utils/app.utils";
import { ImageEditorPopupService } from "../../../loan/components/image-editor/image-editor-popup.service";
import { ImageEditorComponent } from "../../../loan/components/image-editor/image-editor.component";
import { KcreditLoanService } from "../../../loan/kcredit-loan.service";
import { ReviewType } from "../../../models/customer-group/review-enum.model";
import { IdfyEntity } from "../../../models/kcredit-enum.model";
import { VERIFICATION_TYPE } from "../../../models/kyc-details.model";
import { AssociateLenderService } from "../../../services/associate-lender/associate-lender.service";
import { AuthorizationService } from "../../../services/authorization.service";
import { SubscriptionReviewService } from "../../../services/customer-group/subscription-review/subscription-review.service";
import { DocumentsService } from "../../../services/documents.service";
import {
  KycVerificationService,
  REVIEW_STATUS,
} from "../../../services/kyc-verification.service";
import { UiConfigService } from "../../../services/ui-config.service";
import { checkDocumentFormats } from "../../file-upload/file-utils";
import {
  bytesToShortestUnit,
  getFileSizeFromBase64,
} from "../../image-editor.utils";
import { APPLICANT_TAG } from "../tag-dialog/document-tag.constants";
import { TagDialogComponent } from "../tag-dialog/tag-dialog.component";

@Component({
  selector: "app-loan-kyc-document-accoridon",
  templateUrl: "./loan-kyc-document-accoridon.component.html",
  styleUrls: ["./loan-kyc-document-accoridon.component.scss"],
})
export class LoanKycDocumentAccoridonComponent implements OnInit {
  @Input() subtype: string = "";
  @Input() idNo: string = "";
  @Input() loanId: any;
  @Input() partnerId: any;
  @Input() fileData: any = [];
  @Input() submitAction: () => void | null = null;
  @Input() metaData: any = [];
  @Input() isCoApplicant: boolean = false;
  @Input() documentCategory: string = "";
  @Input() entityId: number;
  @Input() entityType: string;
  @Input() purpose: string = "";
  @Input() isTaxDocument: boolean = false;

  documents: any[] = [];
  modalRef: NgbModalRef;
  updatedDocument: any = [];
  fileDTOs: any[];
  rejectAll: boolean = false;
  tagDocumentFrom: string = undefined;
  idfyEntity: any;
  disableMask: boolean = false;
  enableKycVerification: boolean = false;
  isDcbLender: boolean = false;
  assignee: string = undefined;
  currentUser: string = undefined;
  disableEditAccess: boolean = false;
  isApplicationAssigned: boolean = true;

  constructor(
    private readonly imageEditorPopupService: ImageEditorPopupService,
    private readonly subscriptionReviewService: SubscriptionReviewService,
    private readonly kcreditLoanService: KcreditLoanService,
    private readonly snackBar: MatSnackBar,
    private readonly kycVerificationService: KycVerificationService,
    private readonly dialog: MatDialog,
    private readonly documentsService: DocumentsService,
    private readonly associateLenderService: AssociateLenderService,
    private readonly loanService: KcreditLoanService,
    private readonly principalService: PrincipalService,
    private readonly authorityService: AuthorizationService,
    private readonly uiConfigService: UiConfigService,
    private readonly documentTagService: DocumentsService
  ) {}

  ngOnInit(): void {
    this.isDcbLender = (
      this.associateLenderService.getLenderCode() || ""
    ).includes("DCB");
    let loanDetails = this.loanService.getLoanDetails();
    this.currentUser = this.principalService.getUserLogin();
    this.assignee = getProperty(loanDetails, "loanApplicationDTO.assignee");
    this.disableEditAccess = this.authorityService.validateEditAccess();
    this.tagDocumentFrom = this.entityType
      ? this.entityType
      : APPLICANT_TAG.value;
    this.getDocumentsByType();
    this.fetchImageForLoanDocuments(this.fileData);
    this.fetchKycVerificationConfig();
    this.uiConfigService.getApprovalButtonChecks().subscribe((buttonChecks) => {
      this.isApplicationAssigned = get(buttonChecks, "hasEditAccess", true);
    });
  }

  fetchKycVerificationConfig() {
    this.kycVerificationService
      .getKycVerificationConfig(this.loanId)
      .subscribe((response) => {
        let verification = this.getVerificationStatus(response);
        if (verification) {
          let documentTypes: Array<string> = getProperty(
            response,
            "documents",
            []
          );
          this.enableKycVerification = documentTypes.includes(this.subtype);
        }
      });
  }

  isPdf(doc) {
    return checkDocumentFormats(doc);
  }
  getDocumentsByType() {
    if (this.fileData && Array.isArray(this.fileData)) {
      this.documents = this.fileData
        .filter(
          (doc) =>
            get(doc, "reviewStatus", "") !== ReviewType.UPLOAD_PENDING &&
            (doc.fileId || doc.documentFileId)
        )
        .map((x) => {
          x.rejectStatus = x.reviewStatus === "REJECT";
          x.disableAccept = ["REJECT", "ACCEPT"].indexOf(x.reviewStatus) !== -1;
          return x;
        });
    }

    this.resetSelectedDocuments();
  }
  resetSelectedDocuments() {
    this.documents.forEach((doc) => (doc.tagged = false));
    this.documentTagService.clearSelection(this.documentCategory);
  }
  fetchImageForLoanDocuments(documentList: any[] = []) {
    if (documentList && documentList.length > 0) {
      documentList.forEach(async (loanApp) => {
        if ((loanApp.documentFileId || loanApp.fileId) && !loanApp.image) {
          const res = await this.subscriptionReviewService
            .getFileDtoFromFileId(loanApp.documentFileId || loanApp.fileId)
            .toPromise();

          let docSize = get(res, "size", "");
          let maxSizeLimit = this.documentsService.documentSizeLimit;
          loanApp.fileUrl = get(res, "path", "");
          loanApp.image = get(res, "path", "");
          loanApp.size = bytesToShortestUnit(docSize);
          if (maxSizeLimit !== null) {
            loanApp.docSizeClass =
              docSize > maxSizeLimit * 1024 * 1024
                ? "failure-color"
                : "success-color";
          }
          loanApp.docType = get(res, "type", "");
        }
      });
    }
  }
  validateRejectAll() {
    let disabledRejectAll = false;

    this.fileData
      .filter((doc) => !REVIEW_STATUS.includes(doc?.verificationStatus))
      .every((doc) => {
        disabledRejectAll =
          doc.rejectStatus &&
          (doc.reviewRemarks == null || doc.reviewRemarks == "");
        return !disabledRejectAll;
      });
    return disabledRejectAll;
  }

  hideRejectAllSection() {
    let displaySection = false;
    if (this.documents) {
      for (let elm of this.documents) {
        displaySection = !this.checkAndDisableActions(elm);
        if (displaySection) break;
      }
    }
    return displaySection;
  }

  async editImage(entry, feature = "CROP") {
    let imageURL = await this.subscriptionReviewService
      .getFileData(entry.fileId || entry.documentFileId)
      .toPromise();

    let image = await this.subscriptionReviewService
      .downloanFromS3(imageURL)
      .toPromise();

    this.modalRef = this.imageEditorPopupService.open(
      <Component>ImageEditorComponent,
      image.url,
      feature
    );
    this.modalRef.result.then((value) => {
      this.updatedDocument[entry.id] = value;
      entry.size = getFileSizeFromBase64(value);
      entry.image = `data:image/jpg;base64,${value}`;
    });
  }

  async updateDocument(documents: Array<any> = []) {
    let loanReviewDocs = documents.filter(
      (doc) => !REVIEW_STATUS.includes(doc?.verificationStatus)
    );
    if (!isEmpty(this.updatedDocument)) {
      await this.documentsService.saveEditedDocs(
        loanReviewDocs,
        this.updatedDocument,
        this.partnerId
      );
    }
  }

  updateDocumentStatus(documents = []) {
    if (this.isTaxDocument) {
      this.subscriptionReviewService.updateDocumentStatus(
        documents,
        this.loanId,
        this.getDocumentsByType
      );
      return;
    }
    let kycReviewDocs = documents?.map((doc) => this.createRequestPayload(doc));
    this.isCoApplicant = this.entityType.toLowerCase() !== "applicant";
    this.subscriptionReviewService
      .updateKYCReviewStatus(this.loanId, kycReviewDocs, this.isCoApplicant)
      .subscribe(() => {
        this.getDocumentsByType();
      });
  }
  openPdf(base64Image) {
    this.imageEditorPopupService.openPdf(base64Image);
  }

  redactAadhaar(doc) {
    if (this.isCoApplicant) this.idfyEntity = IdfyEntity.CoapplicantKycDetails;
    else this.idfyEntity = IdfyEntity.KycDetails;
    this.disableMask = true;
    this.snackBar.open("Please wait, masking is being initiated", null, {
      duration: 20000,
    });
    this.kcreditLoanService.redactAadhaar(this.idfyEntity, doc.id).subscribe(
      () => {},
      (res) => console.error(res)
    );

    setTimeout(function () {
      window.location.reload();
    }, 20000);
  }

  createRequestPayload(loanAppDoc) {
    let payload = {};
    set(payload, "id", loanAppDoc.id);
    set(payload, "rejectReason", loanAppDoc.reviewRemarks);
    set(
      payload,
      "reviewStatus",
      loanAppDoc.reviewStatus || loanAppDoc.verificationStatus
    );
    set(payload, "techIssueStatus", loanAppDoc.techIssueStatus);
    set(payload, "techIssueReason", loanAppDoc.techIssueReason);
    set(payload, "techIssueReason", loanAppDoc.techIssueReason);
    set(payload, "entityType", loanAppDoc.entityType);
    if (this.isCoApplicant || loanAppDoc.fileId || loanAppDoc.documentFileId) {
      set(payload, "newFileId", loanAppDoc.documentFileId);
    }
    return payload;
  }

  checkForNonReviewedDocs(doc) {
    return doc && get(doc, "rejectStatus", false);
  }
  checkAndDisableActions(doc: any = {}) {
    if (doc) {
      const reviewStatus =
        get(doc, "reviewStatus", null) || get(doc, "verificationStatus", null);
      const fileId =
        get(doc, "fileId", null) || get(doc, "documentFileId", null);
      return ["REJECT", "ACCEPT", "Rejected"].includes(reviewStatus) || !fileId;
    }
    return false;
  }

  statusDisplay(doc) {
    if (!doc) return false;
    const verificationStatuses = REVIEW_STATUS;
    return (
      verificationStatuses.includes(doc.verificationStatus) ||
      verificationStatuses.includes(doc.reviewStatus)
    );
  }
  statusDisplayText(doc) {
    if (!doc) return false;
    const verificationStatuses = REVIEW_STATUS;
    if (verificationStatuses.includes(doc.verificationStatus)) {
      return doc.verificationStatus === "ACCEPT" ? "Accepted" : "Rejected";
    } else if (verificationStatuses.includes(doc.reviewStatus)) {
      return doc.reviewStatus && doc.reviewStatus === "ACCEPT"
        ? "Accepted"
        : "Rejected";
    }
    return doc.verificationStatus || doc.reviewStatus;
  }

  checkForTags() {
    return this.documents.some((doc) => doc.tagged);
  }
  tagAllDocuments() {
    this.dialog.open(TagDialogComponent, {
      width: "40vw",
      maxHeight: "60vh",
      data: {
        documents: this.documents.filter((doc) => doc.tagged),
        tagDocumentFrom: this.tagDocumentFrom,
      },
    });
  }

  getVerificationStatus(config: any): boolean {
    let isVerificationRequired: boolean = false;
    if (this.entityType === "APPLICANT") {
      isVerificationRequired = getProperty(
        config,
        "kycVerifiationRequired",
        false
      );
      return isVerificationRequired;
    }
    const enabledLoanObligators: any = getProperty(
      config,
      "enabledLoanObligators",
      {}
    );
    isVerificationRequired = getProperty(
      enabledLoanObligators,
      VERIFICATION_TYPE[this.entityType],
      false
    );
    return isVerificationRequired;
  }

  validateReasonInput(doc: any = {}) {
    return (
      doc?.rejectStatus && !REVIEW_STATUS.includes(doc?.verificationStatus)
    );
  }

  acceptRejectAllDocuments(reviewStatus: string = "") {
    let loanReviewDocs: Array<any> = this.documents.filter(
      (doc) =>
        !REVIEW_STATUS.includes(doc?.reviewStatus || doc?.verificationStatus)
    );
    if (this.checkForTags()) {
      loanReviewDocs = loanReviewDocs.filter((doc) => doc.tagged);
    }
    this.documentsService.handleDocumentRejection(
      reviewStatus,
      this.documentsService.kycRejectionReasons,
      this.purpose,
      this.subtype,
      loanReviewDocs,
      this.updatedDocument,
      this.partnerId,
      (docs = []) => this.updateDocumentStatus(docs)
    );
  }

  acceptRejectDocument(document: any = {}, reviewStatus = "") {
    this.documentsService.handleDocumentRejection(
      reviewStatus,
      this.documentsService.kycRejectionReasons,
      this.purpose,
      this.subtype,
      [document],
      this.updatedDocument,
      this.partnerId,
      (docs = []) => this.updateDocumentStatus(docs)
    );
  }
}
