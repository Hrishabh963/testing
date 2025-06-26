import { Injectable } from "@angular/core";
import get from "lodash/get";
import { LocalStorageService } from "ngx-webstorage";
import { Observable, Subject } from "rxjs";
import { AssociateLenderService } from "src/app/entities/kaleido-credit/services/associate-lender/associate-lender.service";
import { AuthorizationService } from "src/app/entities/kaleido-credit/services/authorization.service";
import { getProperty } from "src/app/utils/app.utils";
import { AccountService } from "./account.service";
import { ROLES } from "./roles.constants";
import { UserInactivityService } from "src/app/entities/kaleido-credit/services/user-inactivity.service";
import { UserInfo } from "./UserInfo.constant";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class PrincipalService {
  public userIdentity: any;
  private authenticated = false;
  private readonly authenticationState = new Subject<any>();
  private mismatchPartner: any = null;
  constructor(
    private readonly account: AccountService,
    private readonly $localStorage: LocalStorageService,
    private readonly associateLenderService: AssociateLenderService,
    private readonly authorizationService: AuthorizationService,
    private readonly userInactivityService: UserInactivityService,
    private readonly router: Router
  ) {}

  authenticate(identity: any) {
    this.userIdentity = identity;
    this.authenticated = identity !== null;
    this.authenticationState.next(this.userIdentity);
  }

  hasAnyAuthority(authorities: string[]): Promise<boolean> {
    return Promise.resolve(this.hasAnyAuthorityDirect(authorities));
  }

  hasAnyAuthorityDirect(authorities: string[]): boolean {
    if (this.authenticated || this.userIdentity?.authorities) {
      return false;
    }

    for (let elm of authorities) {
      if (this.userIdentity.authorities.includes(elm)) {
        return true;
      }
    }

    return false;
  }

  hasAuthority(authority: string): Promise<boolean> {
    if (!this.authenticated) {
      return Promise.resolve(false);
    }

    return this.identity().then(
      (id) => {
        return Promise.resolve(id.authorities?.includes(authority) || false);
      },
      () => {
        return Promise.resolve(false);
      }
    );
  }

  getUserInfo(): UserInfo {
    const userInfo: UserInfo = {};
    userInfo.fullName = this.getUserName();
    userInfo.login = this.getUserLogin();
    userInfo.email = getProperty(this.userIdentity, "email", null);
    userInfo.mobileNumber = getProperty(
      this.userIdentity,
      "mobileNumber",
      null
    );
    userInfo.recentFailedLogin = getProperty(
      this.userIdentity,
      "recentFailedLoginAttempt",
      null
    );
    userInfo.recentLogin = getProperty(this.userIdentity, "recentLogin", null);
    userInfo.role = getProperty(this.userIdentity, "role", null);
    return userInfo;
  }

  getUserLogin() {
    return get(this.userIdentity, "login", undefined);
  }

  getUserName() {
    return `${get(this.userIdentity, "firstName") || ""} ${
      get(this.userIdentity, "lastName") || ""
    }`;
  }
  identity(force?: boolean): Promise<any> {
    if (!sessionStorage.getItem("ig-authenticationtoken")) {
      return Promise.reject(new Error("Invalid Token"));
    }
    this.mismatchPartner = null;
    if (force === true) {
      this.userIdentity = undefined;
    }

    // check and see if we have retrieved the userIdentity data from the server.
    // if we have, reuse it by immediately resolving
    if (this.userIdentity) {
      //check for partner domain mismatch
      // this.mismatchPartner = this.checkPartnerDomainMismatch();
      if (this.mismatchPartner) {
        return Promise.reject(new Error("Partner mismatch"));
      }

      return Promise.resolve(this.userIdentity);
    }

    // retrieve the userIdentity data from the server, update the identity object, and then resolve.
    return new Promise((resolve, reject) => {
      const fetchData = async () => {
        const accountResponse = await this.account.get().toPromise();
        const account = get(accountResponse, "body", {});
        const isAccessDisabled: boolean = get(account, "accessDisabled", false);
        if (isAccessDisabled) {
          reject("Access Disabled");
          this.router.navigate(["lockout"]);
          return;
        }
        try {
          if (account) {
            this.userIdentity = account;
            this.authenticated = true;
          } else {
            this.userIdentity = null;
            this.authenticated = false;
          }
          this.authenticationState.next(this.userIdentity);
          if (this.mismatchPartner) {
            reject(new Error("Partner mismatch"));
          }
          const role = get(account, "role", "");
          try {
            if (role === ROLES.ROLE_KP_PARTNER) {
              resolve(this.userIdentity);
              return;
            }
            this.authorizationService.setAuthorities(
              getProperty(account, "authorities", [])
            );
            await this.fetchAssociateLenderInformation();
            resolve(this.userIdentity);
          } catch (exception) {
            this.rejectLogin(reject);
          }
        } catch (e) {
          this.rejectLogin(reject);
        }
      };
      fetchData();
    });
  }
  rejectLogin(reject: Function) {
    this.userIdentity = null;
    this.authenticated = false;
    this.authenticationState.next(this.userIdentity);
    reject("Login failed");
  }
  async fetchAssociateLenderInformation() {
    await this.associateLenderService.fetchLender();
    this.associateLenderService.fetchPopupMetaData();
    this.userInactivityService.loadConfigurations();
  }
  isAuthenticated(): boolean {
    return this.authenticated;
  }

  isIdentityResolved(): boolean {
    return this.userIdentity !== undefined;
  }

  getAuthenticationState(): Observable<any> {
    return this.authenticationState.asObservable();
  }

  getImageUrl(): string {
    return this.isIdentityResolved() ? this.userIdentity.imageUrl : null;
  }
  initPartnerMismatch() {
    this.mismatchPartner = null;
  }
  getPartnerMismatchURL() {
    return this.mismatchPartner;
  }

  checkPartnerDomainMismatch() {
    let partnerMismatch = null;
    if (this.userIdentity?.partnerSubDomain) {
      const url: string = window.location.hostname;
      const servernameList = url.split("."); // printo.corp or uat-printo.corp
      const partnerDomainList = servernameList[0].split("-");
      const partnerDomain =
        servernameList[0].indexOf("-") < 0
          ? partnerDomainList[0]
          : partnerDomainList[1];
      if (partnerDomain != this.userIdentity.partnerSubDomain) {
        if (partnerDomainList[1]) {
          partnerDomainList[1] = this.userIdentity.partnerSubDomain;
          servernameList[0] = partnerDomainList.join("-");
        } else {
          partnerDomainList[0] = this.userIdentity.partnerSubDomain;
          servernameList[0] = partnerDomainList.join("-");
        }
        const port =
          window.location.port != "" ? ":" + window.location.port : "";
        const redirectURL =
          window.location.protocol +
          "//" +
          servernameList.join(".") +
          port +
          "/#/login";
        partnerMismatch = {
          redirectURL: redirectURL,
          displayURL: this.userIdentity.partnerSubDomain,
        };
        if (this.$localStorage.retrieve("authenticationToken"))
          this.$localStorage.clear("authenticationToken");
      }
    }
    return partnerMismatch;
  }

  getUserRole(): string {
    return this.userIdentity?.role;
  }
}
