import { Routes } from "@angular/router";
import { DeactivateGuard } from "src/app/blocks/guards/candeactivate.guard";
import { NachFormUploadComponent } from "./nach-form-upload/nach-form-upload.component";
import { PrefilledNachFormDashboard } from "./prefilled-nach-form-dashboard/prefilled-nach-form-generation-dashbord.component";

export const NACH: Routes = [
  {
    path: "nachForms",
    data: { topNavTab: "nachForms" },
    children: [
      {
        path: "prefilledNachForms",
        component: PrefilledNachFormDashboard
      },
      {
        path: "nachFormUpload",
        component: NachFormUploadComponent,
        canDeactivate: [DeactivateGuard]
      }
    ]
  }
];
