import { DatePipe } from "@angular/common";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { UI_COMPONENTS } from "src/app/constants/ui-config";
import {
  GENERATE_LOAN_REPORTS,
  GET_KCREIDT_LOAN_REPORTS,
} from "src/app/shared/constants/Api.constants";
import { getProperty, getUiConfig } from "src/app/utils/app.utils";
import { DataItem } from "../genreport/DataItem.model";
import {
  LOAN_APPLICATION_DETAILS,
  createSelectAllObjects,
} from "../genreport/kicredit-report.constants";
import { MatSelectOption, REPORT_TYPE_JOB_NAME_MAP } from "../loan/constant";
import { Partner } from "../models/partner.model";
import { Partners } from "../models/partners/partners.model";
import { AssociateLenderService } from "./associate-lender/associate-lender.service";
import { PartnersService } from "./partner/partners.service";
import { UiConfigService } from "./ui-config.service";

@Injectable({
  providedIn: "root",
})
export class GenerateReportsService {
  form: FormGroup;
  searchParams: any = {};

  selectedPurpose: MatSelectOption = { viewValue: "", value: "" };
  selectedReport: DataItem[] = [];
  selectedPartners: Partner[] = [];
  selectedLoanType: string[] = [];
  selectedStatus: Array<any> = [];

  purposeList: MatSelectOption[] = [];
  reportTypeOptions: DataItem[] = [];
  partnerList: Partner[] = [];
  loanTypes: string[] = [];
  internalReports: any = {};
  externalReports: any = {};

  constructor(
    private readonly datePipe: DatePipe,
    private readonly partnerService: PartnersService,
    private readonly associateLenderService: AssociateLenderService,
    private readonly http: HttpClient,
    private readonly uiConfigService: UiConfigService
  ) {
    this.form = new FormGroup({
      reportType: new FormControl(),
      loanTypes: new FormControl(),
      partners: new FormControl(),
    });
    this.retrivePartners();

    this.uiConfigService
      .getUiConfigBySection(
        UI_COMPONENTS.LOAN_REPORTS,
        UI_COMPONENTS.LOAN_REPORTS
      )
      .subscribe(
        (configs: any) => {
          let reportsConfig = getUiConfig(configs);
          this.internalReports = getProperty(
            reportsConfig,
            "internalReportTypes",
            {}
          );
          this.externalReports = getProperty(
            reportsConfig,
            "externalReportTypes",
            {}
          );

          this.purposeList = getProperty(reportsConfig, "purpose", {});
          this.reportTypeOptions = createSelectAllObjects(
            { ...this.internalReports, ...this.externalReports },
            true
          );
        },
        (error) => console.error(error)
      );
  }

  setLoanTypes(loanTypes: string[] = []) {
    this.loanTypes = loanTypes;
  }
  getLoanTypes() {
    return this.loanTypes;
  }
  setPurpose(purpose: MatSelectOption) {
    this.selectedPurpose = purpose;
  }

  setLoanApplicationStatus(status: Array<any> = []) {
    this.selectedStatus = status;
  }

  updateReportTypeOptions(purpose: MatSelectOption) {
    let reportTypes = [];
    switch (purpose.value) {
      case "internal":
        reportTypes = createSelectAllObjects(this.internalReports, true);
        break;
      case "external":
        reportTypes = createSelectAllObjects(this.externalReports, true);
        break;
      default:
        reportTypes = [];
        break;
    }
    return reportTypes;
  }

  retrivePartners() {
    this.partnerService.queryKCreditPartners().subscribe(
      (partner: Response) => this.updatePartnerList(partner),
      (error: Response) => this.onError(error)
    );
  }

  private updatePartnerList(partner: any = []) {
    if (partner) {
      this.partnerList = partner.filter(
        (p: Partners) => p.kaleidoCreditConfiguration != null
      );
    }
  }

  private onError(error) {
    console.log(error);
  }

  setSearchParams(searchParams: any = {}) {
    this.searchParams = searchParams;
  }

  getSearchParams(){
    return this.searchParams;
  }

  resetStates() {
    this.searchParams = {};
    this.selectedPurpose = { viewValue: "", value: "" };
    this.selectedReport = [];
    this.selectedPartners = [];
    this.selectedLoanType = [];
    this.selectedStatus = [];
  }

