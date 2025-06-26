import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ForgotPwdRequest } from "src/app/constants/login/password.constants";
import { RESET_PASSWORD } from "src/app/shared/constants/Api.constants";
import { KALEIDO_SERVER_API_URL, OAUTH_API_URL } from "../../../app.constants";

@Injectable()
export class PasswordResetFinishService {
  constructor(private readonly http: HttpClient) {}

  save(keyAndPassword: any): Observable<any> {
    return this.http.post(
      `${KALEIDO_SERVER_API_URL}api/anonymous/account/reset_password/finish`,
      keyAndPassword
    );
  }

  resetPassword(
    payload: ForgotPwdRequest,
    token: string = ""
  ): Observable<any> {
    let headers = {
      Authorization: `Bearer ${token}`,
      'Skip-Auth': 'true'
    };
    return this.http.post(RESET_PASSWORD, payload, { headers });
  }

  createTokenByClienCreds(): Promise<any> {
    const params = new HttpParams()
      .append("grant_type", "client_credentials")
      .append("client_id", "kaleidodashboardapp")
      .append(
        "client_secret",
        "dashboard-secret-token-to-change-in-production"
      );

    return this.http
      .post(`${OAUTH_API_URL}oauth/token`, null, { params })
      .toPromise();
  }
}
