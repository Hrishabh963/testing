import { Injectable, isDevMode } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { PrincipalService } from './principal.service';
import { StateStorageService } from './state-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserRouteAccessService implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly principal: PrincipalService,
    private readonly stateStorageService: StateStorageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    const authorities = route.data["authorities"];
    // We need to call the checkLogin / and so the principal.identity() function, to ensure,
    // that the client has a principal too, if they already logged in by the server.
    // This could happen on a page refresh.
    return this.checkLogin(authorities, state.url);
  }

  checkLogin(authorities: string[], url: string): Promise<boolean> {
    
    return Promise.resolve(
      this.principal.identity().then(account => {
        if (!authorities || authorities.length === 0) {
          return true;
        }

        if (account) {
          return this.principal.hasAnyAuthority(authorities).then(response => {
            if (response) {
              return true;
            }
            if (isDevMode()) {
              console.error(
                "User has not any of required authorities: ",
                authorities
              );
            }
            return false;
          });
        }

        this.stateStorageService.storeUrl(url);
        this.router.navigate(["accessdenied"]).then(() => {
          // only show the login dialog, if the user hasn't logged in yet
          if (!account) {
            this.router.navigateByUrl("login");
          }
        });
        return false;
      })
    );
  }
}
