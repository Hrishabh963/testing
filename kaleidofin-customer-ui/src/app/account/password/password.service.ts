import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { KALEIDO_SERVER_API_URL, SERVER_API_URL } from "../../app.constants";
import { User } from "../../core";
import { PwdChangeRequest } from "src/app/constants/login/password.constants";
import { CHANGE_PASSWORD_URL } from "src/app/shared/constants/Api.constants";

@Injectable()
export class PasswordService {
  activateAccount: any;
  constructor(private readonly http: HttpClient) {}

  save(newPassword: string, currentPassword: string): Observable<any> {
    return this.http.post(
      SERVER_API_URL + "api/direct/account/change_password",
      { currentPassword, newPassword }
    );
  }

  findUserByActivationKey(
    activationKey: string
  ): Observable<HttpResponse<User>> {
    return this.http.get(
      `${SERVER_API_URL}api/anonymous/users/activate/${activationKey}`,
      { observe: "response" }
    );
  }

  getPartnerLogo(partnerId: any): Observable<HttpResponse<string>> {
    return this.http.get<string>(
      `${SERVER_API_URL}api/direct/customer/file/streamPartnerLogo`,
      { observe: "response" }
    );
  }

  getPartnerLogoFromActivationKey(
    activationKey: string
  ): Observable<HttpResponse<string>> {
    return this.http.get<string>(
      `${SERVER_API_URL}api/anonymous/file/streamPartnerLogo/${activationKey}`,
      { observe: "response" }
    );
  }

  setActivateAccount(activateAccount: any) {
    this.activateAccount = activateAccount;
  }

  getActivateAccount() {
    return this.activateAccount;
  }

  activationComplete(activateAccount: any): Observable<any> {
    return this.http.post(
      SERVER_API_URL + "api/anonymous/account/password/activation",
      activateAccount,
      { observe: "response" }
    );
  }

  getGupShupRespondse(mashapeResponse: string) {
    const responseArray = mashapeResponse.split(" | ");
    const shupModel: any = {
      type: null,
      code: null,
      message: null,
    };
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0) {
        shupModel.type = responseArray[0];
      }
      if (i === 1) {
        shupModel.code = responseArray[1];
      }
      if (i === 2) {
        shupModel.message = responseArray[2];
      }
    }
    return shupModel;
  }

  resetPasswordByEmail(email: string): Observable<any> {
    return this.http.post(
      `${KALEIDO_SERVER_API_URL}api/anonymous/account/reset_password/init`,
      email,

      {
        observe: "response",
        responseType: "text",
        headers: {
          resetURL: "#/reset/finish",
        },
      }
    );
  }

  changePassword(payload: PwdChangeRequest, token = null): Observable<any> {
    if(token) {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Skip-Auth': 'true'
      };
      return this.http.post(CHANGE_PASSWORD_URL, payload, {headers});
    }
    else {
      return this.http.post(CHANGE_PASSWORD_URL, payload);
    }
  }

}
