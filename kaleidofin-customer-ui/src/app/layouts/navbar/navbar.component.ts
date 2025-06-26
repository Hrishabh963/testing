import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { UI_COMPONENTS } from "src/app/constants/ui-config";
import { PrincipalService } from "src/app/core";
import { ROLES } from "src/app/core/auth/roles.constants";
import { UiConfigService } from "src/app/entities/kaleido-credit/services/ui-config.service";
import { UserInactivityService } from "src/app/entities/kaleido-credit/services/user-inactivity.service";
import { getProperty } from "src/app/utils/app.utils";
import { DashboardService } from "../../entities/dashboard/dashboard.service";
import {
  animateText,
  onMainContentChange,
  onSideNavChange,
} from "./animations";
import { TopNavService } from "./topnav.service";

@Component({
  selector: "ig-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["navbar.scss"],
  animations: [onSideNavChange, animateText, onMainContentChange],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = true;
  hidden: boolean = false;
  public sideNavState: boolean = false;
  public linkText: boolean = false;
  videoId: string = "";
  mobile: boolean = false;
  dashboard: boolean = false;
  helponly: boolean = false;
  noGoalIcon: boolean = false;
  fhc: boolean = false;
  none: boolean = false;
  account: any;
  partnerName: string;
  kcreditUi: boolean = false;
  logoClass: BehaviorSubject<string> = new BehaviorSubject<string>("");
  logoIcon: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly principal: PrincipalService,
    public readonly dialog: MatDialog,
    private readonly dashboardService: DashboardService,
    private readonly uiConfigService: UiConfigService,
    public readonly topNavService: TopNavService,
    private readonly userInactivityService: UserInactivityService
  ) {
    this.isAuthenticated = false;
    this.partnerName = "";
  }

  ngOnDestroy() {
    this.userInactivityService.clearInUserInActivityCheck();
    this.userInactivityService.logoutPopupShown.next(true);
  }
  ngOnInit() {
    this.dashboardService.getMessage().subscribe((data) => {
      if (data !== undefined || data !== null) {
        if (data.page === "shownav" || data.page === "hidden") {
          this.isAuthenticated = true;
          this.principal.identity().then((account) => {
            this.userInactivityService.logoutPopupShown.next(false);
            this.account = account;
            if (this.account.role === ROLES.ROLE_KP_PARTNER) {
              this.partnerName = this.account.extraInfo.partnerName;
              this.kcreditUi = false;
            } else {
              this.partnerName = "";
              this.kcreditUi = true;
            }
          });
          if (data.page === "hidden") {
            this.hidden = true;
          } else {
            this.hidden = false;
          }
        } else {
          this.isAuthenticated = false;
        }
      } else {
        this.isAuthenticated = false;
      }
    });
    this.uiConfigService.getUiConfigurations().subscribe((configurations) => {
      let config = getProperty(configurations, UI_COMPONENTS.NAV_ROUTES, {});
      this.logoClass.next(getProperty(config, "logoClass", ""));
      const logoIcon =
        getProperty(config, "navbarLogo", "") ||
        getProperty(config, "logo", "");

      this.logoIcon.next(logoIcon);
    });
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  @HostListener("window:mousemove", ["$event"])
  refreshUserState(event: MouseEvent) {
    this.handleUserActivity();
  }

  @HostListener("window:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.handleUserActivity();
  }

  private handleUserActivity() {
    this.userInactivityService.logoutPopupShown.subscribe((canShowLogout) => {
      if (!canShowLogout) {
        this.userInactivityService.clearInUserInActivityCheck();
        this.userInactivityService.checkUserInactivity();
      }
    });
  }
}
