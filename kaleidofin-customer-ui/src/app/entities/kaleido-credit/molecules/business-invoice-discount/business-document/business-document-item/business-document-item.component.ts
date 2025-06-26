import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { isEmpty } from "lodash";
import { ImageEditorPopupService } from "src/app/entities/kaleido-credit/loan/components/image-editor/image-editor-popup.service";
import { ImageEditorComponent } from "src/app/entities/kaleido-credit/loan/components/image-editor/image-editor.component";
import { BusinessInvoiceService } from "src/app/entities/kaleido-credit/services/business-invoice/business-invoice.service";
import { SubscriptionReviewService } from "src/app/entities/kaleido-credit/services/customer-group/subscription-review/subscription-review.service";
import { DocumentsService } from "src/app/entities/kaleido-credit/services/documents.service";
import { REVIEW_STATUS } from "src/app/entities/kaleido-credit/services/kyc-verification.service";
import {
  checkDocumentFormats,
  getThumbnailUrl,
} from "src/app/entities/kaleido-credit/shared/file-upload/file-utils";
import {
  bytesToShortestUnit,
  getFileSizeFromBase64,
} from "src/app/entities/kaleido-credit/shared/image-editor.utils";
import { TagDialogComponent } from "src/app/entities/kaleido-credit/shared/loan-application-documents/tag-dialog/tag-dialog.component";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-business-document-item",
  templateUrl: "./business-document-item.component.html",
  styleUrls: ["./business-document-item.component.scss"],
})
export class BusinessDocumentItemComponent implements OnInit {
  @Input() data: any = {};
  @Input() category: any = {};
  @Input() rejectionReasons: Array<any> = null;

  documents: Array<any> = [];

  disableEditAccess: boolean = true;
  modalRef: NgbModalRef;
  updatedDocument: any = [];
  partnerId: number = null;

  fileDTOs: any[];

  rejectAll: boolean = false;
  tagDocumentFrom: string = undefined;
  disableButtonsForTags: boolean = false;

  isDcbLender: boolean = false;
  assignee: string = undefined;
  currentUser: string = undefined;
  isApplicationAssigned: boolean = true;

  constructor(
    private readonly businessReviewService: BusinessInvoiceService,
    private readonly documentService: DocumentsService,
    private readonly imageEditorPopupService: ImageEditorPopupService,
    private readonly reviewSerice: SubscriptionReviewService,
    private readonly businessService: BusinessInvoiceService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.businessReviewService.businessReviewInfo.subscribe((reviewInfo) => {
      this.partnerId = getProperty(
        reviewInfo,
        "tenantCustomerDTO.partnerId",
        null
      );
      this.documents = getProperty(
        reviewInfo,
        `documents[${this.category}].${this.data?.type}`,
        []
      );

      if (!isEmpty(this.documents)) {
        this.fetchImageForLoanDocuments();
      }
    });
  }

  fetchImageForLoanDocuments(documentList: any[] = this.documents) {
    if (documentList && documentList.length > 0) {
      documentList.forEach(async (document) => {
        if (document.documentFileId && !document.image) {
          const res = await this.reviewSerice
            .getFileDtoFromFileId(document.documentFileId)
            .toPromise();

          let docSize = getProperty(res, "size", "");
          let maxSizeLimit = this.documentService.documentSizeLimit;
          document.fileUrl = getProperty(res, "path", "");
          document.image = getProperty(res, "path", "");
          document.size = bytesToShortestUnit(docSize);
          if (maxSizeLimit !== null) {
            document.docSizeClass =
              docSize > maxSizeLimit * 1024 * 1024
                ? "failure-color"
                : "success-color";
          }
          document.docType = getProperty(res, "type", "");
          document["fileIcon"] = getThumbnailUrl(getProperty(res, "type", ""));
        }
      });
    }
  }

  isPdf(doc) {
    return checkDocumentFormats(doc);
  }

  async editImage(entry, feature) {
    let imageURL = await this.reviewSerice
      .getFileData(entry.documentFileId)
      .toPromise();

    let image = await this.reviewSerice.downloanFromS3(imageURL).toPromise();

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
    this.documentService.handleDocumentRejection(
      reviewStatus,
      this.rejectionReasons,
      this.category,
      this.data?.typeLabel,
      loanReviewDocs,
      this.updatedDocument,
      this.partnerId,
      (docs = []) => this.updateDocumentStatus(docs)
    );
  }

  acceptRejectDocument(document: any = {}, reviewStatus = "") {
    this.documentService.handleDocumentRejection(
      reviewStatus,
      this.documentService.kycRejectionReasons,
      this.category,
      this.data?.typeLabel,
      [document],
      this.updatedDocument,
      this.partnerId,
      (docs = []) => this.updateDocumentStatus(docs)
    );
  }

  async updateDocumentStatus(documents = []) {
    documents.forEach((doc) => (doc["entityType"] = "SELLER"));
    this.businessReviewService
      .updateDocumentStatus(documents)
      .then(() => {
        this.businessService.fetchBusinessReviewInformation().then().catch();
      })
      .catch((error) => console.log(error));
  }

  openPdf(s3URL) {
    this.imageEditorPopupService.openPdf(s3URL);
  }

  checkAndDisableActions(doc: any = {}) {
    if (doc) {
      return (
        REVIEW_STATUS.includes(getProperty(doc, "reviewStatus", "")) ||
        REVIEW_STATUS.includes(getProperty(doc, "verificationStatus", ""))
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
    this.documentService.clearSelection(this.category);
  }
}
