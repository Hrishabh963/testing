import { Component, OnInit } from "@angular/core";
import { MENU_ENUM, UI_COMPONENTS } from "src/app/constants/ui-config";
import { LoginService, PrincipalService } from "src/app/core";
import { UserInfo } from "src/app/core/auth/UserInfo.constant";
import { UiConfigService } from "src/app/entities/kaleido-credit/services/ui-config.service";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "ig-logout",
  templateUrl: "./logout.component.html",
  styleUrls: ["./logout.component.css"],
})
export class LogoutComponent implements OnInit {
  isAuthenticated: boolean = false;
  hidden: boolean = true;
  username: string = "";
  userInfo: UserInfo = {};
  appMenuConfig: Record<MENU_ENUM, boolean> = {
    DISABLE_CHANGE_PASSWORD: false,
    DISABLE_HELP: false,
    DISABLE_LOGOUT: false,
    DISABLE_PROFILE_INFO: false,
  };

  constructor(
    private readonly loginService: LoginService,
    private readonly principalService: PrincipalService,
    private readonly uiConfigService: UiConfigService
  ) {
    this.isAuthenticated = false;
    this.username = this.principalService.getUserName();
    this.userInfo = this.principalService.getUserInfo();
  }

  ngOnInit(): void {
    this.uiConfigService.getUiConfigurations().subscribe((configurations) => {
      let config = getProperty(configurations, UI_COMPONENTS.NAV_ROUTES, {});
      const menuConfig = getProperty(config, "appMenuConfig", {}) ?? {};
      this.appMenuConfig = {
        ...this.appMenuConfig,
        ...menuConfig,
      };
    });
  }

  logout() {
    this.loginService.logout();
  }

  navigatePage(
    route: string,
    showData: boolean = false,
    contentType?: string
  ): void {
    const serializedData: string = window.btoa(
      encodeURIComponent(JSON.stringify(this.userInfo))
    );
    const currentUrl: string = window.location.href;
    const baseUrl: string = currentUrl.split("/#/")[0];
    let newUrl: string = `${baseUrl}/#/${route}`;
    if (showData) {
      newUrl = `${newUrl}?data=${serializedData}&contentType=${contentType}`;
    }
    window.open(newUrl, "_blank");
  }

  formatDateTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    const formattedDate = new Intl.DateTimeFormat("en-US").format(date);
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "pm" : "am";
    const formattedTime = `${hours}:${minutes} ${ampm}`;
    return `${formattedDate} - ${formattedTime}`;
  }
}
