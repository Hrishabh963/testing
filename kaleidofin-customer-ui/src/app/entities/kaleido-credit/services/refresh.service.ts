import { Injectable } from '@angular/core';
import { isNull } from 'lodash';
import { LoginService } from 'src/app/core';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {

  constructor(private readonly loginService: LoginService) { }

  detectAppRefresh(): void {
    const isRefreshed = this.$getRefreshToken; 
    if(isNull(isRefreshed)) {
      this.loginService.logout();
      return;
    }
    if (isRefreshed === '1') {
      const confirmRefresh = window.confirm("Are you sure you want to refresh the application?");
      if (confirmRefresh) {
        this.$setRefreshToken(0);
        window.location.reload();
      }
    } else {
      this.$setRefreshToken(1);
    }
  }

  get $getRefreshToken(): string | null {
    return sessionStorage.getItem('isRefreshed') ?? null;
  }

  $removeRefreshToken(): void {
    sessionStorage.removeItem('isRefreshed');
  }

  $setRefreshToken(version: number): void {
    sessionStorage.setItem('isRefreshed', `${version}`);
  }

}
