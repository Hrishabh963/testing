import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LocalStorageService, SessionStorageService } from "ngx-webstorage";
import { OAUTH_API_URL } from "src/app/app.constants";
import { LOGOUT } from "src/app/shared/constants/Api.constants";

@Injectable({
  providedIn: "root",
})
export class AuthJwtService {
  constructor(
    private readonly http: HttpClient,
    private readonly $localStorage: LocalStorageService,
    private readonly $sessionStorage: SessionStorageService,
  ) {}

  getToken() {
    return this.$sessionStorage.retrieve("authenticationToken");
  }

  login(credentials: any = {}): Promise<any> {
    const formData = new FormData();
    formData.append("username", credentials?.username);
    formData.append("password", credentials?.password);
    formData.append("grant_type", "password");
    formData.append("client_id", "kaleidodashboardapp");
    formData.append("scope", "read write");
    formData.append(
      "client_secret",
      "dashboard-secret-token-to-change-in-production"
    );

    return this.http.post(`${OAUTH_API_URL}oauth/token`, formData).toPromise();
  }

  authSuccess(token: string = "") {
    this.$sessionStorage.store("authenticationToken", token);
    sessionStorage.removeItem("ig-signupuser");
    sessionStorage.removeItem("signUpUser");
  }

  logout(): Promise<any> {
    return this.http.get(LOGOUT).toPromise();
  }

  storeAuthenticationToken(jwt: string, rememberMe: string) {
    if (rememberMe) {
      this.$localStorage.store("authenticationToken", jwt);
    } else {
      this.$sessionStorage.store("authenticationToken", jwt);
    }
  }
}
