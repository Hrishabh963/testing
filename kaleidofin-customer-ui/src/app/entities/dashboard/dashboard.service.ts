import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { KALEIDO_SERVER_API_URL, SERVER_API_URL } from 'src/app/app.constants';
import { DashboardDTO } from './dashboard/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  public dateRange: any = [];

  constructor(private readonly http: HttpClient) {}

  getDashboardData(
    startDate: string,
    endDate: string
  ): Observable<HttpResponse<DashboardDTO>> {
    let params = `?startDate=` + startDate + `&endDate=` + endDate;
    return this.http.get(SERVER_API_URL + `api/partner/dashboard` + params, {
      observe: 'response',
    });
  }

  private readonly subject = new Subject<any>();

  sendMessage(info: string) {
    this.subject.next({ page: info });
  }

  clearMessage() {
    this.subject.next({ page: '' });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  private readonly dateSource = new BehaviorSubject(this.dateRange);

  currentDateRange = this.dateSource.asObservable();

  changeDate(date: any) {
    this.dateSource.next(date);
  }
  getSample() {
    return this.http.get(
      KALEIDO_SERVER_API_URL +
        'api/partnerBackOffice/file/samplePrefillNachExcel',
      { responseType: 'blob' }
    );
  }
}
