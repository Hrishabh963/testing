import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { RECALCULATE_BRE_RULES } from "src/app/shared/constants/Api.constants";

@Injectable({
  providedIn: "root",
})
export class RecalculateBreService {

  private readonly recalculationTrigered: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  private readonly progressCalculated: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  intervalId: NodeJS.Timeout = null;

  private readonly isRecalculationInProgress: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private readonly http: HttpClient) {}

  startInterval(): void {
    if (this.intervalId) {
      return;
    }
    this.setRecalculationTrigger(true);
    this.setProgressCalculated(0);
    this.intervalId = setInterval(() => {
      let currentValue: number = this.progressCalculated.value;
      currentValue += 15;
      this.progressCalculated.next(currentValue);
      if (currentValue === 90 && this.intervalId) {
        clearInterval(this.intervalId);
      }
    }, 500);
  }

  getProgressCalculated(): Observable<number> {
    return this.progressCalculated.asObservable();
  }

  setProgressCalculated(progress: number): void {
    this.progressCalculated.next(progress);
  }

  getRecalculationTrigger(): Observable<boolean> {
    return this.recalculationTrigered.asObservable();
  }

  setRecalculationTrigger(isTriggered: boolean): void {
    this.recalculationTrigered.next(isTriggered);
  }


  
 getRecalculationInProgress(): Observable<boolean> {
    return this.isRecalculationInProgress.asObservable();
  }

  setIsRecalculationInProgress(inProgress: boolean): void {
    this.isRecalculationInProgress.next(inProgress);
  }

  recalculateBRE(loanId: number = null): Observable<any> {
    this.setIsRecalculationInProgress(true);
    const params: HttpParams = new HttpParams().append(
      "loanApplicationId",
      loanId
    );
    return this.http.post(RECALCULATE_BRE_RULES, null, { params });
  }

  finishRecalculation(): void {
    if(this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.setProgressCalculated(100);
    this.setIsRecalculationInProgress(false);
  }

}
