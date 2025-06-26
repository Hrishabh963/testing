import { Component, Input, OnInit } from "@angular/core";
import { UiConfigService } from "../../services/ui-config.service";
import { DependableFieldValidationService } from "../../dependable-field-validation.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LoanReviewService } from "../../report/loan-review.service";
import {
  SECTION_INFORMATION,
  UiFields,
  UiFieldsDto,
} from "src/app/constants/ui-config";
import { AuthorizationService } from "../../services/authorization.service";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-insurance-details",
  templateUrl: "./insurance-details.component.html",
})
export class InsuranceDetailsComponent implements OnInit {
  @Input() editSections: boolean = false;
  @Input() loanId: number = null;

  panelOpenState: boolean = true;
  enableEdit: boolean = false;
  hasAuthority: boolean = false;

  initialValues: UiFieldsDto = {};

  loanCoverInsurance: UiFields = {};
  healthInsurance: UiFields = {};
  vehicleInsurance: UiFields = {};

  dropdownValues: string[] = [];

  loanCoverUIMap: Array<any> = [];
  healthUIMap: Array<any> = [];
  vehicleUIMap: Array<any> = [];

  constructor(
    private readonly uiConfigService: UiConfigService,
    private readonly snackBar: MatSnackBar,
    private readonly dependableFieldCheck: DependableFieldValidationService,
    private readonly loanReviewService: LoanReviewService,
    private readonly authorizationService: AuthorizationService
  ) {}

  ngOnInit(): void {
    this.hasAuthority = this.authorizationService.hasAuthority(
      SECTION_INFORMATION.INSURANCE_DETAILS.authority
    );
    this.uiConfigService
      .getUiInformationBySections(
        SECTION_INFORMATION.INSURANCE_DETAILS.sectionKey,
        this.loanId
      )
      .subscribe((response: UiFieldsDto) => {
        this.initialValues = JSON.parse(JSON.stringify(response));
        this.setUiData(response);
      });
    this.getUiConfiguration();
  }

  setUiData(uiData: UiFieldsDto): void {
    const subSections = uiData?.subSections ?? [];
    this.loanCoverInsurance = this.getSubsection(subSections, "loan");
    this.healthInsurance = this.getSubsection(subSections, "health");
    this.vehicleInsurance = this.getSubsection(subSections, "vehicle");
  }

  getSubsection(
    subSections: Array<UiFieldsDto> = [],
    sectionKey: string = ""
  ): UiFields {
    return (
      subSections.find((subsection: UiFieldsDto) => {
        const title: string = subsection?.title ?? "";
        return title.toLowerCase().includes(sectionKey);
      }).fields ?? {}
    );
  }

  getUiConfiguration(): void {
    this.uiConfigService
      .getUiConfigBySection(SECTION_INFORMATION.INSURANCE_DETAILS.sectionKey)
      .subscribe((response: any) => {
        const uiFieldsMap: any =
          this.uiConfigService.getUiConfigurationsBySection(
            response,
            SECTION_INFORMATION.INSURANCE_DETAILS.sectionKey,
            true
          );
        this.loanCoverUIMap = getProperty(
          uiFieldsMap,
          "loanCoverInsurance",
          []
        );
        this.healthUIMap = getProperty(uiFieldsMap, "healthInsurance", []);
        this.vehicleUIMap = getProperty(uiFieldsMap, "vehicleInsurance", []);
      });
    this.uiConfigService
      .getDropDownValues(this.loanId)
      .subscribe((response: any) => {
        const applicant: string = getProperty(response, "applicant", null);
        const coApplicants: string[] = getProperty(
          response,
          "coApplicants",
          []
        );
        const guarantors: string[] = getProperty(response, "guarantors", []);
        if (applicant) {
          this.dropdownValues.push(applicant);
        }
        this.dropdownValues = [
          ...this.dropdownValues,
          ...coApplicants,
          ...guarantors,
        ];
      });
  }

  toggleEditDetails(event: Event): void {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
  }

  cancel(event: Event): void {
    event.stopPropagation();
    this.enableEdit = false;
    const uiData: UiFieldsDto = JSON.parse(JSON.stringify(this.initialValues));
    this.setUiData(uiData);
  }

  getPayload(): Object {
    const loanCoverFields = this.uiConfigService.extractData(
      this.loanCoverInsurance
    );
    const healthInsuranceFields = this.uiConfigService.extractData(
      this.healthInsurance
    );
    const vehicleInsuranceFields = this.uiConfigService.extractData(
      this.vehicleInsurance
    );
    return {
      ...loanCoverFields,
      ...healthInsuranceFields,
      ...vehicleInsuranceFields,
    };
  }

  save(event: Event): void {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
    const payload: any = this.getPayload();
    this.uiConfigService
      .updateUiFields(
        SECTION_INFORMATION.INSURANCE_DETAILS.apiKey,
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
          console.error(error);
          this.snackBar.open(`Error updating Insurance Details`, "", {
            duration: 3000,
          });
        }
      );
  }
}
