import { Component, Input, OnInit } from "@angular/core";
import { UiConfigService } from "../../services/ui-config.service";
import { SECTION_INFORMATION } from "src/app/constants/ui-config";
import { getProperty } from "src/app/utils/app.utils";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LoanReviewService } from "../../report/loan-review.service";
import { DependableFieldValidationService } from "../../dependable-field-validation.service";
import { AuthorizationService } from "../../services/authorization.service";
import { ApplicationStatus } from "../../loan/constant";


@Component({
  selector: 'app-collateral-maintenance-vehicle',
  templateUrl: './collateral-maintenance-vehicle.component.html'
})
export class CollateralMaintenanceVehicleComponent implements OnInit {
   @Input() loanId: number = null;
  @Input() editSections: boolean = false;

  panelOpenState: boolean = true;
  editDetails: boolean = false;
  collateralMaintaince: any = {};
  uiFieldsMap: Array<any> = [];
  initialSchedule: any = {};
  paymentSchedule: Array<any> = [];

  hasAuthority: boolean = false;

  constructor(
    private readonly uiConfigService: UiConfigService,
    private readonly snackBar: MatSnackBar,
    private readonly loanReviewService: LoanReviewService,
    private readonly dependableFieldCheck: DependableFieldValidationService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  ngOnInit(): void {
    this.hasAuthority =
      this.authorizationService.hasAuthority(
        SECTION_INFORMATION.COLLATERAL_MAINTENANCE_VEHICLE.authority
      ) &&
      [
        ApplicationStatus.agreementreceived,
        ApplicationStatus.disbursed,
      ].includes(this.loanReviewService.getLoanStatus());
    this.uiConfigService
      .getUiInformationBySections(
        SECTION_INFORMATION.COLLATERAL_MAINTENANCE_VEHICLE.sectionKey,
        this.loanId
      )
      .subscribe(
        (response: any) => {
          
          this.collateralMaintaince = getProperty(response, "fields", {});
          this.initialSchedule = JSON.parse(
            JSON.stringify(this.collateralMaintaince));
        },
        (error) => console.error(error)
      );

    this.uiConfigService
      .getUiConfigBySection(SECTION_INFORMATION.COLLATERAL_MAINTENANCE_VEHICLE.sectionKey)
      .subscribe((response: any = {}) => {
        const uiConfig = this.uiConfigService.getUiConfigurationsBySection(
          response,
          SECTION_INFORMATION.COLLATERAL_MAINTENANCE_VEHICLE.sectionKey,
          true
        );
        this.uiFieldsMap = getProperty(uiConfig, "uiFieldsMap", []);
      });
  }

   toggleEditDetails(event: Event) {
    event.stopPropagation();
    this.editDetails = !this.editDetails;
  }

  cancel(event: Event) {
    event.stopPropagation();
    this.editDetails = !this.editDetails;
    this.collateralMaintaince = JSON.parse(JSON.stringify(this.initialSchedule));
  }
  getPayload(): Object {
    const payload: Object = {};
    Object.keys(this.collateralMaintaince).forEach((key) => {
      const value = getProperty(this.collateralMaintaince[key], "value", null);
      payload[key] = value;
    });
    return payload;
  }

  save(event: Event) {
    event.stopPropagation();
    const payload = this.getPayload();
    this.uiConfigService
      .updateUiFields(
        SECTION_INFORMATION.COLLATERAL_MAINTENANCE_VEHICLE.apiKey,
        payload,
        this.loanId
      )
      .subscribe(
        (response: any) => {
          const applicationStatus: string =
            this.loanReviewService.getLoanStatus();
          this.dependableFieldCheck.getLoanStageCheck(
            response,
            this.loanId,
            applicationStatus
          );
          this.snackBar.open(`Updated successfully`, "", {
            duration: 3000,
          });
          this.editDetails = !this.editDetails;
          location.reload();
        },
        (error) => {
          console.error(error);
           this.collateralMaintaince = JSON.parse(
            JSON.stringify(this.initialSchedule)
          );
          const message: string = getProperty(error, "error.message", null);
          this.snackBar.open( message || `Error updating Collateral Maintaince Vehicle`, "Error", {
            duration: 4000,
          });
        }
      );
  }

}
