import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject } from "rxjs";
import { UI_COMPONENTS } from "src/app/constants/ui-config";
import { PrincipalService } from "src/app/core/auth/principal.service";
import { ROLES } from "src/app/core/auth/roles.constants";
import { AuthorizationService } from "src/app/entities/kaleido-credit/services/authorization.service";
import { UiConfigService } from "src/app/entities/kaleido-credit/services/ui-config.service";
import { getProperty } from "src/app/utils/app.utils";
import { animateText, onSideNavChange } from "../navbar/animations";
import { SidenavService } from "../navbar/sidenav.service";
import { TopNavService } from "../navbar/topnav.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-side-nav",
  templateUrl: "./side-nav.component.html",
  styleUrls: ["./side-nav.component.scss"],
  animations: [onSideNavChange, animateText],
})
export class SideNavComponent {
  public sideNavState: boolean = false;
  public linkText: boolean = false;
  public role: string = ROLES.ROLE_KP_PARTNER;
  logoClass: BehaviorSubject<string> = new BehaviorSubject<string>("");
  logoIcon: BehaviorSubject<string> = new BehaviorSubject<string>("");

  account: any;

  routes = [];

  selectedIndex: number = 0;

  constructor(
    private readonly _sidenavService: SidenavService,
    public readonly dialog: MatDialog,
    public readonly topNavService: TopNavService,
    public readonly principalService: PrincipalService,
    private readonly uiConfigService: UiConfigService,
    private readonly authorityService: AuthorizationService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.principalService.identity().then((account) => {
      this.account = account;
      this.role = this.account.role;
      this.uiConfigService.getUiConfigurations().subscribe((configurations) => {
        let config = getProperty(configurations, UI_COMPONENTS.NAV_ROUTES, {});
        this.routes = getProperty(config, "routes", []);
        this.routes = this.routes.filter(
          (route) =>
            !route["authority"] ||
            this.authorityService.hasAuthority(
              getProperty(route, "authority", "")
            )
        );
        const currentRoute: string = this.router.url;
        this.selectedIndex = this.routes.findIndex((route) => {
          return route.routerLink === currentRoute;
        });
        this.logoClass.next(getProperty(config, "logoClass", ""));
        const logoIcon =
          getProperty(config, "navbarLogo", "") ||
          getProperty(config, "logo", "");

        this.logoIcon.next(logoIcon);
      });
    });
  }

  onSinenavToggle(e: boolean) {
    this.sideNavState = e;
    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200);
    this._sidenavService.sideNavState$.next(this.sideNavState);
  }
}
