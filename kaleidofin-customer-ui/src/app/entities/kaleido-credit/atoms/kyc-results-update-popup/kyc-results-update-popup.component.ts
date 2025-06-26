import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { KycVerificationService } from "../../services/kyc-verification.service";

const PAYLOAD_MAP = {
  Name: "name",
  "Father's Name": "fatherName",
  Gender: "gender",
  DOB: "dateOfBirth",
  "Current and Permanent Address": "address",
  Address: "address",
  City: "city",
  District: "district",
  Pincode: "pincode",
  State: "state",
  "Date of Birth": "dateOfBirth",
  "Year Of Birth": "dateOfBirth",
};

@Component({
  selector: "app-kyc-results-update-popup",
  templateUrl: "./kyc-results-update-popup.component.html",
  styleUrls: ["./kyc-results-update-popup.component.scss"],
})
export class KycResultsUpdatePopupComponent {
  updateStatus: "idle" | "success" | "failed" = "idle";
  constructor(
    public readonly dialogRef: MatDialogRef<KycResultsUpdatePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: any,
    private readonly kycVerificationService: KycVerificationService
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  getDocumentTypeForPayload(documentType: string = "") {
    switch (true) {
      case documentType?.toUpperCase().includes("AADHAAR"):
        return "AADHAAR";
      case documentType?.toUpperCase().includes("PAN"):
        return "PAN";
      case documentType?.toUpperCase().includes("VOTER"):
        return "VOTER_ID";
      case documentType?.toUpperCase().includes("PASSPORT"):
        return "PASSPORT";
      case documentType?.toUpperCase().includes("DRIVING"):
        return "DRIVING_LICENCE";
      case documentType?.toUpperCase().includes("DL"):
        return "DRIVING_LICENCE";
      default:
        return documentType;
    }
  }

  updateData(): void {
    if (this.updateStatus === "success") {
      return;
    }
    let payload = {};
    this.data?.results?.forEach((value) => {
      payload[PAYLOAD_MAP[value?.label]] = value?.updatedValue;
    });
    payload["loanId"] = this.data?.loanId;
    payload["entityId"] = this.data?.entityId;
    payload["customerType"] = this.data?.customerType;
    payload["documentIdNo"] = this.data?.documentIdNo;
    payload["documentType"] = this.getDocumentTypeForPayload(
      this.data?.documentType
    );
    payload["purpose"] = this.data?.purpose;

    this.kycVerificationService.updateCustomerKyc(payload).subscribe(
      () => {
        this.updateStatus = "success";
      },
      (error) => {
        console.error(error);
        this.updateStatus = "failed";
      }
    );
  }
}
