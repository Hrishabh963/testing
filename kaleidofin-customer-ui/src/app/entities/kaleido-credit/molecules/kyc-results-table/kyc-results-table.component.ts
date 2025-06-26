import { Component, Input, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { UI_COMPONENTS } from "src/app/constants/ui-config";
import { getProperty } from "src/app/utils/app.utils";
import { KycVerificationService } from "../../services/kyc-verification.service";
import { UiConfigService } from "../../services/ui-config.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { isEmpty, set } from "lodash";
import { MatDialog } from "@angular/material/dialog";
import { KycResultsUpdatePopupComponent } from "../../atoms/kyc-results-update-popup/kyc-results-update-popup.component";
import { PrincipalService } from "src/app/core";

@Component({
  selector: "app-kyc-results-table",
  templateUrl: "./kyc-results-table.component.html",
  styleUrls: ["./kyc-results-table.component.scss"],
})
export class KycResultsTableComponent implements OnInit {
  @Input() loanId: number = null;
  @Input() type: string = null;
  @Input() idNo: string = "";
  @Input() entityType: string = "";
  @Input() entityId: number;
  @Input() purpose: string = "";

  matchValueData: string = null;
  matchValueClass: BehaviorSubject<string> = new BehaviorSubject<string>("");
  private readonly statusMap: { [key: string]: string } = {
    Match: "accept",
    Invalid: "failed",
    "Not Match": "failed",
    NA: "",
    Pending: "pending",
  };

  showDetail: boolean = true;
  includeGovDB: boolean = false;
  enableVerifyBtn: boolean = false;

  matchValue: string = "";
  resultsOrder: Array<any> = [];
  data: any = {};
  results: Array<any> = [];
  resultsToUpdate: Array<any> = [];
  headers: Array<string> = [];
  hideKycColumn: boolean = false;
  rows: Array<any> = [];
  headingSubtitle: any = {};
  allowedTypes: string[] = [];

  ocrError: string = null;
  nonOcrError: string = null;

  constructor(
    private readonly kycVerificationService: KycVerificationService,
    private readonly uiConfigService: UiConfigService,
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly principalService: PrincipalService
  ) {}

  async ngOnInit() {
    this.updateAllowedProperties();
    const configResponse = await this.uiConfigService
      .getUiConfig(UI_COMPONENTS.LOAN_REVIEW)
      .toPromise();
    const kycVerificationResultsConfig = configResponse.find(
      (config) =>
        getProperty(config, "sectionName", "") ===
        UI_COMPONENTS.KYC_VERIFICATION_RESULTS
    );
    const uiConfig = JSON.parse(
      getProperty(kycVerificationResultsConfig, "uiConfigurations", "{}")
    );
    const headers = JSON.parse(getProperty(uiConfig, "headers", "{}"));
    this.hideKycColumn = JSON.parse(
      getProperty(uiConfig, "hideKycColumn", false)
    );
    const subtitle = getProperty(uiConfig, "headingSubtitle", {});
    if (!isEmpty(subtitle) && this.type) {
      this.headingSubtitle = subtitle[this.type.toLowerCase()];
    }
    this.resultsOrder = getProperty(uiConfig, "resultsOrder", []);
    this.data = getProperty(headers, (this.type || "").toLowerCase(), []);
    this.headers = Object.keys(this.data);
    this.includeGovDB = this.headers.includes("Government Database");
    this.kycVerificationService
      .getKycVerificationStatus(this.loanId, this.entityId, this.entityType)
      .subscribe(
        (response: any) => this.handleKycResults(response),
        (error) => {
          console.error(error);
          this.snackbar.open("Error while KYC Verification", "", {
            duration: 4000,
          });
        }
      );
  }

  updateAllowedProperties() {
    switch (this.entityType) {
      case "APPLICANT":
        this.allowedTypes = [
          "Gender",
          "Father's Name",
          "DOB",
          "Current and Permanent Address",
          "Address",
          "City",
          "District",
          "District or City",
          "Pincode",
          "State",
          "Name",
          "Date of Birth",
          "Year Of Birth",
        ];
        break;
      case "CO_APPLICANT":
      case "GUARANTOR":
      case "NOMINEE":
        this.allowedTypes = ["DOB", "Name", "Date of Birth", "Year Of Birth"];
        break;
      default:
        this.allowedTypes = [];
    }
  }
  handleKycResults(response: any = {}) {
    const allResults: Array<any> = getProperty(response, "results", []);
    const currentResult = allResults.find((result) => {
      let purpose: string = getProperty(result, "purpose", null);
      if(purpose?.toLowerCase() === "tax" && this.type === "Pan") {
        return true;
      }
      if (purpose) {
        return (
          getProperty(result, "documentIdNo", "") === this.idNo &&
          purpose === this.purpose
        );
      }
      return getProperty(result, "documentIdNo", "") === this.idNo;
    });
    const results = getProperty(currentResult, "result", {});
    this.results = Object.keys(results).map((key) => {
      return {
        type: key,
        ...results[key],
      };
    });

    this.results = this.results.map((result) => ({
      ...result,
      class: this.getStatusClass(result["status"]),
    }));
    this.updateResultsByCriteria("Name");
    this.updateResultsByCriteria("DOB");
    this.updateResultsByCriteria("ID No");
    this.enableVerifyBtn = Object.values(results).every(
      (item) =>
        (this.includeGovDB && item["governmentDatabase"] === null) ||
        item["kycDetails"] === null
    );

    this.matchValueData = getProperty(
      currentResult,
      "overallStatus",
      "Pending"
    );
    this.matchValueClass.next(this.getOverallStatusClass(this.matchValueData));
    this.getErrors(currentResult);
    this.results.sort((a, b) => {
      return (
        this.resultsOrder.indexOf(a.type) - this.resultsOrder.indexOf(b.type)
      );
    });
    this.resultsToUpdate = this.transformData(this.results || []);
  }

  updateResultsByCriteria(resultType: string = ""): void {
    if (
      this.type.toLowerCase() === "pan" ||
      this.type.toLowerCase() === "aadhaar"
    ) {
      let nameIndex = this.results.findIndex(
        (result) => result?.type === resultType
      );
      if (nameIndex === -1) return;

      const isAadhaar = this.type.toLowerCase() === "aadhaar";
      if (isAadhaar && resultType !== "ID No") return;
      if (!isAadhaar && resultType === "ID No") return;

      const matchStatusText =
        this.results[nameIndex]?.class === "failed" ? "does not" : "";

      set(this.results, `[${nameIndex}].governmentDatabase`, "Not Available");
      set(
        this.results,
        `[${nameIndex}].helperText`,
        `${resultType} ${matchStatusText} match with govt records`
      );
    }
  }

  updateDetailsDisplay() {
    this.showDetail = !this.showDetail;
  }
  getStatusClass(matchValue: string = "") {
    if (!matchValue || matchValue?.toLowerCase().includes("na")) {
      return "";
    }
    return this.statusMap[matchValue];
  }
  getOverallStatusClass(matchValue: string): string {
    return this.statusMap[matchValue] || "failed";
  }

  getErrors(result: any): void {
    this.ocrError = getProperty(result, "ocrErrorMessage", null);
    this.nonOcrError = getProperty(result, "nonOcrErrorMessage", null);
  }

  verifyKycManually() {
    const requestPayload = {
      loanApplicationId: this.loanId,
      documentType: this.type,
      documentIdNo: this.idNo ?? "",
      entityId: this.entityId,
      customerType: this.entityType,
      purpose: this.purpose,
    };
    this.kycVerificationService.verifyKyc(requestPayload).subscribe(
      (response) => {
        this.handleKycResults(response);
      },
      (error) => {
        console.error(error);
        this.snackbar.open("Error while KYC Verification", "", {
          duration: 4000,
        });
      }
    );
  }
  transformData(data: any[]): any[] {
    return data.reduce((acc, item) => {
      if (this.allowedTypes.includes(item.type)) {
        const updatedValue = item?.governmentDatabase
          ? item.governmentDatabase
          : item.kycDetails;
        if (
          updatedValue != null &&
          ["Not Match", "Invalid", "NA"].includes(item?.status)
        ) {
          acc.push({
            label: item.type,
            existingValue: item.applicant,
            updatedValue,
            class: item.class,
          });
        }
      }
      return acc;
    }, []);
  }
  openUpdateDialog() {
    const updateConfirmation = this.dialog.open(
      KycResultsUpdatePopupComponent,
      {
        maxWidth: "50vw",
        data: {
          results: this.resultsToUpdate,
          entityId: this.entityId,
          customerType: this.entityType,
          documentType: this.type,
          documentIdNo: this.idNo,
          purpose: this.purpose,
          loanId: this.loanId,
        },
      }
    );
    updateConfirmation.afterClosed().subscribe((response: any = null) => {
      console.log(response, "closed");
    });
  }

  getDisabledCheck(): boolean {
    return this.principalService.getUserRole() === "ROLE_ANALYST";
  }

}
