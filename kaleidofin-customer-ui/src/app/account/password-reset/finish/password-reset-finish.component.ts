import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";

import { PasswordResetFinishService } from "./password-reset-finish.service";

@Component({
  selector: "ig-password-reset-finish",
  templateUrl: "./password-reset-finish.component.html",
  styleUrls: ["../../../home/kaleidofin-home.scss"],
})
export class PasswordResetFinishComponent implements OnInit {
  error: string = "";
  keyMissing: boolean = false;
  resetAccount: any;
  key: string = "";

  confirmPassword: string = "";
  password: string = "";
  hide: boolean = true;

  resetPasswordAcknowledged: boolean = false;
  
  resetForm: FormGroup;
  errorMatchers = new ErrorStateMatcher();

  constructor(
    private readonly passwordResetFinishService: PasswordResetFinishService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.key = params["key"];
    });
    this.resetAccount = {};
    this.keyMissing = !this.key;
    if (this.key === null || this.key === "null") {
      this.snackBar.open("Reset key does not exists", "", { duration: 5000 });
      this.navigateToLogin();
    }
  }

  finishReset() {
    this.error = "";
    if (this.resetAccount.password !== this.confirmPassword) {
      this.snackBar.open(
        "The password and confirm password do not match!",
        "",
        { duration: 5000 }
      );
    } else {
      this.passwordResetFinishService
        .save({ key: this.key, newPassword: this.resetAccount.password })
        .subscribe(
          () => {
            this.resetPasswordAcknowledged=true
          },
          () => {
            this.snackBar.open("Reset link expired", "", { duration: 5000 });
            this.navigateToLogin();
          }
        );
    }
  }

  navigateToLogin() {
    this.router.navigateByUrl("login");
  }
}
