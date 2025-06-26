import { MatSnackBar } from "@angular/material/snack-bar";
import { Injectable, Component } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { SubscriptionReviewService } from "../../../services/customer-group/subscription-review/subscription-review.service";
import { openPdfFromBase64Image } from "../../../shared/image-editor.utils";

@Injectable()
export class ImageEditorPopupService {
  private isOpen = false;
  constructor(
    private readonly modalService: NgbModal,
    private readonly subscriptionReviewService: SubscriptionReviewService,
    private readonly snackBar: MatSnackBar
  ) {}

  open(component: Component, image?: any, feature?: string): NgbModalRef {
    if (this.isOpen) {
      return null;
    }
    this.isOpen = true;
    return this.cropperModalRef(component, image, feature);
  }

  cropperModalRef(
    component: Component,
    image: any,
    feature?: string
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, {
      size: "lg",
      backdrop: "static",
    });
    modalRef.componentInstance.imageData = image;
    modalRef.componentInstance.feature = feature;
    modalRef.result.then(
      () => {
        this.isOpen = false;
      },
      () => {
        this.isOpen = false;
      }
    );
    return modalRef;
  }

  async openPdf(pdfURL) {
    const response = await this.subscriptionReviewService
      .downloanFromS3(pdfURL)
      .toPromise();
    const file = new Blob([response.body]);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    this.snackBar.open("Please wait while Opening the Document", null, {
      duration: 4000,
    });
    reader.onload = () => {
      if (typeof reader.result === "string") {
        let image = reader.result.split(",")[1];
        openPdfFromBase64Image(image);
      }
    };
  }

  async getPdfAsBase64(s3Url: string): Promise<string> {
    try {
      const response = await fetch(s3Url);
      const blob = await response.blob();
      return this.blobToBase64(blob);
    } catch (error) {
      console.error("Error fetching the PDF:", error);
      throw error;
    }
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
