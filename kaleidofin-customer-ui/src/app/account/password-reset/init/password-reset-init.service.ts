import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { SERVER_API_URL } from "../../../app.constants";


@Injectable()
export class PasswordResetInitService {
  constructor(private readonly http: HttpClient) {}

  save(phoneNumber: number): Observable<any> {
    return this.http.post(
      SERVER_API_URL + "api/anonymous/account/reset_password_link",
      phoneNumber,
      { responseType: "text" }
    );
  }
}
