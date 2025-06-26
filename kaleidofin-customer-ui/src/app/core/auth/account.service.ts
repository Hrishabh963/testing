import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ACCOUNT_API } from "src/app/shared/constants/Api.constants";
import { Account } from "../user/account.model";

@Injectable({
  providedIn: "root",
})
export class AccountService {
  constructor(private readonly http: HttpClient) {}

  get(): Observable<HttpResponse<Account>> {
    return this.http.get<Account>(ACCOUNT_API, {
      observe: "response",
    });
  }
}
