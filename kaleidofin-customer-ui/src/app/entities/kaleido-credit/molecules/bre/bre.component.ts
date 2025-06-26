import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatIconRegistry } from "@angular/material/icon";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DomSanitizer } from "@angular/platform-browser";
import {
  SECTION_INFORMATION,
  UiFields,
  UiFieldsDto,
} from "src/app/constants/ui-config";
import { getProperty } from "src/app/utils/app.utils";
import { DependableFieldValidationService } from "../../dependable-field-validation.service";
import { KcreditLoanDetailsModel } from "../../loan/kcredit-loanDetails.model";
import { LoanReviewService } from "../../report/loan-review.service";
import { AuthorizationService } from "../../services/authorization.service";
import { BusinessRuleEngineService } from "../../services/business-rule-engine/business-rule-engine.service";
import { BreStatusResponse } from "../../services/recalculate-bre/bre.constants";
import { RecalculateBreService } from "../../services/recalculate-bre/recalculate-bre.service";
import { UiConfigService } from "../../services/ui-config.service";
import { RecalculateBrePopupComponent } from "../recalculate-bre-popup/recalculate-bre-popup.component";
import { BreValidationService } from "./bre-validation.service";
import { BRE_SUBSECTION_CONSTANTS } from "./bre.constants";

@Component({
  selector: "app-bre",
  templateUrl: "./bre.component.html",
  styleUrls: ["./bre.component.scss"],
})
export class BreComponent implements OnInit {
  @Input() loanDetails: KcreditLoanDetailsModel;
  /** To be Reworked */
  @Input() partnerApplicationId: any = undefined;
  @Input() loanApplicationId: any = undefined;
  @Input() partnerCustomerId: any = undefined;
  @Input() breNeeded: boolean = false;
  @Input() enableRecalculateBre: boolean = true;
  @Input() fromEntry: boolean = false;
  @Input() editSections: boolean = false;

  loanId: number = null;

  enableEdit: boolean = false;

  breData: any = {};
  breAction: string = "";
  breStatus: any = "failed";
  enableViewReport: boolean = false;
  /** To be Reworked */

  openBreSection: boolean = true;

  newTractor: UiFields = {};
  usedAndRefinanceTractor: UiFields = {};
  implement: UiFields = {};
  identifyCustomerDetails: UiFields = {};
  approveFinalAmounts: UiFields = {};
  eligibilityCalculation: UiFields = {};
  fieldMap: any = {};
  hasAuthority: boolean = false;
  subsections = [];

