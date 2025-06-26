import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { get } from "lodash";
import { BehaviorSubject } from "rxjs";
import { PrincipalService } from "src/app/core";
import { DataItem } from "src/app/entities/kaleido-credit/genreport/DataItem.model";
import {
  LOAN_APPLICATION_DETAILS,
  createSelectAllObjects,
} from "src/app/entities/kaleido-credit/genreport/kicredit-report.constants";
import { MatSelectOption } from "src/app/entities/kaleido-credit/loan/constant";
import { Partners } from "src/app/entities/kaleido-credit/models/partners/partners.model";
import { formattedDateForDateUtils } from "src/app/shared";
import { CustomValidator } from "src/app/shared/validations/custom.validation";
import { getProperty } from "src/app/utils/app.utils";
import { DownloadLoanReportPopupComponent } from "../../../genreport/download-loan-report-popup/download-loan-report-popup.component";
import { ReportGenerationService } from "../../../genreport/kcredit-reportgen.service";
import { AssociateLenderService } from "../../../services/associate-lender/associate-lender.service";

const DEFAULT_SELECTION_VALUE = {
  viewValue: "",
  value: "",
  reportTableValue: "",
};
@Component({
  selector: "app-reports-filter",
  templateUrl: "./reports-filter.component.html",
  styleUrls: ["./reports-filter.component.scss"],
})
export class ReportsFilterComponent implements OnInit {
  config: BehaviorSubject<any> = new BehaviorSubject<any>({});
  form: FormGroup;

  purposeList: MatSelectOption[] = [];
  reportTypeOptions: DataItem[] = [];
  loanTypeOptions: DataItem[];
  partnerListOptions: Partners[] = [];
  statusMenus: any = [];
  selectedReport: MatSelectOption = DEFAULT_SELECTION_VALUE;
  selectedReports: MatSelectOption[] = []; // Added for multi-select support
  selectedPartners: Partners[] = [];
  selectedLoanType: DataItem[] = [];
  startDate: any = "";
  endDate: any = "";
  selectedPurpose: string = null;
  selectedStatus: any = {};
  canSelectMultipleReportType: boolean = false; // Flag to control single/multiple selection

  maxDate = new Date();
  minDate = new Date(2018, 1, 1);

