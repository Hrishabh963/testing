import { Routes } from "@angular/router";
import { DemandUploadComponent } from "./demand-upload/demand-upload.component";
import { DemandsComponent } from "./demands/demands.component";

export const DEMAND: Routes = [
  {
    path: "demands",
    component: DemandsComponent
  },
  {
    path: "uploadDemands",
    component: DemandUploadComponent
  }
];
