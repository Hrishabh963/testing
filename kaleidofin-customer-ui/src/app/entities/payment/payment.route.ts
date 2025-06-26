import { Routes } from "@angular/router";
import { PaymentsComponent } from "./payments/payments.component";

export const PAYMENT: Routes = [
  {
    path: "payments",
    component: PaymentsComponent
  }
];
