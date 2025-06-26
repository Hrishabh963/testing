import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { get } from "lodash";
import { PrincipalService } from "src/app/core";
import { getProperty } from "src/app/utils/app.utils";
import { ImageEditorPopupService } from "../../../loan/components/image-editor/image-editor-popup.service";
import { ImageEditorComponent } from "../../../loan/components/image-editor/image-editor.component";
import { KcreditLoanService } from "../../../loan/kcredit-loan.service";
import { ReviewType } from "../../../models/customer-group/review-enum.model";
import { AssociateLenderService } from "../../../services/associate-lender/associate-lender.service";
import { AuthorizationService } from "../../../services/authorization.service";
import { SubscriptionReviewService } from "../../../services/customer-group/subscription-review/subscription-review.service";
import { DocumentsService } from "../../../services/documents.service";
import {
  checkDocumentFormats,
  getThumbnailUrl,
} from "../../file-upload/file-utils";
import {
  bytesToShortestUnit,
  getFileSizeFromBase64,
} from "../../image-editor.utils";
import { TagDialogComponent } from "../tag-dialog/tag-dialog.component";
import { REVIEW_STATUS } from "../../../services/kyc-verification.service";
import { UiConfigService } from "../../../services/ui-config.service";

@Component({
  selector: "app-loan-document-accordion-item",
  templateUrl: "./loan-document-accordion-item.component.html",
  styleUrls: ["./loan-document-accordion-item.component.scss"],
})
export class LoanDocumentAccordionItemComponent implements OnInit {
  @Input() subtype: string = "";
  @Input() loanId: any;
  @Input() partnerId: any;
  @Input() fileData: any = [];
  @Input() submitAction: () => void | null = null;
  @Input() isCoApplicant: any;
  @Input() documentCategory: string = "";
  @Input() sectionAuthority: string = "";
  @Input() rejectionReasons: Array<any> = null;
  documents: Array<any> = [];
  modalRef: NgbModalRef;
  updatedDocument: any = [];
  fileDTOs: any[];

  rejectAll: boolean = false;
  tagDocumentFrom: string = undefined;
  disableButtonsForTags: boolean = false;

  isDcbLender: boolean = false;
  assignee: string = undefined;
  currentUser: string = undefined;
  disableEditAccess: boolean = false;
  isApplicationAssigned: boolean = true;

  constructor(
    private readonly imageEditorPopupService: ImageEditorPopupService,
    private readonly subscriptionReviewService: SubscriptionReviewService,
    private readonly dialog: MatDialog,
    private readonly documentsService: DocumentsService,
    private readonly associateLenderService: AssociateLenderService,
    private readonly loanService: KcreditLoanService,
    private readonly principalService: PrincipalService,
    private readonly authorityService: AuthorizationService,
    private readonly uiConfigService: UiConfigService,
    private readonly documentTagService: DocumentsService
  ) {}

  ngOnInit() {
    this.isDcbLender = (
      this.associateLenderService.getLenderCode() || ""
    ).includes("DCB");
    let loanDetails = this.loanService.getLoanDetails();
    this.currentUser = this.principalService.getUserLogin();
    this.assignee = getProperty(loanDetails, "loanApplicationDTO.assignee");
    this.disableEditAccess = this.authorityService.validateEditAccess();
    this.getDocumentsByType();
    this.fetchImageForLoanDocuments(this.documents);
    this.uiConfigService.getApprovalButtonChecks().subscribe((response) => {
      this.isApplicationAssigned = get(response, "hasEditAccess", true);
    });
    this.rejectionReasons =
      this.rejectionReasons ??
      this.documentsService.loanDocumentRejectionReasons;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes["fileData"]) this.getDocumentsByType();
  }

  fetchImageForLoanDocuments(documentList: any[] = []) {
    if (documentList && documentList.length > 0) {
      documentList.forEach(async (loanApp) => {
        if (loanApp.documentFileId && !loanApp.image) {
          const res = await this.subscriptionReviewService
            .getFileDtoFromFileId(loanApp.documentFileId)
            .toPromise();

          let docSize = get(res, "size", "");
          let maxSizeLimit = this.documentsService.documentSizeLimit;
          loanApp.fileUrl = getProperty(res, "path", "");
          loanApp.image = getProperty(res, "path", "");
          loanApp.docType = getProperty(res, "type", "");
          loanApp.size = bytesToShortestUnit(docSize);
          if (maxSizeLimit !== null) {
            loanApp.docSizeClass =
              docSize > maxSizeLimit * 1024 * 1024
                ? "failure-color"
                : "success-color";
          }
          loanApp["fileIcon"] = getThumbnailUrl(getProperty(res, "type", ""));
        }
      });
    }
  }

  isPdf(doc) {
    return checkDocumentFormats(doc);
  }
  getDocumentsByType() {
    if (
      this.fileData &&
      Array.isArray(this.fileData) &&
      this.fileData.length !== this.documents.length
    ) {
      this.documents = this.fileData
        .filter(
          (doc) => get(doc, "reviewStatus", "") !== ReviewType.UPLOAD_PENDING
        )
        .map((x) => {
          x.disableAccept = REVIEW_STATUS.indexOf(x.reviewStatus) !== -1;
          return x;
        });
    }
    this.resetSelectedDocuments();
  }

  async editImage(entry, feature) {
    let imageURL = await this.subscriptionReviewService
      .getFileData(entry.documentFileId)
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

  acceptRejectAllDocuments(reviewStatus: string = "") {
    let loanReviewDocs = this.documents.filter(
      (doc) =>
        !REVIEW_STATUS.includes(doc?.reviewStatus || doc?.verificationStatus)
    );
    if (this.checkForTags()) {
      loanReviewDocs = loanReviewDocs.filter((doc) => doc.tagged);
    }
    this.documentsService.handleDocumentRejection(
      reviewStatus,
      this.rejectionReasons,
      this.documentCategory,
      this.subtype,
      loanReviewDocs,
      this.updatedDocument,
      this.partnerId,
      (docs = []) =>
        this.subscriptionReviewService.updateDocumentStatus(
          docs,
          this.loanId,
          this.getDocumentsByType
        )
    );
  }

  acceptRejectDocument(document: any = {}, reviewStatus = "") {
    this.documentsService.handleDocumentRejection(
      reviewStatus,
      this.documentsService.kycRejectionReasons,
      this.documentCategory,
      this.subtype,
      [document],
      this.updatedDocument,
      this.partnerId,
      (docs = []) =>
        this.subscriptionReviewService.updateDocumentStatus(
          docs,
          this.loanId,
          this.getDocumentsByType
        )
    );
  }

  checkAndDisableActions(doc: any = {}) {
    if (doc) {
      return (
        REVIEW_STATUS.includes(get(doc, "reviewStatus", "")) ||
        REVIEW_STATUS.includes(get(doc, "verificationStatus", ""))
      );
    }
    return false;
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

  validateRejectAll() {
    let disabledRejectAll = false;

    this.documents
      .filter((doc) => !REVIEW_STATUS.includes(doc?.verificationStatus))
      .every((doc) => {
        disabledRejectAll =
          doc.rejectStatus &&
          (doc.reviewRemarks == null || doc.reviewRemarks == "");
        return !disabledRejectAll;
      });
    return disabledRejectAll;
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
  validateReasonInput(doc: any = {}) {
    return doc?.rejectStatus && !REVIEW_STATUS.includes(doc?.reviewStatus);
  }

  resetSelectedDocuments() {
    this.documents.forEach((doc) => (doc.tagged = false));
    this.documentTagService.clearSelection(this.documentCategory);
  }
}
