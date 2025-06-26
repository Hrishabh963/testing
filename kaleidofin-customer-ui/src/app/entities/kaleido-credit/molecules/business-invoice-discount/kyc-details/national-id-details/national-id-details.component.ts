import { Component, OnInit } from "@angular/core";
import { cloneDeep } from "lodash";
import { BusinessInvoiceService } from "src/app/entities/kaleido-credit/services/business-invoice/business-invoice.service";

@Component({
  selector: "app-national-id-details",
  templateUrl: "./national-id-details.component.html",
  styleUrls: ["../../business-review-details.scss"],
})
export class NationalIdDetailsComponent implements OnInit {
  nationalIdFields = [
    { label: "Full name as per National ID", value: "fullName" },
    { label: "Date of birth", value: "dateOfBirth" },
    { label: "National ID serial number", value: "nationalIdSerialNumber" },
    { label: "National ID number", value: "nationalIdNumber" },
  ];

  data: any = {};
  initialData: any = {};

  isEditing: boolean = false;

  constructor(
    private readonly businessInvoiceService: BusinessInvoiceService
  ) {}

  ngOnInit(): void {
    this.businessInvoiceService.businessReviewInfo.subscribe(() => {
      this.data = this.businessInvoiceService.getDocumentDetails("NationalId");
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
    this.businessInvoiceService
      .saveBusinessDocumentDetails(this.data, "NationalId")
      .then(() => {
        this.isEditing = false;
        this.initialData = cloneDeep(this.data);
      })
      .catch(() => {});
  }

  onCancel(): void {
    this.isEditing = false;
    this.data = cloneDeep(this.initialData);
  }
}
