import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { get } from "lodash";
import { PrincipalService } from "src/app/core";
import { getProperty } from "src/app/utils/app.utils";
import { KcreditLoanService } from "../../../loan/kcredit-loan.service";
import { AssociateLenderService } from "../../../services/associate-lender/associate-lender.service";
import { AuthorizationService } from "../../../services/authorization.service";
import { DocumentsService } from "../../../services/documents.service";
import { FileService } from "../../../services/files/file.service";
import { checkDocumentFormats } from "../../file-upload/file-utils";
import { TagDialogComponent } from "../tag-dialog/tag-dialog.component";

@Component({
  selector: "app-doc-title-container",
  templateUrl: "./doc-title-container.component.html",
  styleUrls: ["./doc-title-container.component.scss"],
})
export class DocTitleContainerComponent implements OnInit, OnChanges {
  @Input() doc: any = undefined;
  @Input() disableEditButtons: boolean = false;
  @Input() tagDocumentFrom: string = "";
  @Input() id: string = "";
  @Input() documentCategory: string = "";
  @Input() docType: string = "";
  @Input() hideEditButtons: boolean = false;
  @Input() isApplicationAssigned: boolean = true;
  @Input() enableAuthorityCheck: boolean = true;
  @Input() hideTagging: boolean = false;

  @Output() editImage: EventEmitter<any> = new EventEmitter();
  @Output() onReject: EventEmitter<any> = new EventEmitter();
  @Output() onAccept: EventEmitter<any> = new EventEmitter();

  hideTagButtons: boolean = false;

  isDocumentSelected: boolean = false;
  selectedDocumentCategory: string = null;
  isDcbLender: boolean = false;
  assignee: string = undefined;
  currentUser: string = undefined;
  validateAuthority: boolean = true;

  selectedDocuments: { [category: string]: string[] } = {};

  constructor(
    public readonly dialog: MatDialog,
    private readonly documentTagService: DocumentsService,
    private readonly fileService: FileService,
    private readonly associateLenderService: AssociateLenderService,
    private readonly loanService: KcreditLoanService,
    private readonly principalService: PrincipalService,
    private readonly authorityService: AuthorizationService
  ) {}

  ngOnInit(): void {
    this.isDcbLender = (
      this.associateLenderService.getLenderCode() || ""
    ).includes("DCB");
    let loanDetails = this.loanService.getLoanDetails();
    this.currentUser = this.principalService.getUserLogin();
    this.assignee = getProperty(loanDetails, "loanApplicationDTO.assignee");
    this.hideEditButtons = this.checkAndDisableActions(this.doc);
    if (this.enableAuthorityCheck) {
      this.validateAuthority = this.authorityService.validateEditAccess();
    }
    this.updateDocumentActionText();

    this.documentTagService.getSelectedDocuments().subscribe((data) => {
      this.selectedDocuments = data;
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (getProperty(changes, "docType.currentValue", null)) {
      this.updateDocumentActionText();
    }
  }

  updateDocumentActionText() {
    const docType = this.fileService.extractFileExtension(getProperty(this.doc, "documentName", ""));
    if (docType?.toLowerCase() == "pdf") {
      this.doc["actionText"] = "Open";
      this.doc["icon"] = "fa fa-folder-open";
    } else {
      this.doc["actionText"] = "Download";
      this.doc["icon"] = "fa fa-download ";
    }
  }

  onEdit() {
    this.editImage.emit(this.doc);
  }

  isPdf(doc) {
    return checkDocumentFormats(doc);
  }

  checkAndDisableActions(doc: any = {}) {
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
  onTag() {
    this.dialog.open(TagDialogComponent, {
      width: "40vw",
      maxHeight: "60vh",
      data: {
        documents: [this.doc],
        tagDocumentFrom: this.tagDocumentFrom,
      },
    });
  }

  openPdf(document: any = {}) {
    this.fileService
      .viewPdf(document?.image, document?.documentName, this.hideEditButtons)
      .subscribe((result) => {
        if (result) {
          switch (result.action) {
            case "edit":
              this.onEdit();
              break;
            case "tag":
              this.onTag();
              break;
            case "accept":
              this.onAccept.emit(document);
              break;
            case "reject":
              this.onReject.emit(document);
              break;
          }
        }
      });
  }

  toggleDocumentSelection(documentId: string) {
    let category = this.documentCategory;
    const selected = this.selectedDocuments[category] || [];
    if (selected.includes(documentId)) {
      this.documentTagService.updateSelectedDocuments(
        category,
        selected.filter((id) => id !== documentId)
      );
    } else {
      this.documentTagService.selectedCategory = category;
      this.documentTagService.updateSelectedDocuments(category, [
        ...selected,
        documentId,
      ]);
    }

    if (this.selectedDocuments[category]?.length <= 0) {
      this.documentTagService.selectedCategory = "";
    }
  }

  onSelectCategory() {
    let category: string = this.documentCategory;
    if (
      !this.documentTagService.selectedCategory ||
      this.documentTagService.selectedCategory === category
    ) {
      this.documentTagService.selectedCategory = category;
    } else {
      this.clearSelection(this.documentTagService.selectedCategory);
      this.documentTagService.selectedCategory = category;
    }
  }

  clearSelection(category: string) {
    this.documentTagService.clearSelection(category);
  }

  getDisabled() {
    return this.documentTagService.selectedCategory
      ? this.documentCategory !== this.documentTagService.selectedCategory
      : false;
  }
}
