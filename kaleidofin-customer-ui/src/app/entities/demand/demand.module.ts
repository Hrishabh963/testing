import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedLibModule } from "../../shared/shared-libs.module";
import { SharedModule } from "../../shared/shared.module";
import {
  DemandUploadComponent,
  ResponseDialog
} from "./demand-upload/demand-upload.component";
import { DEMAND } from "./demand.route";
import { DemandsComponent } from "./demands/demands.component";
import { DndDirective } from "./directive/dnd.directive";

@NgModule({
  declarations: [
    DemandsComponent,
    DemandUploadComponent,
    ResponseDialog,
    DndDirective
  ],
  entryComponents: [ResponseDialog],
  imports: [
    CommonModule,
    RouterModule.forChild(DEMAND),
    SharedModule,
    SharedLibModule
  ]
})
export class DemandModule {}
