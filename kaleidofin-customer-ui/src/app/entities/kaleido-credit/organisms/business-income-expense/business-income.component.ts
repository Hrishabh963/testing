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
  selector: "app-business-income-expense",
  templateUrl: "./business-income.component.html",
  standalone: false
})
export class BusinessIncomeExpenseComponent implements OnInit {
  @Input() editSections: boolean = false;
  @Input() loanId: number = null;

  panelOpenState: boolean = true;
  enableEdit: boolean = false;
  hasAuthority: boolean = false;
  sectionKey: string = null;

  initialValues: UiFieldsDto = {};

  businessIncomeMonthly: UiFields = {};
  businessExpMonthly: UiFields = {};
  businessFinancialOverviewMonthly: UiFields = {};
  businessFinancialOverviewAnnual: UiFields = {};

  businessIncomeMonthlyMap: Array<any> = [];
  businessExpMonthlyMap: Array<any> = [];
  businessFinancialOverviewMonthlyMap: Array<any> = [];
  businessFinancialOverviewAnnualMap: Array<any> = [];

  constructor(
    private readonly uiConfigService: UiConfigService,
    private readonly snackBar: MatSnackBar,
    private readonly dependableFieldCheck: DependableFieldValidationService,
    private readonly loanReviewService: LoanReviewService,
    private readonly authorizationService: AuthorizationService
  ) {}

  ngOnInit(): void {
    this.hasAuthority = this.authorizationService.hasAuthority(
      SECTION_INFORMATION.BUSINESS_INCOME_EXPENSE.authority
    );
    this.sectionKey = SECTION_INFORMATION.BUSINESS_INCOME_EXPENSE.sectionKey;
    this.editSections = this.hasAuthority;
    this.uiConfigService
      .getUiInformationBySections(
        SECTION_INFORMATION.BUSINESS_INCOME_EXPENSE.sectionKey,
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
    this.businessIncomeMonthly=  this.getSubsection(subSections, "Business Income (Monthly)");
    this.businessExpMonthly= this.getSubsection(subSections, "Business Expenditure (Monthly)");
    this.businessFinancialOverviewMonthly=this.getSubsection(subSections, "Monthly Business Financial Overview");
    this.businessFinancialOverviewAnnual= this.getSubsection(subSections, "Annual Business Financial Overview");
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

  getUiConfiguration(): void {
    this.uiConfigService
      .getUiConfigBySection(SECTION_INFORMATION.BUSINESS_INCOME_EXPENSE.sectionKey)
      .subscribe((response: any) => {
        const uiFieldsMap: any =
          this.uiConfigService.getUiConfigurationsBySection(
            response,
            SECTION_INFORMATION.BUSINESS_INCOME_EXPENSE.sectionKey,
            true
        );
        this.businessIncomeMonthlyMap = getSubsectionFields(
          uiFieldsMap,
          "Business Income (Monthly)"
        );
        this.businessExpMonthlyMap = getSubsectionFields(uiFieldsMap, "Business Expenditure (Monthly)");
        this.businessFinancialOverviewMonthlyMap = getSubsectionFields(uiFieldsMap, "Monthly Business Financial Overview");
        this.businessFinancialOverviewAnnualMap = getSubsectionFields(uiFieldsMap, "Annual Business Financial Overview");
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
    const businessIncomeMonthly = this.uiConfigService.extractData(
      this.businessIncomeMonthly
    );
    const businessExpMonthly = this.uiConfigService.extractData(
      this.businessExpMonthly
    );
    const businessFinancialOverviewMonthly = this.uiConfigService.extractData(
      this.businessFinancialOverviewMonthly
    );
    const businessFinancialOverviewAnnual = this.uiConfigService.extractData(
      this.businessFinancialOverviewAnnual
    );
    return {
      ...businessIncomeMonthly,
      ...businessExpMonthly,
      ...businessFinancialOverviewMonthly,
      ...businessFinancialOverviewAnnual
    };
  }

  save(event: Event): void {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
    const payload: any = this.getPayload();
    this.uiConfigService
      .updateUiFields(
        SECTION_INFORMATION.BUSINESS_INCOME_EXPENSE.apiKey,
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
