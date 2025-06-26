import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-password-changed-notify",
  templateUrl: "./password-changed-notify.component.html"
})
export class PasswordChangedNotifyComponent {
  constructor(private readonly route: Router) {}
  redirectToHome(): void {
    this.route.navigate(["/"]);
  }
}
