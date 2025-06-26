import { Component, Input, OnInit } from "@angular/core";
import { UiConfigService } from "../../services/ui-config.service";
import {
  SECTION_INFORMATION,
  UiFields,
  UiFieldsDto,
} from "src/app/constants/ui-config";
import { getProperty } from "src/app/utils/app.utils";
import { LoanReviewService } from "../../report/loan-review.service";
import { DependableFieldValidationService } from "../../dependable-field-validation.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthorizationService } from "../../services/authorization.service";

@Component({
  selector: "app-occupation-details",
  templateUrl: "./occupation-details.component.html"
})
export class OccupationDetailsComponent implements OnInit {
  @Input() loanId: number = null;
  @Input() editSections: boolean = null;

  panelOpenState: boolean = true;
  enableEdit: boolean = false;
  houseHoldData: UiFields = {};
  applicantData: UiFields = {};
  membersData: Array<UiFieldsDto> = [];
  initialData: any = {};

  householdLevelMap: Array<any> = [];
  applicantLevelMap: Array<any> = [];
  memberLevelMap: Array<any> = [];
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
      SECTION_INFORMATION.OCCUPATION_DETAILS.authority
    );
    this.uiConfigService
      .getUiInformationBySections(
        SECTION_INFORMATION.OCCUPATION_DETAILS.sectionKey,
        this.loanId
      )
      .subscribe(
        (response: UiFieldsDto) => {
          this.initialData = JSON.parse(JSON.stringify(response));
          this.setUiData(response);
        },
        (error) => console.error(error)
      );

    this.getUiFields();
  }

  setUiData(response: UiFieldsDto): void {
    const subsections = response?.subSections ?? [];

    const getFieldData = (index: number) => {
      const section: UiFieldsDto = getProperty(subsections, `[${index}]`, {});
      return getProperty(section, "fields", {});
    };

    this.houseHoldData = getFieldData(0);
    this.applicantData = getFieldData(1);

    const membersSection: UiFieldsDto = getProperty(subsections, `[2]`, {});
    this.membersData = membersSection?.subSections ?? [];
  }

  getUiFields(): void {
    this.uiConfigService
      .getUiConfigBySection(SECTION_INFORMATION.OCCUPATION_DETAILS.sectionKey)
      .subscribe(
        (response: any = {}) => {
          const uiFieldsMap: any =
            this.uiConfigService.getUiConfigurationsBySection(
              response,
              SECTION_INFORMATION.OCCUPATION_DETAILS.sectionKey,
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
    this.enableEdit = !this.enableEdit;
    const data: UiFieldsDto = JSON.parse(JSON.stringify(this.initialData));
    this.setUiData(data);
  }

  getPayload(): Object {
    const payload: any = {};
    const houseHoldLevel = this.uiConfigService.extractData(this.houseHoldData);
    if (Object.keys(houseHoldLevel).length > 0) {
      payload["householdLevel"] = houseHoldLevel;
    }

    const applicantLevel = this.uiConfigService.extractData(this.applicantData);
    if (Object.keys(applicantLevel).length > 0) {
      payload["applicant"] = applicantLevel;
    }

    const memberLevel: Array<any> = this.membersData
      .map((member) => {
        const fields = getProperty(member, "fields", {});
        return this.uiConfigService.extractData(fields);
      })
      .filter((memberData) => Object.keys(memberData).length > 0);

    if (memberLevel.length > 0) {
      payload["householdMembers"] = memberLevel;
    }

    return payload;
  }

  save(event: Event): void {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
    const payload: any = this.getPayload();
    this.uiConfigService
      .updateUiFields(
        SECTION_INFORMATION.OCCUPATION_DETAILS.apiKey,
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
          this.snackBar.open(
            `Error updating Occupation & Education Details`,
            "",
            {
              duration: 3000,
            }
          );
        }
      );
  }
}
