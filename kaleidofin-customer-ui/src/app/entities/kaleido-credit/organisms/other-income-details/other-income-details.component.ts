import { Component, Input, OnInit } from "@angular/core";
import { UiConfigService } from "../../services/ui-config.service";
import {
  SECTION_INFORMATION,
  UiFields,
  UiFieldsDto,
} from "src/app/constants/ui-config";
import { getProperty } from "src/app/utils/app.utils";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CustomButton } from "../../models/CustomButton.model";
import { cloneDeep } from "lodash";
import { LoanReviewService } from "../../report/loan-review.service";
import { DependableFieldValidationService } from "../../dependable-field-validation.service";
import { AuthorizationService } from "../../services/authorization.service";

@Component({
  selector: "app-other-income-details",
  templateUrl: "./other-income-details.component.html",
  styleUrls: ["./other-income-details.component.scss"],
})
export class OtherIncomeDetailsComponent implements OnInit {
  @Input() loanId: number = null;
  @Input() editSections: boolean = true;

  panelOpenState: boolean = true;
  enableEdit: boolean = false;
  otherIncomeDetails: Array<any> = [];
  initialOtherIncomeDetails: Array<any> = [];
  otherIncomeMap: Array<any> = [];
  otherIncomeDetailsMap: Array<any> = [];
  uiFieldMap: Array<any> = [];
  sectionKey = SECTION_INFORMATION.OTHER_INCOME_DETAILS.sectionKey;
  customButtons: Array<CustomButton> = [];
  hasAuthority: boolean = false;

  constructor(
    private readonly uiConfigService: UiConfigService,
    private readonly snackBar: MatSnackBar,
    private readonly loanReviewService: LoanReviewService,
    private readonly dependableFieldCheck: DependableFieldValidationService,
    private readonly authorizationService: AuthorizationService
  ) {}

  ngOnInit(): void {
    this.hasAuthority = this.authorizationService.hasAuthority(
      SECTION_INFORMATION.OTHER_INCOME_DETAILS.authority
    );
    this.uiConfigService
      .getUiInformationBySections(this.sectionKey, this.loanId)
      .subscribe(
        (response: any) => {
          this.otherIncomeDetails = getProperty(response, "subSections", []);
          this.initialOtherIncomeDetails = JSON.parse(
            JSON.stringify(this.otherIncomeDetails)
          );
        },
        (error) => console.error(error)
      );
    this.uiConfigService
      .getUiConfigBySection(this.sectionKey)
      .subscribe((response: any = {}) => {
        this.uiFieldMap = this.uiConfigService.getUiConfigurationsBySection(
          response,
          this.sectionKey,
          true
        );
        this.otherIncomeDetailsMap = getProperty(
          this.uiFieldMap,
          "incomeDetails",
          []
        );
        this.otherIncomeMap = getProperty(this.uiFieldMap, "otherIncome", []);
      });
  }

  getCurrentData(): Array<any> {
    return this.otherIncomeDetails;
  }

  removeIncomeDetail(data: any = {}) {
    const indexToBeRemoved = getProperty(data, "index", null);
    if (indexToBeRemoved !== null) {
      this.otherIncomeDetails.splice(indexToBeRemoved, 1);
    }
  }

  addOtherIncomeDetail(event: Event): void {
    event.stopPropagation();
    this.otherIncomeDetails.push({
      ...cloneDeep(newIncomeDetail),
      title: `Other Income ${this.otherIncomeDetails.length}`,
      customButtons: [
        {
          label: "Remove",
          onClickHandler: (data) => this.removeIncomeDetail(data),
          data: { index: this.otherIncomeDetails.length },
          class: "delete-button",
        },
      ],
    });
  }
  toggleEditDetails(event: Event): void {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
  }

  cancel(event: Event): void {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
    this.otherIncomeDetails = JSON.parse(
      JSON.stringify(this.initialOtherIncomeDetails)
    );
  }

  getPayload(): any {
    const commonIncomeData: UiFields = getProperty(
      this.otherIncomeDetails,
      "[0].fields",
      {}
    );

    const commonFields: any =
      this.uiConfigService.extractData(commonIncomeData);
    delete commonFields["referenceId"];
    const incomeData: Array<any> = [];

    if (this.otherIncomeDetails.length > 1) {
      this.otherIncomeDetails.splice(1).forEach((incomeDetail: UiFieldsDto) => {
        const fields: UiFields = incomeDetail?.fields ?? {};
        if (Object.keys(fields).length > 0) {
          const payloadFields = this.uiConfigService.extractData(fields);
          delete payloadFields["referenceId"];
          incomeData.push(payloadFields);
        }
      });
    }

    return [{ ...commonFields, otherIncomeSources: incomeData }];
  }

  save(event: Event) {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
    const payload: any = this.getPayload();

    this.uiConfigService
      .updateUiFields(
        SECTION_INFORMATION.OTHER_INCOME_DETAILS.apiKey,
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
          this.otherIncomeDetails = JSON.parse(
            JSON.stringify(this.initialOtherIncomeDetails)
          );
          this.snackBar.open(`Error updating Other Income Details`, "", {
            duration: 3000,
          });
        }
      );
  }
}

const newIncomeDetail = {
  title: "Other Income 1",
  formPost: null,
  subSections: null,
  fields: {
    isCustomerDoingAlliedActivities: {
      type: "string",
      value: null,
      editable: true,
    },
    otherIncomeType: {
      type: "string",
      value: null,
      editable: true,
    },
    typeOfVerification: {
      type: "string",
      value: null,
      editable: true,
    },
    incomeType: {
      type: "string",
      value: null,
      editable: true,
    },
    typeOfProof: {
      type: "string",
      value: null,
      editable: true,
    },
    descriptionDetailsOfOtherIncomeSource: {
      type: "string",
      value: null,
      editable: true,
    },
    netIncomeFromAlliedActivities: {
      type: "number",
      value: null,
      editable: true,
    },
    grossIncomeFromAlliedActivities: {
      type: "number",
      value: null,
      editable: true,
    },
    monthlyIncome: {
      type: "string",
      value: null,
      editable: true,
    },
  },
};
