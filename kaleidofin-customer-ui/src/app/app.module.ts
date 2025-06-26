import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import {
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  Injector,
  NgModule,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from "@angular/material/bottom-sheet";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { BrowserModule } from "@angular/platform-browser";
import {
  LocalStorageService,
  NgxWebstorageModule,
  SessionStorageService
} from "ngx-webstorage";
import { AccountModule } from "./account/account.module";
import { AppRoutingModule } from "./app-routing.module";
import { PaginationConfig } from "./blocks/config/uib-pagination.config";
import { DeactivateGuard } from "./blocks/guards/candeactivate.guard";
import { AuthExpiredInterceptor } from "./blocks/interceptor/auth-expired.interceptor";
import { AuthInterceptor } from "./blocks/interceptor/auth.interceptor";
import { ErrorHandlerInterceptor } from "./blocks/interceptor/errorhandler.interceptor";
import { EntitiesModule } from "./entities/entities.module";
import { Ignition5BaseHomeModule } from "./home/home.module";
import {
  IgKaleidofinHomeModalComponent,
  RedirectBottomSheet,
} from "./home/kaleidofin-home.component";
import {
  ActiveMenuDirective,
  ErrorComponent,
  ErrorContactComponent,
  FooterComponent,
  IgMainComponent,
  NavbarComponent,
  SideNavComponent,
} from "./layouts";
import { SharedModule } from "./shared";
import { CustomMatPaginatorIntl } from "./shared/util/pagination.service";
import { CustomValidator } from "./shared/validations/custom.validation";

import { NgHttpLoaderModule } from "ng-http-loader";
import { CoreModule } from "./core";
import { HelpAndSupportComponent } from "./molecules/help-and-support/help-and-support.component";
import { ComponentResolverComponent } from "./organisms/dynamic-component-resolver/component-resolver/component-resolver.component";
import { initializeSubdomain, SubdomainService } from "./shared/subdomain.service";
import { JhiEventManager } from "ng-jhipster";
import { ChartsModule } from "ng2-charts";


@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxWebstorageModule.forRoot({ prefix: "ig", separator: "-" }),
    SharedModule,
    ChartsModule,
    CoreModule,
    Ignition5BaseHomeModule,
    AccountModule,
    EntitiesModule,
    MatBottomSheetModule,
    HttpClientModule,
    NgHttpLoaderModule.forRoot(),
  ],
  declarations: [
    IgMainComponent,
    IgKaleidofinHomeModalComponent,
    NavbarComponent,
    ErrorComponent,
    ActiveMenuDirective,
    FooterComponent,
    ErrorContactComponent,
    RedirectBottomSheet,
    SideNavComponent,
    ComponentResolverComponent,
    HelpAndSupportComponent,
  ],
  providers: [
    PaginationConfig,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
      deps: [LocalStorageService, SessionStorageService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthExpiredInterceptor,
      multi: true,
      deps: [Injector],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
      deps: [Injector, JhiEventManager, CustomValidator],
    },
    { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
    { provide: MatBottomSheetRef, useValue: {} },
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntl,
    },
    DeactivateGuard,
    SubdomainService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeSubdomain,
      deps: [SubdomainService],
      multi: true,
    },
  ],
  entryComponents: [RedirectBottomSheet],
  bootstrap: [IgMainComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
