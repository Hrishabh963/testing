import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';

@Injectable({
  providedIn: 'root',
})
export class CsrfService {
  constructor(private readonly cookieService: CookieService) {}

  getCSRF(name?: string) {
    name = name ?? 'XSRF-TOKEN';
    return this.cookieService.get(name);
  }
}
