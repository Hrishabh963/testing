import { JhiEventManager } from "ng-jhipster";
import {
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent
} from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { Injector } from "@angular/core";
import { CustomValidator } from "src/app/shared/validations/custom.validation";

export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(
    private readonly injector: Injector,
    private readonly eventManager: JhiEventManager,
    private readonly customValidators: CustomValidator
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
            if (err.error != null) {
              const errMessage: string =
                typeof err.error == "string" &&
                this.customValidators.isJson(err.error)
                  ? JSON.parse(err.error).message
                  : err.error.message;
              if (typeof errMessage !== "undefined") {
                let a =this.helperFunction(errMessage);
                if (a === "") {
                  return;
                }
              }
            }
            this.statusFunction(err);
          }
        }
      )
    );
  }
  helperFunction(errMessage) :string{
    if (errMessage == "DOMAIN_NOT_FOUND") {
      const router: Router = this.injector.get(Router);
      router.navigateByUrl("contact/pagenotfound");
      return "";
      } else if (errMessage.indexOf("http") != -1) {
       window.location.href = errMessage;
      return "";
    }
    return "Something";
  }

  statusFunction(err) {
    if (
      !(
        err.status === 401 &&
        (err.message === "" ||
          (err.url?.includes("/api/account")))
      )
    ) {
      if (this.eventManager !== undefined) {
        this.eventManager.broadcast({
          name: "ignition5BaseApp.httpError",
          content: err
        });
      }
    }
  }
  
}
