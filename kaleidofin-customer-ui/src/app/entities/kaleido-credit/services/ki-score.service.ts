import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, Observable } from "rxjs";
import { KREDILINE_SERVER_URL } from "src/app/app.constants";
import {
  FETCH_CUSTOMER_KISCORE_REPORTS,
  FETCH_KISCORE_REPORTS,
  GENERATE_REPORTS,
  GET_KI_SCORE_REPORT,
  RETRY_KI_SCORE,
} from "src/app/shared/constants/Api.constants";
import { getProperty } from "src/app/utils/app.utils";
import { CustomAlertsComponent } from "../atoms/custom-alerts/custom-alerts.component";
import {
  CB_DATA_RESUBMISSION,
  RETRY_KI_SCORE_FAILED,
  RETRY_KI_SCORE_SUCCESS,
} from "../report/ki-credit-popup-constants";
import { createHttpParams } from "src/app/shared";

@Injectable({
  providedIn: "root",
})
export class KiScoreService {
  public kiScoreReport: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private readonly http: HttpClient,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {}

  fetchKiScoreReport(loanId = null): Observable<any> {
    return this.http.get(
      `${KREDILINE_SERVER_URL}${GET_KI_SCORE_REPORT}/${loanId}`
    );
  }

  getKiScoreResponse(): BehaviorSubject<any> {
    return this.kiScoreReport;
  }
  setKiScoreResponse(data: any): void {
    this.kiScoreReport.next(data);
  }

  triggerRetryKiScore(loanId: number = null) {
    return this.http.put(`${RETRY_KI_SCORE}/${loanId}`, null).toPromise();
  }
  async retryKiScore(data) {
    let message = "";
    let alertData = {
      description: message,
      isError: false,
      titleClass: "",
      title: "Recalculate ki score",
      buttonText: "",
      enableButtons: false,
    };
    let loanId = getProperty(data, "loanId", null);
    try {
      const response = await this.triggerRetryKiScore(loanId);
      let cbAnalysis = getProperty(response, "cbAnalysis", false);
      let isCbDataExpired = getProperty(response, "isCbDataExpired", false);
      let error = getProperty(response, "errorMessage", null);
      if (error || (!cbAnalysis && isCbDataExpired)) {
        alertData = {
          ...alertData,
          description: CB_DATA_RESUBMISSION,
          isError: true,
          titleClass: "error-title",
          title: "Error",
          enableButtons: false,
        };
      } else {
        alertData.description = RETRY_KI_SCORE_SUCCESS;
      }
      this.openAlertDialog(alertData);
      return response;
    } catch (error) {
      if (error.status === 403) {
        this.snackBar.open(
          "You are not authorized to perform this specific action",
          "",
          {
            duration: 5000,
            panelClass: ["red-snackbar"],
          }
        );
      } else {
        alertData = {
          ...alertData,
          description: RETRY_KI_SCORE_FAILED,
          buttonText: "Retry",
          isError: true,
          titleClass: "error-title",
          title: "Error",
          enableButtons: false,
        };
        this.openAlertDialog(alertData);
      }
    }
    return null;
  }

  openAlertDialog(data: any = {}) {
    const errorPopupDialog = this.dialog.open(CustomAlertsComponent, {
      width: "35vw",
      data,
    });
    errorPopupDialog.afterClosed().subscribe((response: any = null) => {
      console.log(response, "closed");
    });
  }

  fetchKiScoreResults(searchParams: any = {}) {
    const params = createHttpParams(searchParams);
    return this.http.get(FETCH_KISCORE_REPORTS, {
      params,
      observe: "response",
    });
  }
  fetchCustomerKiScoreData(searchParams: any = {}) {
    const params = createHttpParams(searchParams);
    return this.http.get(FETCH_CUSTOMER_KISCORE_REPORTS, {
      params,
      observe: "response",
    });
  }

  generateReport(taskId: number = null, partnerIds: Array<number> = []) {
    const payload = {
      purpose: "REPORT_INTERNAL",
      type: "BKS_REPORT",
      requestFilter: {
        taskId: taskId,
        partnerId: partnerIds,
      },
    };

    return this.http.put(GENERATE_REPORTS, payload, {
      responseType: "text",
      observe: "response",
    });
  }
}
