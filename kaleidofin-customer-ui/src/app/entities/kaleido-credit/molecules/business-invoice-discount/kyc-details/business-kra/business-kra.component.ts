import { Component, OnInit } from "@angular/core";
import { cloneDeep } from "lodash";
import { BusinessInvoiceService } from "src/app/entities/kaleido-credit/services/business-invoice/business-invoice.service";

@Component({
  selector: "app-business-kra",
  templateUrl: "./business-kra.component.html",
  styleUrls: ["../../business-review-details.scss"],
})
export class BusinessKraComponent implements OnInit {
  fields = [
    { label: "PIN Number", value: "businessKraNumber" },
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
      this.data =
        this.businessInvoiceService.getDocumentDetails("KRACertificate");
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
      .saveBusinessDocumentDetails(this.data, "KRACertificate")
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
