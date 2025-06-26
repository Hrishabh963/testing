import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { get } from "lodash";
import { Observable } from "rxjs";
import {
  KALEIDO_SERVER_API_URL
} from "src/app/app.constants";
import { formattedDateForDateUtils } from "src/app/shared";
import {
  DOWNLOAD_LOAN_REPORTS,
  GENERATE_REPORTS,
  REPORTS,
} from "src/app/shared/constants/Api.constants";
import { getProperty } from "src/app/utils/app.utils";
import { AssociateLenderService } from "../services/associate-lender/associate-lender.service";

@Injectable()
export class ReportGenerationService {
  constructor(
    private readonly http: HttpClient,
    private readonly lenderService: AssociateLenderService
  ) { }

  query(req?: any): Observable<any> {
    req.appliedFromDate = formattedDateForDateUtils(req.search.appliedFromDate);
    req.appliedToDate = formattedDateForDateUtils(req.search.appliedToDate);
    req.selectedPartners = req.search.selectedPartners;
    req.selectedCustomerType = req.search.customerTypes;
    req.selectedReportType = req.search.selectedReport;

    let params = this.createRequestOption(req);
    return this.http.get(
      `${KALEIDO_SERVER_API_URL}api/backoffice/generateLoanReport`,
      {
        observe: "response",
        params,
      }
    );
  }

  private createRequestOption(req?: any): HttpParams {
    let params: HttpParams = new HttpParams();
    if (req) {
      this.helperFunction(params, req.appliedFromDate, "fromDate");
      this.helperFunction(params, req.appliedToDate, "toDate");
      this.helperFunction(params, req.selectedPartners, "partnerIds");
      this.helperFunction(params, req.selectedCustomerType, "loanTypeEnums");
      this.helperFunction(params, req.selectedReportType, "loanReportTypes");
      this.helperFunction(params, req.page, "page");
      this.helperFunction(params, req.size, "size");

      let purpose = get(req, "purpose", null);
      let downloadReportType = get(req, "downloadReportType", null);
      let status = get(req, "status", null);
      this.helperFunction(params,purpose,"purpose")
      if (purpose === "internal" && req.selectedReportType.includes("Loan")) {
        this.helperFunction(params, status, "statuses")
        this.helperFunction(params,downloadReportType,"downloadReportType")
      }
      params = params.append(
        "lendingPartnerCode",
        this.lenderService.getLenderCode()
      );
      for (const key in req.query) {
        if (req.query[key] !== "" || req.query[key] !== 0) {
          params = params.append(key, req.query[key]);
        }
      }
    }
    return params;
  }

  helperFunction(params, req, str) {
    let temp=params;
    if (req) {
      temp = params.append(str, req);
    }
    return temp;
  }

  downloadLoanReports(
    loanApplicationIds: string,
    downloadReportType: string
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append("loanIds", loanApplicationIds);
    params = params.append("downloadReportType", downloadReportType);
    params = params.append(
      "lendingPartnerCode",
      this.lenderService.getLenderCode()
    );
    return this.http.get(`${KALEIDO_SERVER_API_URL}${DOWNLOAD_LOAN_REPORTS}`, {
      params,
    });
  }

  generateLoanReports(requestFilter: any = {}) {
    const requestBody = {
      purpose: getProperty(requestFilter, "purpose", ""),
      type: getProperty(requestFilter, "selectedReport", ""),
      requestFilter: {
        partnerId: getProperty(requestFilter, "selectedPartners", []),
        loanType: getProperty(requestFilter, "loanTypes", []),
        startDate: getProperty(requestFilter, "startDate", []),
        endDate: getProperty(requestFilter, "endDate", []),
        status: getProperty(requestFilter, "status", []),
        downloadReportType: getProperty(requestFilter, "downloadReportType", []),
        loanReportTypes: getProperty(requestFilter, "loanReportTypes", null)
      },
    };
    return this.http.put(
      `${GENERATE_REPORTS}`,
      requestBody,
      { responseType: "text", observe: "response" }
    );
  }

  fetchLoanReports(
    reportType: string = "",
    page: number = 0,
    size: number = 1,
    sort: string = "id,desc",
    purpose: string = "REPORT_GENERATION"
  ) {
    const params = new HttpParams()
      .append("purpose", purpose)
      .append("type", reportType)
      .append("page", page)
      .append("size", size)
      .append("sort", sort);
    return this.http.get(`${REPORTS}`, {
      observe: "body",
      params,
    });
  }
}
