import { Component, Input, OnInit } from "@angular/core";
import { cloneDeep } from "lodash";
import { BusinessInvoiceService } from "src/app/entities/kaleido-credit/services/business-invoice/business-invoice.service";

@Component({
  selector: "app-business-reg-detail-item",
  templateUrl: "./business-reg-detail-item.component.html",
  styleUrls: ["../../business-review-details.scss"],
})
export class BusinessRegDetailItemComponent implements OnInit {
  @Input() documentType: string = "";
  @Input() title: string = "";
  @Input() fields = [];

  data: any = {};
  initialData: any = {};

  isEditing: boolean = false;
  isRejected = false;
  showRejectField = false;
  rejectReason = "";

  constructor(private readonly businessInvoiceService: BusinessInvoiceService) {}

  ngOnInit(): void {
    if (this.documentType) {
      this.businessInvoiceService.businessReviewInfo.subscribe(() => {
        this.data = this.businessInvoiceService.getDocumentDetails(
          this.documentType
        );
        this.initialData = cloneDeep(this.data);
      });
    }
  }

  rejectSection(event) {
    event?.stopPropagation();
    if (this.rejectReason.trim() !== "") {
      this.isRejected = true;
      this.showRejectField = false;
    }
  }
  handleReasonClick(event) {
    event?.stopPropagation();
  }
  handleReject(event) {
    event?.stopPropagation();
    this.showRejectField = true;
  }
  cancelReject(event) {
    event?.stopPropagation();
    this.showRejectField = false;
    this.rejectReason = "";
  }

  undoReject(event) {
    event?.stopPropagation();
    this.isRejected = false;
    this.rejectReason = "";
  }

  onReject(section: string = null) {
    console.log(this.isEditing);
  }

  onEdit(): void {
    this.isEditing = true;
  }

  onSave(): void {
    this.businessInvoiceService
      .saveBusinessDocumentDetails(this.data, this.documentType)
      .then(() => {
        this.initialData = cloneDeep(this.data);
        this.isEditing = false;
      })
      .catch(() => {});
  }

  onCancel(): void {
    this.isEditing = false;
    this.data = cloneDeep(this.initialData);
  }
}
