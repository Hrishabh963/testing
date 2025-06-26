import { Component, Input, OnInit } from "@angular/core";
import { UiConfigService } from "../../services/ui-config.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LoanReviewService } from "../../report/loan-review.service";
import { DependableFieldValidationService } from "../../dependable-field-validation.service";
import {
  SECTION_INFORMATION,
  UiFields,
  UiFieldsDto,
} from "src/app/constants/ui-config";
import { getProperty } from "src/app/utils/app.utils";
import { AuthorizationService } from "../../services/authorization.service";

@Component({
  selector: "app-expense-section",
  templateUrl: "./expense-section.component.html"
})
export class ExpenseSectionComponent implements OnInit {
  @Input() loanId: number = null;
  @Input() editSections: boolean = true;

  hasAuthority: boolean = false;
  enableEdit: boolean = false;
  panelOpenState: boolean = true;

  expenseFields: UiFields = {};
  initialFields: UiFields = {};
  uiFieldsMap: Array<any> = [];

  constructor(
    private readonly uiConfigService: UiConfigService,
    private readonly snackBar: MatSnackBar,
    private readonly loanReviewService: LoanReviewService,
    private readonly dependableFieldCheck: DependableFieldValidationService,
    private readonly authorizationService: AuthorizationService
  ) {}

  ngOnInit(): void {
    this.hasAuthority = this.authorizationService.hasAuthority(
      SECTION_INFORMATION.EXPENSE.authority
    );
    this.uiConfigService
      .getUiInformationBySections(
        SECTION_INFORMATION.EXPENSE.sectionKey,
        this.loanId
      )
      .subscribe(
        (response: UiFieldsDto) => {
          this.expenseFields = getProperty(response, "fields", {});
          this.initialFields = JSON.parse(JSON.stringify(this.expenseFields));
        },
        (error) => console.error(error)
      );

    this.uiConfigService
      .getUiConfigBySection(SECTION_INFORMATION.EXPENSE.sectionKey)
      .subscribe((response: any = {}) => {
        const fieldMap: Array<any> =
          this.uiConfigService.getUiConfigurationsBySection(
            response,
            SECTION_INFORMATION.EXPENSE.sectionKey,
            true
          );
        this.uiFieldsMap = getProperty(fieldMap, "uiFieldsMap", []);
      });
  }

  cancel(event: Event) {
    event.stopPropagation();
    this.enableEdit = false;
    this.expenseFields = JSON.parse(JSON.stringify(this.initialFields));
  }

  toggleEditDetails(event: Event) {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
  }

  getPayload(): Object {
    const payload: any = this.uiConfigService.extractData(this.expenseFields);
    return payload;
  }

  save(event: Event) {
    event.stopPropagation();
    this.enableEdit = false;
    const payload: any = this.getPayload();
    this.uiConfigService
      .updateUiFields(SECTION_INFORMATION.EXPENSE.apiKey, payload, this.loanId)
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
          this.snackBar.open(`Error updating Expense`, "", {
            duration: 3000,
          });
        }
      );
  }
}
