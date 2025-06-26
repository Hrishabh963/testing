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
import { getSubsectionFields } from "src/app/utils/app.utils";

@Component({
  selector: "app-household-profile",
  templateUrl: "./household-profile.component.html",
  standalone: false
})
export class HouseHoldProfileComponent implements OnInit {
  @Input() editSections: boolean = false;
  @Input() loanId: number = null;

  panelOpenState: boolean = true;
  enableEdit: boolean = false;
  hasAuthority: boolean = false;
  sectionKey: string = null;

  initialValues: UiFieldsDto = {};

  outOfPoverty: UiFields = {};
  assetsAndPossessions: UiFields = {};
  hhAssets: UiFields = {};

  outOfPovertyMap: Array<any> = [];
  assetsAndPossessionsMap: Array<any> = [];
  hhAssetsMap: Array<any> = [];

  constructor(
    private readonly uiConfigService: UiConfigService,
    private readonly snackBar: MatSnackBar,
    private readonly dependableFieldCheck: DependableFieldValidationService,
    private readonly loanReviewService: LoanReviewService,
    private readonly authorizationService: AuthorizationService
  ) {}

  ngOnInit(): void {
    this.hasAuthority = this.authorizationService.hasAuthority(
      SECTION_INFORMATION.HOUSEHOLD_PROFILE_INCOME.authority
    );
    this.editSections = this.hasAuthority;
    this.sectionKey = SECTION_INFORMATION.HOUSEHOLD_PROFILE_INCOME.sectionKey;
    this.uiConfigService
      .getUiInformationBySections(
        SECTION_INFORMATION.HOUSEHOLD_PROFILE_INCOME.sectionKey,
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
    this.outOfPoverty=  this.getSubsection(subSections, "Progress Out Of Poverty (PPI) index");
    this.assetsAndPossessions= this.getSubsection(subSections, "Assets and Possessions");
    this.hhAssets= this.getSubsection(subSections, "Household Assets");
  }

  getSubsection(
    subSections: Array<UiFieldsDto> = [],
    sectionKey: string = ""
  ): UiFields {
    return (
      subSections.find((subsection: UiFieldsDto) => {
        const title: string = subsection?.title ?? "";
        return title.toLowerCase().includes(sectionKey.toLowerCase());
      })?.fields ?? {}
    );
  }

  getUiConfiguration(): void {
    this.uiConfigService
      .getUiConfigBySection(SECTION_INFORMATION.HOUSEHOLD_PROFILE_INCOME.sectionKey)
      .subscribe((response: any) => {
        const uiFieldsMap: any =
          this.uiConfigService.getUiConfigurationsBySection(
            response,
            SECTION_INFORMATION.HOUSEHOLD_PROFILE_INCOME.sectionKey,
            true
        );
        this.outOfPovertyMap = getSubsectionFields(
          uiFieldsMap,
          "Progress Out of Poverty Index (PPI) Questions"
        );
        this.assetsAndPossessionsMap = getSubsectionFields(uiFieldsMap, "Assets and Possessions");
        this.hhAssetsMap = getSubsectionFields(uiFieldsMap, "Household Assets");
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

    const outOfPoverty = this.uiConfigService.extractData(
      this.outOfPoverty
    );
    const assetsAndPossessions = this.uiConfigService.extractData(
      this.assetsAndPossessions
    );
    const hhAssets = this.uiConfigService.extractData(
      this.hhAssets
    );
    return {
      ...outOfPoverty,
      ...assetsAndPossessions,
      ...hhAssets
    };
  }

  save(event: Event): void {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
    const payload: any = this.getPayload();
    this.uiConfigService
      .updateUiFields(
        SECTION_INFORMATION.HOUSEHOLD_PROFILE_INCOME.apiKey,
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
