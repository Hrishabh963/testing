import { Observable } from "rxjs";
import { LocalStorageService, SessionStorageService } from "ngx-webstorage";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";

import {
  KALEIDO_SERVER_API_URL,
  S3_PATTERN,
  SERVER_API_URL,
} from "../../app.constants";

export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private readonly localStorage: LocalStorageService,
    private readonly sessionStorage: SessionStorageService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request?.url?.startsWith("https://ifsc.razorpay.com/")) {
      return next.handle(request);
    }
    let temp = new RegExp(S3_PATTERN);
    if (temp.exec(request.url) || request.url.includes("amazonaws.com")) {
      return next.handle(request);
    }
    if (
      request.url.endsWith("reset_password/init") ||
      request.url.endsWith("reset_password/finish")
    ) {
      return next.handle(request);
    }
    if (request.headers.has("Skip-Auth")) {
      const modifiedRequest = request.clone({
        headers: request.headers.delete("Skip-Auth"),
      });
      return next.handle(modifiedRequest);
    }
    const token = this.sessionStorage.retrieve("authenticationToken");

    if (
      !request?.url ||
      (request.url.startsWith("http") &&
        !(SERVER_API_URL && request.url.startsWith(SERVER_API_URL)) &&
        !(
          KALEIDO_SERVER_API_URL &&
          request.url.startsWith(KALEIDO_SERVER_API_URL)
        )) ||
      request.url.startsWith(`${SERVER_API_URL}resources`) ||
      request.url.startsWith(`${SERVER_API_URL}api/profile-info`) ||
      request.url.startsWith(
        `${SERVER_API_URL}api/anonymous/sendingOtpToMobileNumber`
      ) ||
      request.url.startsWith(
        `${SERVER_API_URL}api/anonymous/otpVerification`
      ) ||
      request.url.startsWith(
        `${SERVER_API_URL}api/anonymous/account/password/activation`
      ) ||
      request.url.startsWith(`${SERVER_API_URL}api/anonymous/users/activate`)
    ) {
      request = request.clone({
        setHeaders: {
          CHANNEL: "DASHBOARD_WEB",
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(request);
    }
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: "Bearer " + token,
          CHANNEL: "DASHBOARD_WEB",
        },
      });
    } else {
      request = request.clone({
        setHeaders: {
          CHANNEL: "DASHBOARD_WEB",
        },
      });
    }
    return next.handle(request);
  }
}
