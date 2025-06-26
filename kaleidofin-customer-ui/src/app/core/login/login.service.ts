import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { getProperty } from "src/app/utils/app.utils";
import { AuthJwtService } from "../auth/auth-jwt.service";
import { PrincipalService } from "../auth/principal.service";
import { AssociateLenderService } from "src/app/entities/kaleido-credit/services/associate-lender/associate-lender.service";
import { LENDER_CONFIGURATIONS } from "src/app/constants/lender.config";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  constructor(
    private readonly principal: PrincipalService,
    private readonly authServerProvider: AuthJwtService,
    private readonly associateLenderService: AssociateLenderService,
    private readonly router: Router
  ) {}

  handleTokenError(error: any): Promise<any> | void {
    if (error?.status !== 401) {
      return this.logout();
    }

    const status: string = getProperty(error, "error.status", "");
    const message: string = getProperty(error, "error.statusMsg", "");
    const encodedMessage = encodeURIComponent(btoa(message));
    switch (status) {
      case "PASSWORD_EXPIRED":
        return this.router.navigate(["expired"]);
      case "ACCOUNT_TEMPORARILY_LOCKED":
        return this.router.navigate(["lockout"], {
          queryParams: {
            message: encodedMessage,
          },
        });
      case "PASSWORD_RESET":
        return this.router.navigate(["reset/finish"], {
          queryParams: { changePassword: true },
        });
      default:
        return this.logout();
    }
  }

  clearAppData() {
    localStorage.clear();
    sessionStorage.clear();
  }

  logout() {
    if (sessionStorage.getItem("ig-authenticationtoken")) {
      this.authServerProvider.logout().then(() => {
        this.principal.authenticate(null);
        this.clearAppData();
        let logoutRoute = "/";
        let lenderCode = this.associateLenderService.getLenderCode();
        if (lenderCode) {
          let { defaultLogoutRoute = "/" } = LENDER_CONFIGURATIONS[lenderCode];
          logoutRoute = defaultLogoutRoute;
        }
        this.router.navigateByUrl(logoutRoute);
      });
    }
  }
}