  constructor(
    private readonly matIconRegistry: MatIconRegistry,
    private readonly uiConfigService: UiConfigService,
    private readonly breService: BusinessRuleEngineService,
    private readonly snackBar: MatSnackBar,
    private readonly loanReviewService: LoanReviewService,
    private readonly dependableFieldCheck: DependableFieldValidationService,
    private readonly domSanitizer: DomSanitizer,
    private readonly dialog: MatDialog,
    private readonly recalculateBREService: RecalculateBreService,
    private readonly authorisationService: AuthorizationService,
    private readonly breValidationService: BreValidationService
  ) {
    this.matIconRegistry.addSvgIcon(
      "pdf-icon",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/common/bi_file-earmark-pdf.svg"
      )
    );
  }

  ngOnInit() {
    this.breService
      .getBreResponse()
      .subscribe((response: BreStatusResponse) => {
        this.setBreDetails(response);
      });
    this.loanId = getProperty(this.loanDetails, "loanApplicationDTO.id", null);
    this.fetchUiFieldsMap();
    this.fetchUiFields();
    if (!this.breNeeded) return;

    this.breService
      .fetchBreCondition(this.partnerCustomerId, this.partnerApplicationId)
      .subscribe(
        (response: BreStatusResponse) => {
          this.breService.setBreResponse(response);
        },
        (error) => {
          this.handleError(error);
        }
      );

    this.hasAuthority = this.authorisationService.hasAuthority(
      SECTION_INFORMATION.BRE_WITH_ELIGIBILITY.authority
    );
  }

  fetchUiFieldsMap(): void {
    this.uiConfigService
      .getUiConfigBySection(SECTION_INFORMATION.BRE_WITH_ELIGIBILITY.sectionKey)
      .subscribe((response: any = {}) => {
        this.fieldMap =
          this.uiConfigService.getUiConfigurationsBySection(
            response,
            SECTION_INFORMATION.BRE_WITH_ELIGIBILITY.sectionKey,
            true
          ) ?? {};
        this.breValidationService.setFormData("fieldMap", this.fieldMap);
      });
  }

  fetchUiFields(): void {
    this.uiConfigService
      .getUiInformationBySections("BRE_DETAILS", this.loanId)
      .subscribe(
        (response: UiFieldsDto) => {
          this.subsections = response?.subSections ?? [];
          this.setUiFields(this.subsections);
          this.breValidationService.setFormData(
            "subsections",
            this.subsections
          );
        },
        (error) => console.error(error)
      );
  }

  setUiFields(subsections: UiFieldsDto[]) {
    this.eligibilityCalculation = this.extractUiFields(
      subsections,
      BRE_SUBSECTION_CONSTANTS.eligibilityCalculations
    );
    this.newTractor = this.extractUiFields(
      subsections,
      BRE_SUBSECTION_CONSTANTS.newTractor
    );
    this.approveFinalAmounts = this.extractUiFields(
      subsections,
      BRE_SUBSECTION_CONSTANTS.approvalFinalAmounts
    );
    this.identifyCustomerDetails = this.extractUiFields(
      subsections,
      BRE_SUBSECTION_CONSTANTS.identifyCustomerDetails
    );
    this.implement = this.extractUiFields(
      subsections,
      BRE_SUBSECTION_CONSTANTS.implement
    );
    this.usedAndRefinanceTractor = this.extractUiFields(
      subsections,
      BRE_SUBSECTION_CONSTANTS.usedAndRefinanceTractor
    );

    this.breValidationService.setFormData('implement', this.implement)
    this.breValidationService.setFormData('usedAndRefinanceTractor', this.usedAndRefinanceTractor)
    this.breValidationService.setFormData('newTractor', this.newTractor)
    this.breValidationService.setFormData('approveFinalAmounts', this.approveFinalAmounts)

  }

  setBreDetails(breResponse: BreStatusResponse): void {
    this.breData = breResponse;
    this.breAction = getProperty(this.breData, "decision", "FAILED") || "";
    this.breStatus = this.breAction.toLowerCase().includes("pass")
      ? "accept"
      : "failed";
    this.enableViewReport = !["PENDING", "FAILED"].includes(this.breAction);
  }

  extractUiFields(subsections: UiFieldsDto[], sectionTitle: string): UiFields {
    return (
      subsections.find((section) => {
        return section.title === sectionTitle;
      })?.fields ?? {}
    );
  }

  handleError(error: any): void {
    console.error(error);
    this.breData = { decision: "FAILED" };
    this.breAction = getProperty(error, "error.message", "FAILED");
    this.enableViewReport = false;
  }

  openBreReport(event: Event) {
    event.stopPropagation();
    const applicantName = this.loanReviewService.getApplicantName();
    this.breData = {
      ...this.breData,
      applicantName: applicantName,
      loanId: this.loanApplicationId,
      partnerAppId: this.partnerApplicationId,
      partnerCustomerId: this.partnerCustomerId,
    };
    const serializedData = window.btoa(
      encodeURIComponent(JSON.stringify(this.breData))
    );
    const queryParams = new URLSearchParams();
    queryParams.set("data", serializedData);
    const currentUrl = new URL(window.location.href);
    const targetUrl = new URL(
      `${currentUrl.href}/bre-report?${queryParams.toString()}`
    );
    if (targetUrl.origin === currentUrl.origin) {
      window.open(targetUrl.toString(), "_blank");
    } else {
      console.error("Attempted open redirect detected and prevented.");
    }
  }

  recalculateBre(event) {
    event.stopPropagation();
    this.dialog.open(RecalculateBrePopupComponent, {
      width: "40vw",
      disableClose: true,
      panelClass: "custom-overlay",
    });
    setTimeout(() => {
      this.recalculateBREService.recalculateBRE(this.loanId).subscribe(
        (breResponse: BreStatusResponse) => {
          this.breService.setBreResponse(breResponse);
          this.recalculateBREService.finishRecalculation();
          this.uiConfigService.checkApprovalButton(this.loanId);
          this.breService.fetchDeviations(this.loanId);
          const subsections = breResponse?.sectionDto?.subSections ?? [];
          this.setUiFields(subsections);
        },
        (error) => {
          this.handleError(error);
          this.uiConfigService.checkApprovalButton(this.loanId);
        }
      );
    }, 1500);
  }

  handleBreSection() {
    this.openBreSection = !this.openBreSection;
  }

  getPayload(): Object {
    const payload: any = {};
    payload["breEligibilityCalculationDto"] = this.uiConfigService.extractData(
      this.eligibilityCalculation
    );
    payload["customerBreDetails"] = this.uiConfigService.extractData(
      this.identifyCustomerDetails
    );
    payload["breFinalApprovals"] = this.uiConfigService.extractData(
      this.breValidationService.approveFinalAmounts
    );
    return payload;
  }

  save(): void {
    const payload: any = this.getPayload();
    this.uiConfigService
      .updateUiFields(
        SECTION_INFORMATION.BRE_WITH_ELIGIBILITY.apiKey,
        payload,
        this.loanId
      )
      .subscribe(
        (response: any) => {
          const applcationStatus: string =
            this.loanReviewService.getLoanStatus();
          this.dependableFieldCheck.getLoanStageCheck(
            response,
            this.loanId,
            applcationStatus
          );
          this.snackBar.open(`Updated successfully`, "", {
            duration: 3000,
          });
          location.reload();
        },
        (error) => {
          const errors: Array<string> = getProperty(error, "error.errors", []);
          this.snackBar.open(
            errors?.length ? errors?.join(", ") : "Error updating",
            "Error",
            { duration: 3000 }
          );
        }
      );
  }

  checkForFields(fields: UiFields) {
    if (!fields) {
      return false;
    }
    return Object.keys(fields)?.length;
  }
}
