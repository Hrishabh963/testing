import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { UiConfigService } from "../../services/ui-config.service";
import { DependableFieldValidationService } from "../../dependable-field-validation.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LoanReviewService } from "../../report/loan-review.service";
import {
  SECTION_INFORMATION,
  UiFields,
  UiFieldsDto,
} from "src/app/constants/ui-config";
import { getSubsection, getSubsectionFields } from "src/app/utils/app.utils";
import { KcreditInterDataService } from "../../kcredit-inter-data.service";
import { KcreditLoanDetailsModel } from "../../loan/kcredit-loanDetails.model";
import { KcreditLoanService } from "../../loan/kcredit-loan.service";
import { cloneDeep } from "lodash";

@Component({
  selector: "app-loan-obligator-income",
  templateUrl: "./loan-obligator-income.component.html",
  standalone: false
})
export class LoanObligatorIncomeComponent implements OnInit, OnChanges {
  @Input() editSections: boolean = false;
  @Input() loanId: number = null;

  panelOpenState: boolean = true;
  enableEdit: boolean = false;
  hasAuthority: boolean = false;
  coappTitle: string = "";
  guarentorTitle: string = "";

  initialValues: UiFieldsDto = {};

  applicantLoanObligation: UiFields = {};
  coapplicantLoanObligation: UiFields = {};
  guarentorLoanObliation: UiFields = {};

  applicantLoanObligationMap: Array<any> = [];
  coapplicantLoanObligationMap: Array<any> = [];
  guarentorLoanObligationMap: Array<any> = [];

  constructor(
    private readonly uiConfigService: UiConfigService,
    private readonly snackBar: MatSnackBar,
    private readonly dependableFieldCheck: DependableFieldValidationService,
    private readonly loanReviewService: LoanReviewService,
    private readonly loanDetailService: KcreditLoanService,
    private readonly kcreditInterDataService: KcreditInterDataService
  ) {}
  ngOnChanges(): void {
    let loanDetails: KcreditLoanDetailsModel =
      this.loanDetailService.getLoanDetails();
    let co_applicants =
      this.kcreditInterDataService.getCoApplicant(loanDetails);
    let guarantors = this.kcreditInterDataService.getGuarantor(loanDetails);
    this.coappTitle = co_applicants[0]?.name
      ? `Co-Applicant 1 (${co_applicants[0]?.name}) Monthly loan obligation`
      : "Co-Applicant 1 Monthly loan obligation";
    this.guarentorTitle = guarantors[0]?.name
      ? `Guarentor 1 (${guarantors[0]?.name}) Monthly loan obligation`
      : "Guarentor 1 Monthly loan obligation";
  }

  ngOnInit(): void {
    this.editSections = false;
    this.uiConfigService
      .getUiInformationBySections(
        SECTION_INFORMATION.LOAN_OBLIGATOR_INCOME.sectionKey,
        this.loanId
      )
      .subscribe((response: UiFieldsDto) => {
        this.initialValues = cloneDeep(response);
        this.setUiData(response);
      });
    this.getUiConfiguration();
    let loanDetails: KcreditLoanDetailsModel =
      this.loanDetailService.getLoanDetails();
    let co_applicants =
      this.kcreditInterDataService.getCoApplicant(loanDetails);
    let guarantors = this.kcreditInterDataService.getGuarantor(loanDetails);
    this.coappTitle = co_applicants[0]?.name
      ? `Co-Applicant 1 (${co_applicants[0]?.name}) Monthly loan obligation`
      : "Co-Applicant 1 Monthly loan obligation";
    this.guarentorTitle = guarantors[0]?.name
      ? `Guarentor 1 (${guarantors[0]?.name}) Monthly loan obligation`
      : "Guarentor 1 Monthly loan obligation";
  }
  setUiData(uiData: UiFieldsDto): void {
    const subSections = uiData?.subSections ?? [];
    this.applicantLoanObligation = getSubsection(
      subSections,
      "Applicant monthly loan obligation"
    );
    this.coapplicantLoanObligation = getSubsection(
      subSections,
      "Co-Applicant monthly loan obligation"
    );
    this.guarentorLoanObliation = getSubsection(
      subSections,
      "Guarentor eligiblity criteria"
    );
  }

  getUiConfiguration(): void {
    this.uiConfigService
      .getUiConfigBySection(
        SECTION_INFORMATION.LOAN_OBLIGATOR_INCOME.sectionKey
      )
      .subscribe((response: any) => {
        const uiFieldsMap: any =
          this.uiConfigService.getUiConfigurationsBySection(
            response,
            SECTION_INFORMATION.LOAN_OBLIGATOR_INCOME.sectionKey,
            true
          );

        this.applicantLoanObligationMap = getSubsectionFields(
          uiFieldsMap,
          "Applicant monthly loan obligation"
        );
        this.coapplicantLoanObligationMap = getSubsectionFields(
          uiFieldsMap,
          "Co-Applicant monthly Loan Obligation"
        );
        this.guarentorLoanObligationMap = getSubsectionFields(
          uiFieldsMap,
          "Guarentor monthly loan obligation"
        );
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
    const applicantLoanObligation = this.uiConfigService.extractData(
      this.applicantLoanObligation
    );
    const coapplicantLoanObligation = this.uiConfigService.extractData(
      this.coapplicantLoanObligation
    );
    const guarentorLoanObliation = this.uiConfigService.extractData(
      this.guarentorLoanObliation
    );
    return {
      ...applicantLoanObligation,
      ...coapplicantLoanObligation,
      ...guarentorLoanObliation,
    };
  }

  save(event: Event): void {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
    const payload: any = this.getPayload();
    this.uiConfigService
      .updateUiFields(
        SECTION_INFORMATION.LOAN_OBLIGATOR_INCOME.apiKey,
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
