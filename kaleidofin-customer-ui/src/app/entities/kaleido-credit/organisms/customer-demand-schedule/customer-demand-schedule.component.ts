import { Component, Input, OnInit } from "@angular/core";
import { UiConfigService } from "../../services/ui-config.service";
import {
  SECTION_INFORMATION,
  UiField,
  UiFieldsDto,
} from "src/app/constants/ui-config";
import { getProperty } from "src/app/utils/app.utils";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthorizationService } from "../../services/authorization.service";
import { ApplicationStatus } from "../../loan/constant";
import { LoanReviewService } from "../../report/loan-review.service";

@Component({
  selector: "app-customer-demand-schedule",
  templateUrl: "./customer-demand-schedule.component.html",
  styleUrls: ["./customer-demand-schedule.component.scss"],
})
export class CustomerDemandScheduleComponent implements OnInit {
  @Input() loanId: number = null;
  @Input() editSections: boolean = false;

  hasError: boolean = false;
  emiType: string = null;
  finalLoanAmount: number = null;
  panelOpenState: boolean = true;
  editDetails: boolean = false;
  demandSchedule: any = {};
  initialSchedule: any = {};
  paymentSchedule: Array<any> = [];
  initialPaymentSchedule: Array<any> = [];
  uiFieldsMap: Array<any> = [];
  hasAuthority: boolean = false;
  disableEditOnCall: boolean = false;
  isStaggered: boolean = false;
  principalAmountException: string = null;
  repaymentScheduleError: string = null;
  hasTenureError: boolean = false;
  constructor(
    private readonly uiConfigService: UiConfigService,
    private readonly snackBar: MatSnackBar,
    private readonly authorizationService: AuthorizationService,
    private readonly loanReviewService: LoanReviewService
  ) {}

  ngOnInit(): void {
    this.hasAuthority =
      this.authorizationService.hasAuthority(
        SECTION_INFORMATION.DEMAND_SCHEDULE.authority
      ) &&
      this.loanReviewService.getLoanStatus() !==
        ApplicationStatus.pendingagreement;
    this.uiConfigService
      .getUiInformationBySections(
        SECTION_INFORMATION.DEMAND_SCHEDULE.sectionKey,
        this.loanId
      )
      .subscribe(
        (response: any) => {
          const subSection: Array<any> = getProperty(
            response,
            "subSections",
            []
          );
          this.setUiFields(subSection);
        },
        (error) => console.error(error)
      );

    this.uiConfigService
      .getUiConfigBySection(SECTION_INFORMATION.DEMAND_SCHEDULE.sectionKey)
      .subscribe((response: any = {}) => {
        const uiConfig = this.uiConfigService.getUiConfigurationsBySection(
          response,
          SECTION_INFORMATION.DEMAND_SCHEDULE.sectionKey,
          true
        );
        this.uiFieldsMap = getProperty(uiConfig, "uiFieldsMap", []);
      });
  }

  getError(errorExceptionList: Array<any>, field: string): string {
    return (
      errorExceptionList.find((error) => {
        return error?.exceptionFieldName === field;
      })?.exceptionMessage ?? null
    );
  }

  setUiFields(subSection: Array<any>, isRecalculate: boolean = false): void {
    const paymentScheduleField = getProperty(subSection[1], "fields", {});
    this.paymentSchedule = getProperty(
      paymentScheduleField,
      "repaymentScheduleList.value",
      []
    );

    const repaymentTableExceptions: Array<any> = getProperty(
      paymentScheduleField,
      "exceptionMessageHandler.value",
      []
    );
    this.principalAmountException = this.getError(
      repaymentTableExceptions,
      "principalAmount"
    );
    this.repaymentScheduleError = this.getError(
      repaymentTableExceptions,
      "repaymentScheduleError"
    );
    this.demandSchedule = getProperty(subSection[0], "fields", {});
    this.emiType = getProperty(this.demandSchedule, "emiType.value", null);
    this.isStaggered = this.emiType?.toLowerCase() === "non-emi";
    this.finalLoanAmount = getProperty(
      this.demandSchedule,
      "finalLoanAmount.value",
      null
    );
    this.hasTenureError = false;
    const exceptions: UiField = getProperty(
      subSection?.[0],
      "fields.exceptionMessageHandler",
      {}
    );
    const exceptionList = exceptions?.value ?? [];

    if (exceptionList.length > 0 || repaymentTableExceptions.length > 0) {
      this.hasError = true;
    } else {
      this.hasError = false;
    }

    if (exceptionList.length > 0) {
      Object.keys(this.demandSchedule).forEach((key) => {
        const error = exceptionList.find((error) => {
          return error?.exceptionFieldName === key;
        });
        if (error) {
          this.demandSchedule[key].error = error?.exceptionMessage ?? null;
        } else {
          delete this.demandSchedule[key].error;
        }
      });
    }
    if (!isRecalculate && !this.hasError) {
      this.initialSchedule = JSON.parse(JSON.stringify(this.demandSchedule));
      this.initialPaymentSchedule = JSON.parse(
        JSON.stringify(this.paymentSchedule)
      );
    }
  }

