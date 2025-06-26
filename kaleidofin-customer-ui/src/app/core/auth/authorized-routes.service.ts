import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { PrincipalService } from "./principal.service";
import { ROLES } from "./roles.constants";
import { AssociateLenderService } from "src/app/entities/kaleido-credit/services/associate-lender/associate-lender.service";
import { LENDER_CONFIGURATIONS } from "src/app/constants/lender.config";

@Injectable({
  providedIn: "root",
})
export class AuthorizedRoutes {
  constructor(
    private readonly router: Router,
    private readonly principalService: PrincipalService,
    private readonly lenderService: AssociateLenderService
  ) {}

  navigate(): void {
    const role = this.principalService.getUserRole();
    this.lenderService.lender.subscribe((lenderCode) => {
      if (role === ROLES.ROLE_KP_PARTNER) {
        this.router.navigateByUrl("dashboard/home");
      } else {
        let landingRoute =
          LENDER_CONFIGURATIONS[lenderCode]?.defaultLandingRoute ||
          "kcredit/overview";
        this.router.navigateByUrl(landingRoute);
      }
    });
  }
}
