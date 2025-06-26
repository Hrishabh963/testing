import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-set-new-password-notify",
  templateUrl: "./set-new-password-notify.component.html",
})
export class SetNewPasswordNotifyComponent {
  constructor(private readonly route: Router) {}

  redirect(): void {
    this.route.navigate(["reset/finish"], {
      queryParams: {
        changePassword: true
      }
    });
  }
}
