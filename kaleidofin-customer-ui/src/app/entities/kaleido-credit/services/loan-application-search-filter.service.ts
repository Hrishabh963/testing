import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { LOAN_APP_SEARCH_FILTERS } from "src/app/shared/constants/Api.constants";
import { getProperty } from "src/app/utils/app.utils";
import { AssociateLenderService } from "./associate-lender/associate-lender.service";

@Injectable({
  providedIn: "root",
})
export class LoanApplicationSearchFilterService {
  readonly filterData: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  readonly FILTERS = {
    BRANCH: {
      label: "Branch",
      value: "BRANCH",
      propertyKey: "branchId",
      multiple: true,
      type: "multi-select-search",
    },
    ASSIGNEE: {
      label: "Assignee",
      value: "ASSIGNEE",
      propertyKey: "assignee",
      type: "multi-select-search",
      defaultValue: { label: "Unassigned", value: "NONE" },
      placeholder: "Search by user",
      enableDefaultValue: true,
    },
    PDD_STATUS: {
      label: "PDD Status",
      value: "PDD_STATUS",
      propertyKey: "postDisbursementUploadStatus",
      type: "multi-select-search",
    },
    PENNY_DROP_STATUS: {
      label: "Penny Drop Status",
      value: "PENNY_DROP_STATUS",
      propertyKey: "bankValidationStatus",
      type: "multi-select-search",
    },
    BANK_STATUS: {
      label: "Bank Status",
      value: "BANK_STATUS",
      propertyKey: "bankStatus",
      type: "multi-select-search",
    },
    LOAN_TYPES: {
      label: "Loan Type",
      value: "LOAN_TYPES",
      propertyKey: "loanType",
      defaultValue: { label: "All", value: "" },
      enableDefaultValue: true,
    },
    PARTNER: {
      label: `${this.isDBCMFI() ? "BC Name" : "Partner"}`,
      value: "PARTNER",
      propertyKey: "partnerId",
      type: "multi-select-search",
    },
    RM_NAME: {
      label: "RM Name",
      value: "AGENT_NAME",
      propertyKey: "agentName",
      type: "multi-select-search",
    },
    RM_STATE: {
      label: "RM State",
      value: "RM_STATE",
      propertyKey: "state",
      type: "multi-select-search",
    },
    BRE: {
      label: "BRE",
      value: "BRE",
      propertyKey: "breDecision",
      type: "multi-select-search",
    },
    AML_STATUS: {
      label: "AML Status",
      value: "AML_STATUS",
      propertyKey: "amlStatus",
      type: "multi-select-search",
    },
    FRAUD_CHECK_STATUS: {
      label: "Fraud Check",
      value: "FRAUD_CHECK_STATUS",
      propertyKey: "fraudCheckStatus",
      type: "multi-select-search",
    }
  };

  constructor(
    private readonly http: HttpClient,
    private readonly associateLenderService: AssociateLenderService
  ) {}

  isDBCMFI(): boolean {
    return (
      this.associateLenderService.getLenderCode().toUpperCase() === "DCBMFI"
    );
  }

  fetchFilterData(
    requireqFilterData: Array<string> = [],
    loanId: number = null
  ): Observable<any> {
    const currentLender = this.associateLenderService.getLenderData();
    const partnerId = getProperty(currentLender, "partnerId", null);

    let params = new HttpParams()
      .append("partnerId", partnerId || "")
      .append("loanApplicationId", loanId || "")
      .append("page", 0)
      .append("size", 500);

    requireqFilterData.forEach(
      (filter) => (params = params.append("filter", filter))
    );
    return this.http.get(LOAN_APP_SEARCH_FILTERS, { params });
  }
}
