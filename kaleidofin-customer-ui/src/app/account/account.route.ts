import { Routes } from "@angular/router";

import { passwordResetFinishRoute, passwordResetInitRoute } from ".";

const ACCOUNT_ROUTES = [passwordResetFinishRoute, passwordResetInitRoute];

export const accountState: Routes = [
  {
    path: "",
    children: ACCOUNT_ROUTES
  }
];
