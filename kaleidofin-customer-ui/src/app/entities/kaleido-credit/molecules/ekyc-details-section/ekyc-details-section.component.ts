import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
} from "@angular/core";
import { KycObject } from "../../organisms/ekyc-section/ekyc.constants";
import { SubscriptionReviewService } from "../../services/customer-group/subscription-review/subscription-review.service";
import { CommonReportsDownloadService } from "../../services/common-reports-download.service";
import { getProperty } from "src/app/utils/app.utils";
import { DocumentRejectReasonComponent } from "../document-reject-reason/document-reject-reason.component";
import { MatDialog } from "@angular/material/dialog";
import { DocumentsService } from "../../services/documents.service";

@Component({
  selector: "app-ekyc-details-section",
  templateUrl: "./ekyc-details-section.component.html",
  styleUrls: ["./ekyc-details-section.component.scss"],
})
export class EkycDetailsSectionComponent implements OnInit, OnChanges {
  @Input() kycData: KycObject = {};
  @Input() entityType: string = null;
  @Input() loanId: number = null;

  @Output() getKycData: EventEmitter<any> = new EventEmitter<any>();

  isReject: boolean = false;
  rejectRemarks: string = null;
  reviewSatus: string = null;

  constructor(
    private readonly subscriptionReviewService: SubscriptionReviewService,
    private readonly dialog: MatDialog,
    private readonly documentService: DocumentsService,
    private readonly reportService: CommonReportsDownloadService
  ) {}

  ngOnInit(): void {
    this.reviewSatus = getProperty(
      this.kycData,
      "verificationStatus.value",
      ""
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    const kycDataChanges: SimpleChange = changes["kycData"];
    if(kycDataChanges.currentValue !== kycDataChanges.previousValue) {
      this.reviewSatus = getProperty(
        this.kycData,
        "verificationStatus.value",
        ""
      );
    }
  }

  reject(canReject: boolean = false): void {
    this.isReject = canReject;
    if (!canReject) {
      this.rejectRemarks = "";
    }
  }

  updateDocReviewStatus(): void {
    const payload: Array<any> = [];
    const reviewStatus: string = this.isReject ? "REJECT" : "ACCEPT";
    const docId: number = getProperty(this.kycData, "id.value", null);
    const docObject: any = {
      id: docId,
      reviewStatus: reviewStatus,
      entityType: this.entityType,
    };
    if (this.isReject) {
      docObject["rejectReason"] = this.rejectRemarks;
    }
    payload.push(docObject);

    const isCoApplicant: boolean = this.entityType === "CO_APPLICANT";

    this.subscriptionReviewService
      .updateKYCReviewStatus(this.loanId, payload, isCoApplicant)
      .subscribe(() => {
        this.getKycData.emit();
      });
  }

  openEkycReport(): void {
    const routerLink: string = "ekyc-report";
    this.reportService.openReport(this.kycData, routerLink);
  }

  isPending(): boolean {
    return this.reviewSatus.toLowerCase() === "pending";
  }

  getReviewStatus(): string {
    const status = this.reviewSatus.toLowerCase();

    switch (status) {
      case "accept":
        return "Accepted";

      case "rejected":
        return "Rejected";
    }
    return status;
  }

  isFailure(): boolean {
    return this.reviewSatus.toLowerCase() === "failure";
  }

  rejectDocument() {
    const dialogRef = this.dialog.open(DocumentRejectReasonComponent, {
      width: "50rem",
      data: {
        documentCategory: `UIDAI Aadhaar Details`,
        rejectionReasons: this.documentService.ekycRejectionReasons ?? [],
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result?.rejected) {
        let reasons: Array<string> = result?.reason || [];
        this.rejectRemarks = reasons.join(",");
        this.reject(true);
        this.updateDocReviewStatus();
      }
    });
  }
}
