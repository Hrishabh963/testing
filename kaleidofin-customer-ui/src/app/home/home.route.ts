import { APP_INITIALIZER, Provider } from "@angular/core";
import { Route } from "@angular/router";
import { LandingComponent } from "../entities/kaleido-credit/organisms/landing/landing.component";
import { SubdomainService } from "../shared/subdomain.service";
import { LENDER_CONFIGURATIONS } from "../constants/lender.config";

export function initializeSubdomain(subdomainService: SubdomainService) {
  return () => {
    return subdomainService.getSubdomain();
  };
}

export const SUBDOMAIN_INITIALIZER: Provider = {
  provide: APP_INITIALIZER,
  useFactory: initializeSubdomain,
  deps: [SubdomainService],
  multi: true,
};

export const HOME_ROUTE: Route = {
  path: "",
  component: LandingComponent,
  resolve: {
    lenderData: (route, state) => {
      const service = new SubdomainService();
      return {
        authorities: [],
        metaData: service.getLenderConfig(),
        pageTitle: "Kaleidofin",
      };
    },
  },
};

export const USER_LOCKOUT: Route = {
  path: "lockout",
  component: LandingComponent,
  data: {
    authorities: [],
    pageTitle: "User Lockout",
    currentPage: "Account Temporarily Locked Notification",
  },
};

export const RESET_PASSWORD: Route = {
  path: "expired",
  component: LandingComponent,
  data: {
    authorities: [],
    pageTitle: "Kaleidofin",
    currentPage: "Set New Password Notification",
  },
};

export const DCB_ROUTE: Route = {
  path: "DCB",
  component: LandingComponent,
  data: {
    authorities: [],
    pageTitle: "DCB",
    metaData: LENDER_CONFIGURATIONS.DCB,
  },
};
