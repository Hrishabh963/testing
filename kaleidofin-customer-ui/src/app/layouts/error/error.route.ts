import { Routes } from "@angular/router";
import { ErrorContactComponent } from "./error-contact.component";

import { ErrorComponent } from "./error.component";

export const errorRoute: Routes = [
  {
    path: "error",
    component: ErrorContactComponent,
    data: {
      authorities: [],
      pageTitle: "Error"
    }
  },
  {
    path: "accessdenied",
    component: ErrorComponent,
    data: {
      authorities: [],
      pageTitle: "Error",
      error403: true
    }
  },
  {
    path: "contact/:type",
    component: ErrorContactComponent,
    data: {
      authorities: [],
      pageTitle: "Contact",
      error403: true
    }
  }
];
