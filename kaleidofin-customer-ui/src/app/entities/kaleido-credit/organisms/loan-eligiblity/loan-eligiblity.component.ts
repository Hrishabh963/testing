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

@Component({
  selector: "app-loan-eligiblity",
  templateUrl: "./loan-eligiblity.component.html",
  standalone: false
})
export class LoanEligiblityComponent implements OnInit {
  @Input() editSections: boolean = false;
  @Input() loanId: number = null;

  panelOpenState: boolean = true;
  enableEdit: boolean = false;
  hasAuthority: boolean = false;

  initialValues: UiFieldsDto = {};

  incomeExpenseSummary: UiFields = {};
  foirEligiblity: UiFields = {};

  incomeExpenseSummaryMap: Array<any> = [];
  foirEligiblityMap: Array<any> = [];

  constructor(
    private readonly uiConfigService: UiConfigService,
    private readonly snackBar: MatSnackBar,
    private readonly dependableFieldCheck: DependableFieldValidationService,
    private readonly loanReviewService: LoanReviewService,
    private readonly authorizationService: AuthorizationService
  ) {}

  ngOnInit(): void {
    this.hasAuthority = this.authorizationService.hasAuthority(
      SECTION_INFORMATION.LOAN_ELIGIBLITY.authority
    );
    this.editSections = this.hasAuthority;
    this.hasAuthority = true;
    this.uiConfigService
      .getUiInformationBySections(
        SECTION_INFORMATION.LOAN_ELIGIBLITY.sectionKey,
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
    this.incomeExpenseSummary= this.getSubsection(subSections, "Income and expense summary");
    this.foirEligiblity= this.getSubsection(subSections, "Foir based eligiblity criteria");
  }

  getSubsection(
    subSections: Array<UiFieldsDto> = [],
    sectionKey: string = ""
  ): UiFields {
    return (
      subSections.find((subsection: UiFieldsDto) => {
        const title: string = subsection?.title ?? "";
        return title.toLowerCase().includes(sectionKey.toLowerCase());
      }).fields ?? {}
    );
  }

  getSubsectionFields(
    subSections: Array<any> = [],
    sectionKey: string = ""
  ): Array<any> {
    return (
      subSections.find((subsection: any) => {
        const title: string = subsection?.title ?? "";
        return title.toLowerCase().includes(sectionKey.toLowerCase());
      }).uiFields ?? []
    );
  }

  getUiConfiguration(): void {
    this.uiConfigService
      .getUiConfigBySection(SECTION_INFORMATION.LOAN_ELIGIBLITY.sectionKey)
      .subscribe((response: any) => {
        const uiFieldsMap: any =
          this.uiConfigService.getUiConfigurationsBySection(
            response,
            SECTION_INFORMATION.LOAN_ELIGIBLITY.sectionKey,
            true
        );
      
        this.incomeExpenseSummaryMap = this.getSubsectionFields(
          uiFieldsMap,
          "Income & Expense Summary"
        );
        this.foirEligiblityMap = this.getSubsectionFields(uiFieldsMap, "FOIR Based Eligibility Criteria");
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

    const incomeExpenseSummary = this.uiConfigService.extractData(
      this.incomeExpenseSummary
    );
    const foirEligiblity = this.uiConfigService.extractData(
      this.foirEligiblity
    );
    return {
      ...incomeExpenseSummary,
      ...foirEligiblity
    };
  }

  save(event: Event): void {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
    const payload: any = this.getPayload();
    this.uiConfigService
      .updateUiFields(
        SECTION_INFORMATION.LOAN_ELIGIBLITY.apiKey,
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
