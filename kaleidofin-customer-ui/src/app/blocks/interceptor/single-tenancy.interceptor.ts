import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class SingleTenancyInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.includes("krediline-server")) {
      let lender = sessionStorage.getItem("lenderCode") || null;
      request = request.clone({
        setHeaders: {
          lenderCode: lender,
        },
      });
    }
    return next.handle(request);
  }
}
