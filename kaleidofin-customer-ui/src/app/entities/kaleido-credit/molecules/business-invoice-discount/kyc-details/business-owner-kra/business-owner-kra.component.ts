import { Component, OnInit } from "@angular/core";
import { cloneDeep } from "lodash";
import { BusinessInvoiceService } from "src/app/entities/kaleido-credit/services/business-invoice/business-invoice.service";

@Component({
  selector: "app-business-owner-kra",
  templateUrl: "./business-owner-kra.component.html",
  styleUrls: ["../../business-review-details.scss"],
})
export class BusinessOwnerKraComponent implements OnInit {
  fields = [
    { label: "PIN Number", value: "businessOwnerKraNumber" },
    { label: "Tax payer name", value: "taxPayerName" },
    { label: "Email address", value: "emailId" },
  ];

  data: any = {};
  initialData: any = {};

  isEditing: boolean = false;

  constructor(
    private readonly businessInvoiceService: BusinessInvoiceService
  ) {}

  ngOnInit(): void {
    this.businessInvoiceService.businessReviewInfo.subscribe(() => {
      this.data = this.businessInvoiceService.getDocumentDetails(
        "OwnerKRACertificate"
      );
      this.initialData = cloneDeep(this.data);
    });
  }

  onReject() {
    console.log(this.isEditing);
  }

  onEdit(): void {
    this.isEditing = true;
  }

  onSave(): void {
    this.initialData = cloneDeep(this.data);
    this.businessInvoiceService
      .saveBusinessDocumentDetails(this.data, "OwnerKRACertificate")
      .then(() => {
        this.isEditing = false;
      })
      .catch(() => {});
  }

  onCancel(): void {
    this.isEditing = false;
    this.data = cloneDeep(this.initialData);
  }
}
