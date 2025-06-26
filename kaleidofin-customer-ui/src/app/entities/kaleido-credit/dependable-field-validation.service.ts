import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LOAN_STAGE_CHECK } from "src/app/shared/constants/Api.constants";
import { getProperty } from "src/app/utils/app.utils";
import { UiConfigService } from "./services/ui-config.service";
interface ValidationError {
  self?: string[];
  dependentFieldErrors?: { [key: string]: Array<string> };
}

interface Remark {
  sectionName: string;
  status: string;
  validationFieldErrors: { [key: string]: ValidationError };
}

@Injectable({
  providedIn: "root",
})
export class DependableFieldValidationService {
  private readonly remarks: BehaviorSubject<Array<Remark>> = new BehaviorSubject<
    Array<Remark>
  >([]);
  constructor(
    private readonly http: HttpClient,
    private readonly uiConfigService: UiConfigService
  ) {}

  private extractFieldName(
    fieldKey: string,
    sectionTitle: string = null
  ): string {
    const parts = fieldKey.split(".");
    if (sectionTitle) {
      const key: string = parts[parts.length - 2];
      return key.trim() === sectionTitle.trim() ? parts[parts.length - 1] : null;
    }
    return parts[parts.length - 1];
  }

  loanStageCheck(loanId: number, applicationStage: string) {
    const params = new HttpParams().append(
      "applicationStatus",
      applicationStage
    );

    this.http
      .get(`${LOAN_STAGE_CHECK}/${loanId}`, {
        params,
      })
      .subscribe(
        (response: any) => {
          let remarks: Array<Remark> = getProperty(response, "remarks", []);

          if (!Array.isArray(remarks) && typeof remarks === "string") {
            remarks = JSON.parse(remarks);
          }
          this.remarks.next(remarks);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  getLoanStageCheck(
    response: any,
    loanId: number,
    applicationStage: string
  ): void {
    const actionItems: Array<string> = getProperty(response, "actionItems", []);
    const getRemarks: boolean = actionItems.includes(
      "GET_UNDERWRITING_REMARKS"
    );
    const checkApproval: boolean = actionItems.includes(
      "REFRESH_APPROVAL_BUTTON"
    );
    if (getRemarks) {
      this.loanStageCheck(loanId, applicationStage);
    }
    if (checkApproval) {
      this.uiConfigService.checkApprovalButton(loanId);
    }
  }

  getRemarksDTO(): BehaviorSubject<Array<Remark>> {
    return this.remarks;
  }

  processValidationErrors(
    remarksDTO: Remark,
    sectionTitle: string = null
  ): { selfErrors: any; dependentFieldErrors: any } {
    const fieldErrors: { selfErrors: any; dependentFieldErrors: any } = {
      selfErrors: {},
      dependentFieldErrors: {},
    };

    const extractErrors = (
      errors: { [key: string]: ValidationError },
      parentKey: string = ""
    ) => {
      for (const [key, errorInfo] of Object.entries(errors)) {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;

        if (errorInfo.self && errorInfo.self.length > 0) {
          const fieldName = this.extractFieldName(fullKey, sectionTitle);
          if (fieldName) {
            fieldErrors.selfErrors[fieldName] = (
              fieldErrors.selfErrors[fieldName] || []
            ).concat(errorInfo.self);
          }
        }
        if (Object.keys(errorInfo.dependentFieldErrors).length > 0) {
          Object.keys(errorInfo.dependentFieldErrors).forEach((key) => {
            fieldErrors.dependentFieldErrors[key] =
              errorInfo.dependentFieldErrors[key].join(", ");
          });
        }
      }
    };

    if (remarksDTO?.validationFieldErrors) {
      extractErrors(remarksDTO.validationFieldErrors);
    }
    return fieldErrors;
  }
}
