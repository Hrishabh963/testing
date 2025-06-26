import { Routes } from "@angular/router";
import { DeactivateGuard } from "src/app/blocks/guards/candeactivate.guard";
import { MandateDetailComponent } from "./mandate-detail/mandate-detail.component";
import { MandateDownloadComponent } from "./mandate-download/mandate-download.component";

export const PAYMENT_MANDATE: Routes = [
  {
    path: "paymentMandate",
    data: { topNavTab: "paymentMandate" },
    children: [
      {
        path: "mandate/:id",
        component: MandateDetailComponent,
        canDeactivate: [DeactivateGuard]
      },
      {
        path: "download",
        component: MandateDownloadComponent,
        canDeactivate: [DeactivateGuard]
      }
    ]
  }
];
