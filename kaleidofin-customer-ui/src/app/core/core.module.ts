import { DatePipe, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import locale from '@angular/common/locales/en';
import { LOCALE_ID, NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { AccountService } from './auth/account.service';
import { AuthJwtService } from './auth/auth-jwt.service';
import { AuthorizedRoutes } from './auth/authorized-routes.service';
import { CsrfService } from './auth/csrf.service';
import { PrincipalService } from './auth/principal.service';
import { StateStorageService } from './auth/state-storage.service';
import { UserRouteAccessService } from './auth/user-route-access.service';
import { LoginService } from './login/login.service';
import { UserService } from './user/user.service';

/** Look up: ngx-translate - a security issue https://www.npmjs.com/package/ngx-translate */
@NgModule({
  imports: [HttpClientModule, TranslateModule.forRoot()],
  exports: [],
  declarations: [],
  providers: [
    LoginService,
    Title,
    {
      provide: LOCALE_ID,
      useValue: 'en',
    },
    AccountService,
    StateStorageService,
    PrincipalService,
    CsrfService,
    AuthJwtService,
    UserService,
    DatePipe,
    AuthorizedRoutes,
    UserRouteAccessService,
  ],
})
export class CoreModule {
  constructor() {
    registerLocaleData(locale);
  }
}
