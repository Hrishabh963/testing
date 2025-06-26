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
  selector: "app-household-income-expense",
  templateUrl: "./household-income.component.html",
  standalone: false
})
export class HouseHoldIncomeExpenseComponent implements OnInit {
  @Input() editSections: boolean = false;
  @Input() loanId: number = null;

  panelOpenState: boolean = true;
  enableEdit: boolean = false;
  hasAuthority: boolean = false;
  sectionKey: string = null;

  initialValues: UiFieldsDto = {};

  hhIncomeMonthly: UiFields = {};
  hhExpendituremonthly: UiFields = {};
  hhFinancialOverviewMonthly: UiFields = {};
  hhFinancialOverviewAnnual: UiFields = {};
  cpIncomeMonthly: UiFields = {};
  incomeAssesment: UiFields = {};

  hhIncomeMonthlyMap: Array<any> = [];
  hhExpendituremonthlyMap: Array<any> = [];
  hhFinancialOverviewMonthlyMap: Array<any> = [];
  hhFinancialOverviewAnnualMap: Array<any> = [];
  cpIncomeMonthlyMap: Array<any> = [];
  incomeAssesmentMap: Array<any> = [];

  constructor(
    private readonly uiConfigService: UiConfigService,
    private readonly snackBar: MatSnackBar,
    private readonly dependableFieldCheck: DependableFieldValidationService,
    private readonly loanReviewService: LoanReviewService,
    private readonly authorizationService: AuthorizationService
  ) {}

  ngOnInit(): void {
    this.hasAuthority = this.authorizationService.hasAuthority(
      SECTION_INFORMATION.HOUSEHOLD_INCOME_EXPENSE.authority
    );
    this.editSections = this.hasAuthority;
    this.sectionKey = SECTION_INFORMATION.HOUSEHOLD_INCOME_EXPENSE.sectionKey;
    this.uiConfigService
      .getUiInformationBySections(
        SECTION_INFORMATION.HOUSEHOLD_INCOME_EXPENSE.sectionKey,
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
    this.hhIncomeMonthly = this.getSubsection(subSections, "Household Income (Monthly)");
    this.hhExpendituremonthly = this.getSubsection(subSections, "Household Expenditure (Monthly)");
    this.hhFinancialOverviewMonthly = this.getSubsection(subSections, "Monthly Household Financial Overview");
    this.hhFinancialOverviewAnnual = this.getSubsection(subSections, "Annual Household Financial Overview");
    this.cpIncomeMonthly = this.getSubsection(subSections, "Co-applicant Income (Monthly)");
    this.incomeAssesment = this.getSubsection(subSections, "Income Assessment");
  }

  getSubsection(
    subSections: Array<any> = [],
    sectionKey: string = ""
  ): UiFields {
    return (
      subSections.find((subsection: any) => {
        const title: string = subsection?.title ?? "";
        return title.toLowerCase().includes(sectionKey.toLowerCase());
      })?.fields ?? {}
    );
  }

  getUiConfiguration(): void {
    this.uiConfigService
      .getUiConfigBySection(SECTION_INFORMATION.HOUSEHOLD_INCOME_EXPENSE.sectionKey)
      .subscribe((response: any) => {
        const uiFieldsMap: any =
          this.uiConfigService.getUiConfigurationsBySection(
            response,
            SECTION_INFORMATION.HOUSEHOLD_INCOME_EXPENSE.sectionKey,
            true
        );
        this.hhIncomeMonthlyMap = getSubsectionFields(
          uiFieldsMap,
          "Household Income (Monthly)"
        );
        this.hhExpendituremonthlyMap = getSubsectionFields(uiFieldsMap, "Household Expenditure (Monthly)");
        this.hhFinancialOverviewMonthlyMap = getSubsectionFields(uiFieldsMap, "Monthly Household Financial Overview");
        this.hhFinancialOverviewAnnualMap = getSubsectionFields(uiFieldsMap, "Annual Household Financial Overview");
        this.cpIncomeMonthlyMap = getSubsectionFields(uiFieldsMap, "Co-applicant Income (Monthly)");
        this.incomeAssesmentMap = getSubsectionFields(uiFieldsMap, "Income Assessment");
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

    const hhIncomeMonthly = this.uiConfigService.extractData(
      this.hhIncomeMonthly
    );
    const hhExpendituremonthly = this.uiConfigService.extractData(
      this.hhExpendituremonthly
    );
    const hhFinancialOverviewMonthly = this.uiConfigService.extractData(
      this.hhFinancialOverviewMonthly
    );
    const hhFinancialOverviewAnnual = this.uiConfigService.extractData(
      this.hhFinancialOverviewAnnual
    );
    const cpIncomeMonthly = this.uiConfigService.extractData(
      this.cpIncomeMonthly
    );
    const incomeAssesment = this.uiConfigService.extractData(
      this.incomeAssesment
    );
    return {
      ...hhIncomeMonthly,
      ...hhExpendituremonthly,
      ...hhFinancialOverviewMonthly,
      ...hhFinancialOverviewAnnual,
      ...cpIncomeMonthly,
      ...incomeAssesment
    };
  }

  save(event: Event): void {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
    const payload: any = this.getPayload();
    this.uiConfigService
      .updateUiFields(
        SECTION_INFORMATION.HOUSEHOLD_INCOME_EXPENSE.apiKey,
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
