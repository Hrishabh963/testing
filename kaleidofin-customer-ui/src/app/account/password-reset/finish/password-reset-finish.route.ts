import { Route } from "@angular/router";
import { LandingComponent } from "src/app/entities/kaleido-credit/organisms/landing/landing.component";

export const passwordResetFinishRoute: Route = {
  path: "reset/finish",
  component: LandingComponent,
  data: {
    authorities: [],
    pageTitle: "Reset Password",
    currentPage: "Set New Password"
  }
};
