import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SubscriptionReviewService } from "src/app/entities/kaleido-credit/services/customer-group/subscription-review/subscription-review.service";
import { UploadService } from "src/app/entities/kaleido-credit/services/upload.service";
import {
  checkDocumentFormats,
  getThumbnailUrl,
} from "src/app/entities/kaleido-credit/shared/file-upload/file-utils";
import { DocumentDTO } from "src/app/entities/kaleido-credit/shared/file-upload/file.constants";
import { bytesToShortestUnit } from "src/app/entities/kaleido-credit/shared/image-editor.utils";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-uploaded-documents",
  templateUrl: "./uploaded-documents.component.html",
  styleUrls: ["./uploaded-documents.component.scss"],
})
export class UploadedDocumentsComponent implements OnInit {
  @Input() uploadedDocuments: DocumentDTO[] = [];

  @Output() removeSelectedDocuments: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private readonly uploadService: UploadService,
    private readonly subscriptionReviewService: SubscriptionReviewService,
    private readonly snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.uploadedDocuments.forEach(async (document) => {
      const s3DTO = await this.subscriptionReviewService
        .getFileDtoFromFileId(document?.documentFileId ?? null)
        .toPromise();
      document["size"] = bytesToShortestUnit(getProperty(s3DTO, "size", ""));
      document["image"] = getProperty(s3DTO, "path", "");
      document["docType"] = getProperty(s3DTO, "type", "");
      document["fileUrl"] = getProperty(s3DTO, "path", "");
      document["fileIcon"] = getThumbnailUrl(getProperty(s3DTO, "type", ""));
    });
  }

  isDocumentFormat(document: any): boolean {
    return checkDocumentFormats(document);
  }

  openDocument(fileUrl: string): void {
    window.open(fileUrl ?? null, "_blank");
  }

  removeDocument(selectedDocument: any) {
    if(!selectedDocument) {
      return;
    }
    this.uploadService.deleteUploadedDocuments(selectedDocument?.loanApplicationId, selectedDocument?.id).subscribe(
      {
        next: ()=> {
          this.removeSelectedDocuments.emit(selectedDocument?.id);
          this.uploadedDocuments = [...this.uploadedDocuments.filter((document)=> {
            return document?.id !== selectedDocument?.id;
          })];
        },
        error: (error)=> {
          console.error(error);
          const errorMessage = getProperty(error?.error, "message", null) ?? "Error removing documents.";
          this.snackbar.open(errorMessage, "error", {
            duration: 3000
          })
        }
      }
    )
  }

}
