import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injector } from "@angular/core";
import { Observable } from "rxjs";

import { Router } from "@angular/router";
import { JhiEventManager } from "ng-jhipster";
import { tap } from "rxjs/operators";
import { LoginService } from "src/app/core";


export class AuthExpiredInterceptor implements HttpInterceptor {
  constructor(
    private readonly injector: Injector,
    private readonly eventManager: JhiEventManager
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        () => {},
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              const loginService: LoginService =
                this.injector.get(LoginService);
              const router: Router = this.injector.get(Router);
              if (!(request?.url || "").includes("/oauth/token")  && !(request?.url || "").includes("/account/forgot-password") ) {
                loginService.logout();
                router.navigateByUrl("");
              }
              if (this.eventManager) {
                this.eventManager.broadcast({
                  name: "authenticationFailure",
                  content: err,
                });
              }
            }
          }
        }
      )
    );
  }
}
