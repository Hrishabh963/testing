import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from "@angular/core";
import { UiConfigService } from "../../services/ui-config.service";
import { SECTION_INFORMATION } from "src/app/constants/ui-config";
import { getProperty } from "src/app/utils/app.utils";
import { cloneDeep, get, set } from "lodash";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LoanReviewService } from "../../report/loan-review.service";
import { DependableFieldValidationService } from "../../dependable-field-validation.service";
import { AuthorizationService } from "../../services/authorization.service";

@Component({
  selector: "app-applicant-financial-liabilities",
  templateUrl: "./applicant-financial-liabilities.component.html",
})
export class ApplicantFinancialLiabilitiesComponent
  implements OnInit, OnChanges
{
  @Input() loanId: number = null;
  @Input() editSections: boolean = false;

  panelOpenState: boolean = true;
  hasAuthority: boolean = false;

  financialLiabilities: Array<any> = [];
  uiFieldsMap: any = {};
  constructor(
    private readonly uiConfigService: UiConfigService,
    private readonly snackBar: MatSnackBar,
    private readonly loanReviewService: LoanReviewService,
    private readonly dependableFieldCheck: DependableFieldValidationService,
    private readonly authorizationService: AuthorizationService
  ) {}

  ngOnInit(): void {
    this.hasAuthority = this.authorizationService.hasAuthority(
      SECTION_INFORMATION.FINANCIAL_LIABILITIES.authority
    );
    this.uiConfigService
      .getUiInformationBySections(
        SECTION_INFORMATION.FINANCIAL_LIABILITIES.sectionKey,
        this.loanId
      )
      .subscribe(
        (response: any) => {
          this.financialLiabilities = getProperty(response, "subSections", []);
          this.setCustomButton(this.editSections, this.hasAuthority);
        },
        (error) => console.error(error)
      );
    this.uiConfigService
      .getUiConfigBySection(
        SECTION_INFORMATION.FINANCIAL_LIABILITIES.sectionKey
      )
      .subscribe((response: any) => {
        const config: any = this.uiConfigService.getUiConfigurationsBySection(
          response,
          SECTION_INFORMATION.FINANCIAL_LIABILITIES.sectionKey,
          true
        );
        this.uiFieldsMap = getProperty(config, "uiFieldsMap", []);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    let currentEditSection: SimpleChange = get(changes, "editSections");
    let currentHasAuthority: SimpleChange = get(changes, "hasAuthority");
    this.setCustomButton(currentEditSection?.currentValue, currentHasAuthority?.currentValue);
  }
  setCustomButton(editSection: boolean, hasAuthority: boolean): void {
    const customButton: Array<any> = [
      {
        label: "Add Account",
        class: "btn btn-primary",
        disabled: !editSection || !hasAuthority,
        onClickHandler: () => this.addAccountDetails(),
      },
    ];
    const lastAccountInfo: Object =
      this.financialLiabilities[this.financialLiabilities.length - 1];
    set(lastAccountInfo, "customButtons", customButton);
  }

  addAccountDetails(): void {
    this.financialLiabilities.push(
      cloneDeep({
        ...newAccount,
        title: `Account ${this.financialLiabilities.length}`,
      })
    );
  }

  getPayload(accountInfo: any = {}): Object {
    const payload: Object = {};
    Object.keys(accountInfo).forEach((key) => {
      const value: string = getProperty(accountInfo[key], "value", null);
      payload[key] = value;
    });
    return payload;
  }
  saveData(accountInfo: any = {}): void {
    const payload = this.getPayload(accountInfo);
    this.uiConfigService
      .postUiFields(
        SECTION_INFORMATION.FINANCIAL_LIABILITIES.apiKey,
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
          this.snackBar.open(`Added successfully`, "", {
            duration: 3000,
          });
          location.reload();
        },
        (error) => {
          console.log(error);
        }
      );
  }
}

const newAccount = {
  title: "Applicant financial liability 1",
  formPost: null,
  subSections: null,
  isSave: true,
  fields: {
    accountStatus: { type: "string", value: null, editable: true },
    bankInstitution: { type: "string", value: null, editable: true },
    loanType: { type: "string", value: null, editable: true },
    monthOnBook: { type: "string", value: null, editable: true },
    outstandingAmount: { type: "number", value: null, editable: true },
    accountBehavior: { type: "string", value: null, editable: true },
    accountOpeningDate: { type: "date", value: null, editable: true },
    loanPurpose: { type: "string", value: null, editable: true },
    annualObligation: { type: "number", value: null, editable: true },
    loanAmount: { type: "number", value: null, editable: true },
    acceptableTrackRecord: { type: "string", value: null, editable: true },
  },
};
