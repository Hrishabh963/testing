import { Component, Input, OnInit } from "@angular/core";
import { UiConfigService } from "../../services/ui-config.service";
import {
  SECTION_INFORMATION,
  UiFields,
  UiFieldsDto,
} from "src/app/constants/ui-config";
import { getProperty } from "src/app/utils/app.utils";
import { AuthorizationService } from "../../services/authorization.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LoanReviewService } from "../../report/loan-review.service";
import { DependableFieldValidationService } from "../../dependable-field-validation.service";

@Component({
  selector: "app-cb-data",
  templateUrl: "./cb-data.component.html",
  styleUrls: ["./cb-data.component.scss"],
})
export class CbDataComponent implements OnInit {
  @Input() loanId: number = null;
  @Input() editSections: boolean = false;

  enableEdit: boolean = false;
  canEdit: boolean = false;

  applicantCbReportData: any = {};
  coApplicantCbReportData: Array<any> = [];
  guarantorCbReportData: Array<any> = [];
  preSanctionData: any = {};
  uiFieldsMap: Array<any> = [];
  preSanctionMap: Array<any> = [];
  panelOpenState: boolean = true;
  initialResponse: any = {};

  constructor(
    private readonly uiConfigService: UiConfigService,
    private readonly authorizationService: AuthorizationService,
    private readonly snackBar: MatSnackBar,
    private readonly loanReviewService: LoanReviewService,
    private readonly dependableFieldCheck: DependableFieldValidationService
  ) {}

  ngOnInit(): void {
    this.uiConfigService
      .getUiInformationBySections(
        SECTION_INFORMATION.CREDIT_BUREAU_DATA.sectionKey,
        this.loanId
      )
      .subscribe((response) => {
        this.initialResponse = JSON.parse(JSON.stringify(response));
        this.setUiData(response);
      });

    this.uiConfigService
      .getUiConfigBySection(SECTION_INFORMATION.CREDIT_BUREAU_DATA.sectionKey)
      .subscribe((response: any = {}) => {
        const section = this.uiConfigService.getUiConfigurationsBySection(
          response,
          SECTION_INFORMATION.CREDIT_BUREAU_DATA.sectionKey,
          true
        );
        this.uiFieldsMap = getProperty(section, "uiFieldsMap", []);
        this.preSanctionMap = getProperty(section, "preSanction", []);
      });
    this.canEdit = this.hasEditAuthority();
  }

  setUiData(response: any = {}): void {
    const subsections: Array<any> = getProperty(response, "subSections", []);

    this.preSanctionData = subsections.find((subsection) => {
      const title: string = getProperty(subsection, "title", "");
      return title.toLowerCase().includes("pre sanction");
    });

    this.preSanctionData = getProperty(this.preSanctionData, "fields", {});

    this.applicantCbReportData = subsections.find((subsection) => {
      const title: string = getProperty(subsection, "title", "");
      return title.toLowerCase().includes("applicant");
    });

    this.coApplicantCbReportData = subsections.find((subsection) => {
      const title: string = getProperty(subsection, "title", "");
      return title.toLowerCase().includes("co_applicants");
    });

    this.coApplicantCbReportData = getProperty(
      this.coApplicantCbReportData,
      "subSections",
      []
    );

    this.guarantorCbReportData = subsections.find((subsection) => {
      const title: string = getProperty(subsection, "title", "");
      return title.toLowerCase().includes("guarantors");
    });

    this.guarantorCbReportData = getProperty(
      this.guarantorCbReportData,
      "subSections",
      []
    );
  }

  toggleEditDetails(event: Event): void {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
  }

  cancel(event: Event): void {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
    const response = JSON.parse(JSON.stringify(this.initialResponse));
    this.setUiData(response);
  }

  getPayload(): Object {
    const payload: Object = {};
    payload["applicant"] = this.uiConfigService.extractData(
      this.applicantCbReportData?.fields
    );
    if (this.coApplicantCbReportData.length > 0) {
      payload["coApplicants"] = this.coApplicantCbReportData
        .map((reportData: UiFieldsDto) => {
          const fields: UiFields = reportData?.fields ?? {};
          return this.uiConfigService.extractData(fields);
        })
        .filter((reportData) => {
          return Object.keys(reportData).length > 0;
        });
    }
    if (this.guarantorCbReportData.length > 0) {
      payload["coGuarantors"] = this.guarantorCbReportData
        .map((reportData: UiFieldsDto) => {
          const fields: UiFields = reportData?.fields ?? {};
          return this.uiConfigService.extractData(fields);
        })
        .filter((reportData) => {
          return Object.keys(reportData).length > 0;
        });
    }
    return payload;
  }

  save(event: Event): void {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
    const payload: any = this.getPayload();
    this.uiConfigService
      .updateUiFields(
        SECTION_INFORMATION.CREDIT_BUREAU_DATA.apiKey,
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
          const response = JSON.parse(JSON.stringify(this.initialResponse));
          this.setUiData(response);
          this.snackBar.open(`Error updating Credit Bureau Data`, "", {
            duration: 3000,
          });
        }
      );
  }

  hasEditAuthority(): boolean {
    return this.authorizationService.hasAuthority(
      SECTION_INFORMATION.CREDIT_BUREAU_DATA.authority
    );
  }
}
