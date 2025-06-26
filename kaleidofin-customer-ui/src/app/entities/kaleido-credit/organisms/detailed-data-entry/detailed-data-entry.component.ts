import { Component, Input, OnInit } from "@angular/core";
import { LoanReviewService } from "../../report/loan-review.service";
import { UiConfigService } from "../../services/ui-config.service";
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
  selector: "app-detailed-data-entry",
  templateUrl: "./detailed-data-entry.component.html"
})
export class DetailedDataEntryComponent implements OnInit {
  @Input() loanId: number = null;
  @Input() editSections: boolean = false;

  householdDetailedData: UiFields = {};
  applicantDetailedData: UiFields = {};
  membersDetailedData: Array<UiFieldsDto> = [];
  initialData: Array<UiFieldsDto> = [];

  houseHoldMap: Array<any> = [];
  applicantMap: Array<any> = [];
  memberMap: Array<any> = [];

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
      SECTION_INFORMATION.DETAILED_DATA.authority
    );
    this.uiConfigService
      .getUiInformationBySections(
        SECTION_INFORMATION.DETAILED_DATA.sectionKey,
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
          this.getUiData(subsections);
        },
        (error) => console.error(error)
      );
    this.getUiFields();
  }

  getUiData(subsections: Array<UiFieldsDto>): void {
    const findSection = (titleKey: string): UiFieldsDto => {
      return subsections.find((data: UiFieldsDto) => {
        const title: string = data?.title ?? "";
        return title.toLowerCase().includes(titleKey);
      });
    };

    this.householdDetailedData = getProperty(
      findSection("household"),
      "fields",
      {}
    );
    this.applicantDetailedData = getProperty(
      findSection("applicant"),
      "fields",
      {}
    );
    this.membersDetailedData = getProperty(
      findSection("member"),
      "subSections",
      []
    );
  }

  getUiFields(): void {
    this.uiConfigService
      .getUiConfigBySection(SECTION_INFORMATION.DETAILED_DATA.sectionKey)
      .subscribe(
        (response: any = {}) => {
          const uiFieldsMap: any =
            this.uiConfigService.getUiConfigurationsBySection(
              response,
              SECTION_INFORMATION.DETAILED_DATA.sectionKey,
              true
            );
          this.houseHoldMap = getProperty(uiFieldsMap, "houseHoldLevel", []);
          this.applicantMap = getProperty(uiFieldsMap, "applicantLevel", []);
          this.memberMap = getProperty(uiFieldsMap, "memberLevel", []);
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
    const data: Array<UiFieldsDto> = JSON.parse(
      JSON.stringify(this.initialData)
    );
    this.getUiData(data);
  }

  getPayload(): object {
    const payload: any = {};
    const houseHoldLevel = this.uiConfigService.extractData(
      this.householdDetailedData
    );
    if (Object.keys(houseHoldLevel).length > 0) {
      payload["householdLevel"] = houseHoldLevel;
    }

    const applicantLevel = this.uiConfigService.extractData(
      this.applicantDetailedData
    );
    if (Object.keys(applicantLevel).length > 0) {
      payload["applicant"] = applicantLevel;
    }

    const memberLevel: Array<any> = this.membersDetailedData
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
        SECTION_INFORMATION.DETAILED_DATA.apiKey,
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