  enableStatusMenu(
    selectedPurpose: MatSelectOption = this.selectedPurpose,
    selectedReports: DataItem[] = this.selectedReport,
    checkForSelectedStatus: boolean = false
  ) {
    if (!selectedPurpose || !selectedReports) {
      return false;
    }
    let enableMenu =
      selectedPurpose.value === "internal" &&
      selectedReports.some((item) =>
        item.name.includes(LOAN_APPLICATION_DETAILS)
      );

    if (checkForSelectedStatus) {
      enableMenu = enableMenu && !!this.selectedStatus.length;
    }
    return enableMenu;
  }

  generateNewReport(
    form: FormGroup,
    additionalParameters: any = {}
  ): Observable<any> {
    let params = this.createRequestOption(form, additionalParameters);
    return this.http.get(GENERATE_LOAN_REPORTS, {
      observe: "response",
      params,
    });
  }
  getKCreditReports(
    searchParams: any,
    paginationParams: any = {}
  ): Observable<any> {
    let params = this.createKCreditReportspayload(
      searchParams,
      paginationParams
    );
    return this.http.get(GET_KCREIDT_LOAN_REPORTS, {
      observe: "response",
      params,
    });
  }
  private createRequestOption(
    form: FormGroup,
    additionalParameters: any = {}
  ): HttpParams {
    let params = new HttpParams();

    if (!form?.value) return params;

    const formValue = form.value;

    let reportType = formValue.reportType
      ? formValue.reportType
          ?.map((data: DataItem) => {
            if (data.name.includes("Loan")) return "LoanApplicationDetails";
            if (data.name.includes("Penny Drop")) return "PennyDrop";
            return data.name;
          })
          .join(",")
      : null;
    const mappings = {
      fromDate: this.formatDate(formValue.startDate),
      toDate: this.formatDate(formValue.endDate),
      partnerIds: formValue.partner
        ? formValue.partner?.map((partner) => partner?.id)?.join(",")
        : null,
      loanTypeEnums: formValue.loanType ? formValue.loanType.join(",") : null,
      loanReportTypes: reportType,
      purpose: formValue.purpose?.value,
      downloadReportType: additionalParameters?.downloadReportType,
      statuses:
        formValue.purpose?.value === "internal" && reportType?.includes("Loan")
          ? additionalParameters?.status
          : null,
      lendingPartnerCode: this.associateLenderService.getLenderCode(),
    };

    // Append only non-null and non-undefined values
    Object.keys(mappings).forEach((key) => {
      const value = mappings[key];
      if (value !== undefined && value !== null && value !== "") {
        params = params.append(key, value);
      }
    });

    // Append any additional query parameters
    if (formValue.query) {
      Object.keys(formValue.query).forEach((key) => {
        const value = formValue.query[key];
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          value !== 0
        ) {
          params = params.append(key, value);
        }
      });
    }

    return params;
  }

  createKCreditReportspayload(
    searchParams: any,
    paginationParams: any = {}
  ): HttpParams {
    let params = new HttpParams();
    let reportType = searchParams?.selectedReport
      ? searchParams?.selectedReport
          ?.map((data: DataItem) => {
            if (data.name.includes("Loan")) return "GenerateLoanDocuments";
            return REPORT_TYPE_JOB_NAME_MAP[data.name];
          })
          .join(",")
      : null;
    const mappings = {
      fromDate: this.formatDate(searchParams?.fromDate),
      toDate: this.formatDate(searchParams.toDate),
      loanType: searchParams.selectedLoanType
        ? searchParams.selectedLoanType.join(",")
        : null,
      partnerIds: searchParams.selectedPartners
        ? searchParams.selectedPartners
            ?.map((partner) => partner?.id)
            ?.join(",")
        : null,
      jobNames: reportType,
      searchParam: searchParams.searchValue,
      page: paginationParams.page,
      size: paginationParams.size,
      sort: paginationParams.sort,
    };

    // Append only non-null and non-undefined values
    Object.keys(mappings).forEach((key) => {
      const value = mappings[key];
      if (value !== undefined && value !== null && value !== "") {
        params = params.append(key, value);
      }
    });

    return params;
  }
  formatDate(date: Date | null): string | null {
    return date ? this.datePipe.transform(date, "yyyy-MM-dd") : null;
  }
}
