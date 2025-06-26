import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared";
import { HomeComponent } from "./home.component";
import { HOME_ROUTE, RESET_PASSWORD, USER_LOCKOUT, DCB_ROUTE } from "./home.route";

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([HOME_ROUTE, RESET_PASSWORD, USER_LOCKOUT, DCB_ROUTE]),
  ],
  declarations: [HomeComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Ignition5BaseHomeModule {}
