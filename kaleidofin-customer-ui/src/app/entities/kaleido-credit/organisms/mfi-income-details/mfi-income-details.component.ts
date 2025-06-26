import { Component, Input, OnInit } from "@angular/core";
import { UiConfigService } from "../../services/ui-config.service";
import { LoanReviewService } from "../../report/loan-review.service";
import { DependableFieldValidationService } from "../../dependable-field-validation.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthorizationService } from "../../services/authorization.service";
import {
  SECTION_INFORMATION,
  UiFields,
  UiFieldsDto,
} from "src/app/constants/ui-config";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-mfi-income-details",
  templateUrl: "./mfi-income-details.component.html"
})
export class MfiIncomeDetailsComponent implements OnInit {
  @Input() loanId: number = null;
  @Input() editSections: boolean = false;

  initialData: Array<UiFieldsDto> = [];
  householdIncomeData: UiFields = {};
  applicantIncomeData: UiFields = {};
  membersIncomeData: Array<UiFieldsDto> = [];

  householdLevelMap: Array<any> = [];
  applicantLevelMap: Array<any> = [];
  memberLevelMap: Array<any> = [];

  panelOpenState: boolean = true;
  enableEdit: boolean = false;
  hasAuthority: boolean = false;

  constructor(
    private readonly uiConfigService: UiConfigService,
    private readonly loanReviewService: LoanReviewService,
    private readonly dependableFieldCheck: DependableFieldValidationService,
    private readonly snackBar: MatSnackBar,
    private readonly authorizationService: AuthorizationService
  ) {}

  ngOnInit(): void {
    this.hasAuthority = this.authorizationService.hasAuthority(
      SECTION_INFORMATION.OTHER_INCOME_DETAILS.authority
    );
    this.uiConfigService
      .getUiInformationBySections(
        SECTION_INFORMATION.OTHER_INCOME_DETAILS.sectionKey,
        this.loanId
      )
      .subscribe(
        (response: UiFieldsDto) => {
          const subsections: Array<UiFieldsDto> = getProperty(
            response,
            "subSections",
            []
          );
          this.initialData = JSON.parse(JSON.stringify(subsections));
          this.setUiData(subsections);
        },
        (error) => console.error(error)
      );
    this.getUiFields();
  }

  setUiData(subsections: Array<UiFieldsDto>): void {
    const findSection = (titleKey: string): UiFieldsDto => {
      return subsections.find((data: UiFieldsDto) => {
        const title: string = data?.title ?? "";
        return title.toLowerCase().includes(titleKey);
      });
    };

    this.householdIncomeData = getProperty(
      findSection("household"),
      "fields",
      {}
    );
    this.applicantIncomeData = getProperty(
      findSection("applicant"),
      "fields",
      {}
    );
    this.membersIncomeData = getProperty(subsections[2], "subSections", []);
  }

  getUiFields(): void {
    this.uiConfigService
      .getUiConfigBySection(SECTION_INFORMATION.OTHER_INCOME_DETAILS.sectionKey)
      .subscribe(
        (response: any = {}) => {
          const uiFieldsMap: any =
            this.uiConfigService.getUiConfigurationsBySection(
              response,
              SECTION_INFORMATION.OTHER_INCOME_DETAILS.sectionKey,
              true
            );
          this.householdLevelMap = getProperty(
            uiFieldsMap,
            "houseHoldLevel",
            []
          );
          this.applicantLevelMap = getProperty(
            uiFieldsMap,
            "applicantLevel",
            []
          );
          this.memberLevelMap = getProperty(uiFieldsMap, "memberLevel", []);
        },
        (error) => console.error(error)
      );
  }

  toggleEditDetails(event: Event): void {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
  }

  cancel(event: Event): void {
    event.stopPropagation();
    this.enableEdit = false;
    const data: Array<UiFieldsDto> = JSON.parse(
      JSON.stringify(this.initialData)
    );
    this.setUiData(data);
  }

  getPayload(): Array<any> {
    const payload: Array<any> = [];
    payload.push(this.uiConfigService.extractData(this.householdIncomeData));
    payload.push(this.uiConfigService.extractData(this.applicantIncomeData));
    payload.push(
      ...this.membersIncomeData
        .map((members: UiFieldsDto) => {
          const fields: UiFields = members?.fields ?? {};
          return this.uiConfigService.extractData(fields);
        })
        .filter((memberData: any) => {
          return Object.keys(memberData).length > 0;
        })
    );

    return payload;
  }

  save(event: Event): void {
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
        },
        (error) => {
          console.error(error);
          this.snackBar.open(`Error updating Detailed Data Entry`, "", {
            duration: 3000,
          });
        }
      );
  }
}
