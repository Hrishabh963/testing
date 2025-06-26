import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DocumentDTO } from "../../shared/file-upload/file.constants";
import { SubscriptionReviewService } from "../../services/customer-group/subscription-review/subscription-review.service";
import { getProperty } from "src/app/utils/app.utils";
import { bytesToShortestUnit } from "../../shared/image-editor.utils";
import {
  checkDocumentFormats,
  getThumbnailUrl,
} from "../../shared/file-upload/file-utils";

@Component({
  selector: "app-deviation-documents",
  templateUrl: "./deviation-documents.component.html",
  styleUrls: ["./deviation-documents.component.scss"],
})
export class DeviationDocumentsComponent implements OnInit {
  documentDTOs: Array<DocumentDTO> = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: any,
    readonly dialogRef: MatDialogRef<DeviationDocumentsComponent>,
    readonly subscriptionReviewService: SubscriptionReviewService
  ) {}

  ngOnInit(): void {
    this.documentDTOs = this.data?.deviationDocumentDto ?? [];
    this.getDocumentImages();
  }

  async getDocumentImages(): Promise<void> {
    this.documentDTOs.forEach(async (document) => {
      const s3DTO = await this.subscriptionReviewService
        .getFileDtoFromFileId(document?.documentFileId ?? null)
        .toPromise();
      document["size"] = bytesToShortestUnit(getProperty(s3DTO, "size", ""));
      document["image"] = getProperty(s3DTO, "path", "");
      document["docType"] = getProperty(s3DTO, "type", "");
      document["fileUrl"] = getProperty(s3DTO, "path", "");
      document["fileIcon"] = getThumbnailUrl(
        getProperty(s3DTO, "type", "")
      );
    });
  }

  closePopup(): void {
    this.dialogRef.close();
  }

  isDocumentFormat(document: any): boolean {
    return checkDocumentFormats(document);
  }

  openDocument(document: any): void {
    window.open(document?.fileUrl ?? null, "_blank");
  }
}
