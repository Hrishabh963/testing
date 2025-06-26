import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject } from "rxjs";
import { UI_COMPONENTS } from "src/app/constants/ui-config";
import { AuthJwtService } from "src/app/core/auth/auth-jwt.service";
import { getProperty } from "src/app/utils/app.utils";
import { UserInactivityPopupComponent } from "../atoms/user-inactivity-popup/user-inactivity-popup.component";
import { UiConfigService } from "./ui-config.service";

@Injectable({
  providedIn: "root",
})
export class UserInactivityService {
  private configurations: any = null;
  private userActivity;

  readonly logoutPopupShown: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  constructor(
    private readonly dialog: MatDialog,
    private readonly uiConfigService: UiConfigService,
    private readonly authService: AuthJwtService
  ) {}

  loadConfigurations() {
    this.uiConfigService
      .getUiConfigBySection(
        UI_COMPONENTS.USER_INACTIVITY,
        UI_COMPONENTS.PLATFORM
      )
      .subscribe((config: Array<any>) => {
        let data = this.uiConfigService.getUiConfigurationsBySection(
          config,
          UI_COMPONENTS.USER_INACTIVITY,
          true
        );
        this.configurations = data;
      });
  }

  checkUserInactivity() {
    let inactivityThreshold =
      getProperty(this.configurations, "idleDuration", 0) * 60 * 1000;
    let enableUserInactivityCheck = getProperty(
      this.configurations,
      "enableUserInactivityCheck",
      false
    );
    if (!enableUserInactivityCheck || !inactivityThreshold) {
      return;
    }
    this.userActivity = setTimeout(() => {
      this.logoutPopupShown.next(true);
      this.authService.logout().then(() => this.alertUser());
    }, inactivityThreshold);
  }

  alertUser() {
    let model = this.dialog.open(UserInactivityPopupComponent, {
      width: "38vw",
      maxHeight: "40vh",
      disableClose: true,
    });
    model.afterClosed().subscribe(() => {
      this.clearInUserInActivityCheck();
      this.logoutPopupShown.next(true);
    });
  }
  clearInUserInActivityCheck() {
    clearTimeout(this.userActivity);
  }
}
