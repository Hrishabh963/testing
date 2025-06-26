import { Component, Input, OnInit } from "@angular/core";
import { UiConfigService } from "../../services/ui-config.service";
import { SECTION_INFORMATION, UiFieldsDto } from "src/app/constants/ui-config";
import { getProperty } from "src/app/utils/app.utils";
import { LoanReviewService } from "../../report/loan-review.service";
import { DependableFieldValidationService } from "../../dependable-field-validation.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthorizationService } from "../../services/authorization.service";

@Component({
  selector: "app-household-details",
  templateUrl: "./household-details.component.html"
})
export class HouseholdDetailsComponent implements OnInit {
  @Input() loanId: number = null;
  @Input() editSections: boolean = false;

  panelOpenState: boolean = true;
  enableEdit: boolean = false;
  memberHouseHoldInfo: UiFieldsDto[] = [];
  initialHouseholdInfo: UiFieldsDto[] = [];
  uiFieldMap: any[] = [];
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
      SECTION_INFORMATION.HOUSEHOLD.authority
    );
    this.uiConfigService
      .getUiInformationBySections(
        SECTION_INFORMATION.HOUSEHOLD.sectionKey,
        this.loanId
      )
      .subscribe(
        (response: any) => {
          let sections = getProperty(response, "subSections", []);
          this.initialHouseholdInfo = JSON.parse(JSON.stringify(sections));
          this.getUiData(sections);
        },
        (error) => console.error(error)
      );
    this.uiConfigService
      .getUiConfigBySection(SECTION_INFORMATION.HOUSEHOLD.sectionKey)
      .subscribe((response: any = {}) => {
        this.uiFieldMap = this.uiConfigService.getUiConfigurationsBySection(
          response,
          SECTION_INFORMATION.HOUSEHOLD.sectionKey,
          true
        );
        this.uiFieldMap = getProperty(this.uiFieldMap, "uiFieldsMap", []);
      });
  }

  cancel(event: Event): void {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
    this.getUiData(this.initialHouseholdInfo);
  }

  toggleEditDetails(event: Event): void {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
  }

  getPayload(): Object {
    const memberLevel: Array<any> = this.memberHouseHoldInfo
      .map((member) => {
        const fields = getProperty(member, "fields", {});
        return this.uiConfigService.extractData(fields);
      })
      .filter((memberData) => Object.keys(memberData).length > 0);
    return memberLevel;
  }

  save(event: Event): void {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
    const payload: any = this.getPayload();
    this.uiConfigService
      .updateUiFields(
        SECTION_INFORMATION.HOUSEHOLD.apiKey,
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
          this.snackBar.open(`Error updating Household Details`, "", {
            duration: 3000,
          });
        }
      );
  }

  getUiData(section: any[]): void {
    this.memberHouseHoldInfo = getProperty(section, "[0].subSections", {});
  }
}
