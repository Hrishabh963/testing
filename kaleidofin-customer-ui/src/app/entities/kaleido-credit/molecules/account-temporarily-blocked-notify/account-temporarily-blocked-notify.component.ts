import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ACCOUNT_TEMPORARILY_LOCKED } from "../../loan/constant";
import { get } from "lodash";

@Component({
  selector: "app-account-temporarily-blocked-notify",
  templateUrl: "./account-temporarily-blocked-notify.component.html",
})
export class AccountTemporarilyBlockedNotifyComponent implements OnInit {
  @Input() metaData: any = {};

  accountLockedErrorText: string = ACCOUNT_TEMPORARILY_LOCKED.DEFAULT;
  hideResetPassword: boolean = true;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.accountLockedErrorText = get(
      this.metaData,
      "accountLockedErrorText",
      ACCOUNT_TEMPORARILY_LOCKED.DEFAULT
    );
    this.hideResetPassword = get(this.metaData, "hideResetPassword", false);
  }
  redirectToResetPassword(): void {
    this.router.navigate(["reset"]);
  }
}
