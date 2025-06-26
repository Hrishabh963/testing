import { Component, Input, OnInit } from "@angular/core";
import { get } from "lodash";
import { BusinessInvoiceService } from "../../../services/business-invoice/business-invoice.service";

@Component({
  selector: "app-section-level-reject",
  templateUrl: "./section-level-reject.component.html",
  styleUrls: ["../business-review-details.scss"],
})
export class SectionLevelRejectComponent implements OnInit {
  @Input() sectionKey: string = "";
  @Input() rejectReasonKey: string = "";
  @Input() rejectStatusKey: string = "";
  isRejected = false;
  showRejectField = false;
  rejectReason = "";
  businessReviewDetails: any = {};

  constructor(private readonly businessReviewService: BusinessInvoiceService) {}

  ngOnInit(): void {
    this.businessReviewService.businessReviewInfo.subscribe((reviewInfo) => {
      this.businessReviewDetails = reviewInfo;
      this.isRejected = ["REJECTED", "REJECT"].includes(
        get(this.businessReviewDetails, this.rejectStatusKey, "")
      );

      this.rejectReason = get(
        this.businessReviewDetails,
        this.rejectReasonKey,
        ""
      );
    });
  }

  handleKeyListener(event) {
    if (event?.code === "Space" || event?.key === "Enter") {
      event?.stopPropagation();
    }
  }

  handleReasonClick(event) {
    event?.stopPropagation();
  }
  handleReject(event) {
    event?.stopPropagation();
    this.showRejectField = true;
  }
  rejectSection(event) {
    event?.stopPropagation();
    if (this.rejectReason.trim() !== "") {
      const businessId = get(
        this.businessReviewDetails,
        "businessDetailsDTO.id",
        null
      );
      this.businessReviewService
        .rejectBusinessSection(this.rejectReason, businessId, this.sectionKey)
        .subscribe(() => {
          this.isRejected = true;
          this.showRejectField = false;
          this.businessReviewService.addDefaultRejectedState(this.sectionKey);
        });
    }
  }
  cancelReject(event) {
    event?.stopPropagation();
    this.showRejectField = false;
    this.rejectReason = "";
  }

  undoReject(event) {
    event?.stopPropagation();
    const businessId = get(
      this.businessReviewDetails,
      "businessDetailsDTO.id",
      null
    );
    this.businessReviewService
      .rejectBusinessSection(null, businessId, this.sectionKey)
      .subscribe(() => {
        this.showRejectField = false;
        this.isRejected = false;
        this.rejectReason = "";
        this.businessReviewService.removeDefaultRejectedState(this.sectionKey);
      });
  }
}
