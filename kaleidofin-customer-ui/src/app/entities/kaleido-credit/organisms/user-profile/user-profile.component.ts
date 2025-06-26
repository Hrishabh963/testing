import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { MENU_ENUM, UI_COMPONENTS } from "src/app/constants/ui-config";
import { getProperty } from "src/app/utils/app.utils";
import { UiConfigService } from "../../services/ui-config.service";
import { UserInfo } from "src/app/core/auth/UserInfo.constant";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class UserProfileComponent implements OnInit {
  logo: BehaviorSubject<string> = new BehaviorSubject<string>("");
  userInfo: UserInfo = {};
  contentType: string = null;
  appMenuConfig: Record<
    Exclude<MENU_ENUM, "DISABLE_HELP" | "DISABLE_LOGOUT">,
    boolean
  > = {
    DISABLE_CHANGE_PASSWORD: false,
    DISABLE_PROFILE_INFO: false,
  };

  constructor(
    private readonly uiConfigService: UiConfigService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getLogo();
    this.route.queryParams.subscribe((params) => {
      if (params.hasOwnProperty("data")) {
        const serializedData: string = params["data"];
        this.userInfo = JSON.parse(
          decodeURIComponent(window.atob(serializedData))
        );
      }
      if (params.hasOwnProperty("contentType")) {
        this.contentType = params["contentType"];
      }
    });
  }

  getLogo(): void {
    this.uiConfigService.getUiConfigurations().subscribe((configurations) => {
      const config = getProperty(configurations, UI_COMPONENTS.NAV_ROUTES, {});
      this.logo.next(getProperty(config, "logo", ""));
      const menuConfig = getProperty(config, "appMenuConfig", {}) ?? {};
      this.appMenuConfig = { ...this.appMenuConfig, ...menuConfig };
    });
  }

  changeSection(selectedContent: string): void {
    if (selectedContent) {
      this.contentType = selectedContent;
    }
  }
}