  // MetaData
  internalReports: any = [];
  externalReports: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly lenderService: AssociateLenderService,
    private readonly reportGenerationService: ReportGenerationService,
    private readonly dialog: MatDialog,
    private readonly snackbar: MatSnackBar,
    private readonly fb: FormBuilder,
    private readonly customValidator: CustomValidator,
    private readonly dialogRef: MatDialogRef<ReportsFilterComponent>,
    private readonly principalSerivce: PrincipalService
  ) {
    // Setup form
    this.form = this.fb.group(
      {
        reportType: [[], [Validators.required]],
        loanType: [[], [Validators.required]],
        partners: [[], [Validators.required]],
        startDateField: [null, [Validators.required]],
        endDateField: [null, [Validators.required]],
        purpose: [{}, [Validators.required]],
      },
      {
        validators: customValidator.dateRangeValidator(
          "startDateField",
          "endDateField"
        ),
      }
    );
  }

  ngOnInit(): void {
    this.config.next(this.data?.prop1?.getValue());
    this.config.subscribe((uiConfig) => {
      this.purposeList = get(uiConfig, "purpose", []);
      this.internalReports = get(uiConfig, "internalReportTypes", []);
      this.externalReports = get(uiConfig, "externalReportTypes", []);
      this.statusMenus = get(uiConfig, "status", []);

      // Handle Loan Types with single option
      let loanTypes = get(uiConfig, "loanTypes", []);
      this.loanTypeOptions = createSelectAllObjects(loanTypes);

      // If there's only one loan type, select it by default and disable the field
      if (this.loanTypeOptions.length === 1) {
        this.selectedLoanType = [this.loanTypeOptions[0]];
        this.form.get("loanType").setValue(this.selectedLoanType);
        this.form.get("loanType").disable();
      }

      // Get the flag for multi-select from config
      this.canSelectMultipleReportType = get(
        uiConfig,
        "canSelectMultipleReportType",
        false
      );

      if (this.purposeList.length) {
        const defaultPurpose = this.purposeList.find(
          (purpose) => purpose?.isDefault
        );
        if (defaultPurpose) {
          this.updatePurpose(defaultPurpose?.value);
        }
      }
    });

    this.lenderService.getPartnersLinked().subscribe(
      (partners) => {
        console.log(partners);
        this.partnerListOptions = partners;

        // If there's only one partner, select it by default and disable the field
        if (this.partnerListOptions.length === 1) {
          this.selectedPartners = [this.partnerListOptions[0]];
          this.form.get("partners").setValue(this.selectedPartners);
          this.form.get("partners").disable();
        }
      },
      (error) => console.error(error)
    );
  }

  updatePurpose(selectedPurpose: string) {
    this.selectedPurpose = selectedPurpose;
    this.form.get("purpose").setValue(selectedPurpose);
    let reportTypes = [];
    switch (selectedPurpose) {
      case "internal":
        reportTypes = this.internalReports;
        break;
      case "external":
        reportTypes = this.externalReports;
        break;
      case "error":
        console.log("error");
        break;
      default:
        reportTypes = [];
        break;
    }
    this.reportTypeOptions = reportTypes.filter((reportType) => {
      const roles: string[] = getProperty(reportType, "roles", []);
      if (roles?.length) {
        return roles.includes(this.principalSerivce.getUserRole());
      }
      return true;
    });
    const defaultReport = this.reportTypeOptions.find(
      (report) => report?.isDefault
    );
    if (defaultReport) {
      if (this.canSelectMultipleReportType) {
        this.selectedReports = [defaultReport];
        this.form.get("reportType").setValue([defaultReport]);
      } else {
        this.selectedReport = defaultReport;
        this.form.get("reportType").setValue(defaultReport);
      }

      // Check for data dump flag in the first selected report
      let isDataDump = false;
      if (this.canSelectMultipleReportType) {
        isDataDump = this.selectedReports.length > 0 && this.selectedReports[0].isDataDump;
      } else {
        isDataDump = this.selectedReport?.isDataDump || false;
      }

      if (isDataDump) {
        this.form.get("loanType").disable();
        this.form.get("partners").disable();
        this.form.get("startDateField").disable();
        this.form.get("endDateField").disable();
      }
    }
  }

  handleReportSelectionChange(selection: any) {
    if (this.canSelectMultipleReportType) {
      this.selectedReports = selection;
      
      // Check if the first selected report is a data dump
      if (this.selectedReports.length > 0 && this.selectedReports[0].isDataDump) {
        this.form.get("loanType").disable();
        this.form.get("partners").disable();
        this.form.get("startDateField").disable();
        this.form.get("endDateField").disable();
      } else {
        if (!this.form.get("loanType").disabled && this.loanTypeOptions.length !== 1) {
          this.form.get("loanType").enable();
        }
        if (!this.form.get("partners").disabled && this.partnerListOptions.length !== 1) {
          this.form.get("partners").enable();
        }
        this.form.get("startDateField").enable();
        this.form.get("endDateField").enable();
      }
    } else {
      this.selectedReport = selection;
      
      // Check if selected report is a data dump
      if (this.selectedReport?.isDataDump) {
        this.form.get("loanType").disable();
        this.form.get("partners").disable();
        this.form.get("startDateField").disable();
        this.form.get("endDateField").disable();
      } else {
        if (!this.form.get("loanType").disabled && this.loanTypeOptions.length !== 1) {
          this.form.get("loanType").enable();
        }
        if (!this.form.get("partners").disabled && this.partnerListOptions.length !== 1) {
          this.form.get("partners").enable();
        }
        this.form.get("startDateField").enable();
        this.form.get("endDateField").enable();
      }
    }
  }

  // This method is kept for backward compatibility
  getSelectedReport() {
    if (this.canSelectMultipleReportType) {
      return this.selectedReports;
    }
    return this.selectedReport;
  }

  enableStatusMenu() {
    const isInternalPurpose = this.selectedPurpose === "internal";
    const requiredItems = [
      LOAN_APPLICATION_DETAILS,
      "CKYC",
      "GENERATE_LOAN_APPLICATION_REPORT",
    ];
  
    if (!isInternalPurpose) {
      return false;
    }
    
    // Check based on selection mode
    if (this.canSelectMultipleReportType) {
      // Multi-select mode - check if any selected report matches required items
      return this.selectedReports.length > 0 && requiredItems.some(item => 
        this.selectedReports[0].value?.includes(item)
      );
    } else {
      // Single-select mode
      return this.selectedReport && requiredItems.some(item => 
        this.selectedReport.value?.includes(item)
      );
    }
  }
  
  updateSelectedStatus(status: any) {
    this.selectedStatus = status;
  }

  updateDate(dateObject = {}, dateKey = "startDate") {
    this[dateKey] = dateObject["value"];
  }
  generateReport() {
    let statuses = [];
  
    // Generate status array
    if (!this.selectedStatus.length) {
      if (this.canSelectMultipleReportType) {
        if (this.selectedReports.length > 0) {
          statuses = [
            this.selectedReports[0].viewValue.includes("Upload")
              ? "TO_BE_PICKED_UP"
              : "READY_FOR_UPDATE",
          ];
        } else {
          statuses = ["READY_FOR_UPDATE"]; // Default value if no reports selected
        }
      } else {
        statuses = [
          this.selectedReport?.viewValue?.includes("Upload")
            ? "TO_BE_PICKED_UP"
            : "READY_FOR_UPDATE",
        ];
      }
    } else {
      statuses = this.selectedStatus.map((status) =>
        this.fetchStatusValue(status)
      );
    }
  
    // Build base filterParams
    let filterParams: any = {
      startDate: formattedDateForDateUtils(this.startDate),
      endDate: formattedDateForDateUtils(this.endDate),
      purpose: this.selectedPurpose,
      loanTypes: this.selectedLoanType?.map((customerType) =>
        getProperty(customerType, "name", "")
      ),
      status: statuses,
      selectedPartners: this.selectedPartners.map((data) =>
        getProperty(data, "id", null)
      ),
      selectedPartnersNames: this.selectedPartners.map((data) =>
        getProperty(data, "name", null)
      ),
    };
  
    // Set loanReportTypes based on selected reports
    if (this.selectedReports?.length > 0) {
      // Extract report types from all selected reports
      filterParams.loanReportTypes = this.selectedReports.map(report => report.value);
    } else if (this.selectedReport) {
      // Extract report type from single selected report
      filterParams.loanReportTypes = [this.selectedReport.value];
    } else {
      // Fallback if no reports selected
      filterParams.loanReportTypes = ["LoanApplicationDetails"];
    }
  
    // Handle multi-select or single-select cases for other parameters
    let openDialog = false;
    let reportTypes = null;
  
    if (this.canSelectMultipleReportType) {
      if (this.selectedReports.length > 0) {
        const firstReport = this.selectedReports[0];
        // Add report information
        filterParams.selectedReport = firstReport.value;
        filterParams.selectedReportText = firstReport.reportTableValue;
        filterParams.allSelectedReports = this.selectedReports.map(
          (report) => report.value
        );
        filterParams.allSelectedReportTexts = this.selectedReports.map(
          (report) => report.reportTableValue
        );
        
        // Get dialog properties from first report
        openDialog = getProperty(firstReport, "openDownloadPopup", false);
        reportTypes = getProperty(firstReport, "reportTypes", null);
      }
    } else {
      // Single-select case
      if (this.selectedReport) {
        filterParams.selectedReport = this.selectedReport.value;
        filterParams.selectedReportText = this.selectedReport.reportTableValue;
        
        // Get dialog properties
        openDialog = getProperty(this.selectedReport, "openDownloadPopup", false);
        reportTypes = getProperty(this.selectedReport, "reportTypes", null);
      }
    }
  
    // Handle dialog or direct report generation
    if (openDialog) {
      const dialogRef = this.dialog.open(DownloadLoanReportPopupComponent, {
        width: "40vw",
        data: {
          reports: reportTypes,
        },
      });
      dialogRef.afterClosed().subscribe((response) => {
        filterParams.downloadReportType = [response];
        this.fetchReports(filterParams);
      });
    } else {
      this.fetchReports(filterParams);
    }
  }
  
  fetchReports(requestsParams: any) {
    this.reportGenerationService.generateLoanReports(requestsParams).subscribe(
      () => {
        this.data.callback({
          reportType: getProperty(requestsParams, "selectedReport", ""),
          size: 1,
          successMessage: "Reports Generated Successfully",
        });
        this.dialogRef.close(this.form.value);
      },
      (error) => {
        let errorResponse: any = getProperty(error, "error", "{}");
        errorResponse = JSON.parse(errorResponse);
        this.snackbar.open(getProperty(errorResponse, "message", "Error"), "", {
          duration: 5000,
        });
      }
    );
  }
  
  checkForLoanApplicationDownload() {
    // Check for internal purpose
    const isInternalPurpose = this.selectedPurpose === "internal";
    
    // Check if selected status has entries
    const hasSelectedStatus = this.selectedStatus?.length > 0;
    
    // Check for valid report based on selection mode
    let hasValidReport = false;
    if (this.canSelectMultipleReportType) {
      // Multi-select mode - check the first selected report
      hasValidReport = this.selectedReports.length > 0 && 
        this.selectedReports[0]?.value?.includes(LOAN_APPLICATION_DETAILS);
    } else {
      // Single-select mode
      hasValidReport = this.selectedReport?.value?.includes(LOAN_APPLICATION_DETAILS);
    }
  
    // Return true only if all conditions are met
    return isInternalPurpose && hasValidReport && hasSelectedStatus;
  }

  fetchStatusValue(status: any) {
    const statusValue = getProperty(status, "value", "");
  
    // First check if it's a success status
    if ("Success".includes(status?.viewValue)) {
      // Check if we're in multi-select mode (array) or single-select mode (object)
      if (this.canSelectMultipleReportType) {
        // Multi-select mode - check the first selected report
        const firstReport = this.selectedReports.length > 0 ? this.selectedReports[0] : null;
        if (firstReport?.viewValue?.includes("Upload")) {
          return statusValue;
        }
      } else {
        // Single-select mode
        if (this.selectedReport?.viewValue?.includes("Upload")) {
          return statusValue;
        }
      }
      
      // If not an upload report or no report selected
      return "SENT_IN_UPDATE_FILE";
    }
  
    // Default case - return the original status value
    return statusValue;
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
}