  toggleEditDetails(event: Event) {
    event.stopPropagation();
    this.editDetails = !this.editDetails;
  }

  cancel(event: Event) {
    event.stopPropagation();
    this.editDetails = !this.editDetails;
    this.demandSchedule = JSON.parse(JSON.stringify(this.initialSchedule));
    this.paymentSchedule = JSON.parse(
      JSON.stringify(this.initialPaymentSchedule)
    );
    this.hasTenureError = false;
    this.repaymentScheduleError = null;
    this.principalAmountException = null;
  }

  getPayload(index: Event | number): Object {
    const payload: Object = {};
    Object.keys(this.demandSchedule).forEach((key) => {
      const value = getProperty(this.demandSchedule[key], "value", null);
      payload[key] = value;
    });

    if (
      this.emiType?.toLowerCase() === "non-emi" &&
      typeof index === "number"
    ) {
      payload["emiAmount"] = this.paymentSchedule[index]?.emiAmount;
      payload["emiStartDate"] =
        index === 0
          ? this.paymentSchedule[index]?.dueDate
          : this.demandSchedule?.emiStartDate?.value;
      payload["demandNumber"] = this.paymentSchedule[index]?.demandNumber;
      payload["isNewTempTable"] =
        this.demandSchedule?.isNewTempTable?.value ?? "No";
    }
    return payload;
  }

  save(event: Event | number, closeEdit: boolean = false) {
    this.disableEditOnCall = true;
    if (event instanceof Event) {
      event?.stopPropagation();
    }
    const payload = this.getPayload(event);
    this.uiConfigService
      .updateUiFields(
        SECTION_INFORMATION.DEMAND_SCHEDULE.apiKey,
        payload,
        this.loanId
      )
      .subscribe(
        (response: any) => {
          this.onSuccess(event, response, closeEdit);
        },
        (error) => {
          this.onError(error);
        }
      );
  }

  onError(error: any): void {
    console.error(error);
    this.snackBar.open(
      getProperty(error, "error.message", `Error updating Demand Schedule`),
      "Error",
      {
        duration: 5000,
      }
    );
    this.disableEditOnCall = false;
  }

  onSuccess(
    event: Event | number,
    response: any,
    closeEdit: boolean,
    isRecalculate: boolean = false
  ): void {
    this.disableEditOnCall = false;
    const sectionDTO: UiFieldsDto = getProperty(response, "sectionDto", {});
    const subsection: Array<UiFieldsDto> = sectionDTO?.subSections ?? [];
    this.setUiFields(subsection, isRecalculate);
    this.editDetails = !closeEdit || this.hasError;
    const snackbarMessage: string = this.hasError
      ? "Please check the fields for error."
      : "Updated successfully";
    this.snackBar.open(snackbarMessage, this.hasError ? "Error" : "", {
      duration: 4000,
    });
    if (event instanceof Event && !this.editDetails) {
      location.reload();
    }
  }

  recalculateDemandSchedule(event: Event | number): void {
    if (event instanceof Event) {
      event?.stopPropagation();
    }
    const payload = this.getPayload(event);
    this.uiConfigService
      .recalculateDemandSchedule(this.loanId, payload)
      .subscribe(
        (response: any) => {
          this.onSuccess(event, response, false, true);
        },
        (error) => {
          this.onError(error);
        }
      );
  }

  showTenureError(hasError: boolean): void {
    this.hasTenureError = hasError;
    this.hasError = hasError || this.hasError;
  }

  checkError(hasError: boolean): void {
    this.hasError = hasError || this.hasError;
  }

}
