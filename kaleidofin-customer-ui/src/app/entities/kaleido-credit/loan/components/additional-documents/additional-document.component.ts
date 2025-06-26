import { Component, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { groupObjectsWithMultiParams } from "src/app/shared/util/loan-application-documents-utils";
import { LoanReviewService } from "../../../report/loan-review.service";
import { AssociateLenderService } from "../../../services/associate-lender/associate-lender.service";
import { AuthorizationService } from "../../../services/authorization.service";
import { UploadService } from "../../../services/upload.service";
import { ApplicationStatus } from "../../constant";
import { KcreditLoanDetailsModel } from "../../kcredit-loanDetails.model";
import { UploadReportPopupComponent } from "../upload-reports/upload-report-popup/upload-report-popup.component";
import { DocumentsService } from "../../../services/documents.service";
import { LoanApplicationDocumentDTO } from "../../../models/loan-application-document.model";

@Component({
  selector: "jhi-additional-documents",
  templateUrl: "./additional-documents.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class AdditionalDocumentComponent {
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() loanApplicationDocuments: Array<LoanApplicationDocumentDTO> = [];
  @Input()
  coApplicantLoanApplicationDocuments: Array<LoanApplicationDocumentDTO> = [];
  @Input() disableEdit: boolean;
  @Input() loanId: any;
  @Input() partnerId: any;
  @Input() editSections: boolean = true;

  disableAddDocuments: boolean = false;
  panelOpenState: boolean = false;
  documentTypes: any[] = [];
  documentMap: any = {};
  selectedDocuments: Array<any> = [];
  isDCB: boolean = false;
  rejectionReasons: Array<any> = [];

  constructor(
    public domSanitizer: DomSanitizer,
    private readonly dialog: MatDialog,
    private readonly fileUploadService: UploadService,
    private readonly authorityService: AuthorizationService,
    private readonly associateLender: AssociateLenderService,
    private readonly loanService: LoanReviewService,
    private readonly documentService: DocumentsService
  ) {}

  ngOnInit() {
    this.isDCB = this.associateLender.getLenderCode().toLowerCase() === "dcb";
    // Fetching Documents -Additional Documents
    let loanDocuments: Array<any> = this.loanApplicationDocuments.concat(
      this.coApplicantLoanApplicationDocuments
    );
    loanDocuments =
      loanDocuments?.filter(
        (doc) =>
          (doc && !doc.loanDocumentStage) ||
          ["AdditionalDocument", null, undefined, ""].includes(
            doc?.documentCategory
          )
      ) ?? [];

    if (loanDocuments) {
      let docs = groupObjectsWithMultiParams(loanDocuments, "documentType");
      delete docs.items;
      this.documentTypes = Object.keys(docs);
      this.documentMap = docs;
    }

    if (this.isDCB) {
      this.disableAddDocuments =
        this.authorityService.validateEditAccess() &&
        this.loanService.getLoanStatus() !== ApplicationStatus.pendingagreement;
    } else {
      this.disableAddDocuments = this.authorityService.validateEditAccess();
    }

    this.rejectionReasons =
      this.documentService.additionalDocumentRejectionReasons;
  }

  receiveFiles(files: Array<any> = []) {
    this.selectedDocuments = files;
    this.fileUploadService.uploadFilesToS3(files);
  }
  addAdditionalDocuments(event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(UploadReportPopupComponent, {
      minWidth: "45vw",
      maxHeight: "80vh",
      data: {
        reportsRouteUrl: "this.reportsRouteUrl",
        acceptedFileTypes: [
          "pdf",
          "doc",
          "docx",
          "xls",
          "xlsx",
          "csv",
          "eml",
          "jpeg",
          "jpg",
          "png",
          "svg",
        ],
        uploadType: "RECEIVE_FILES",
        dialogTitle: "Upload Documents",
        canAllowMultiple: false,
        receiveFiles: (event) => this.receiveFiles(event),
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log("The dialog was closed");
    });
  }
}
