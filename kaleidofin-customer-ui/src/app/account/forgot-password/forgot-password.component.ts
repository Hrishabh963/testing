import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { BASE_SERVER_ERROR_TXT } from "src/app/shared";
import { PasswordService } from "../password/password.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["../../home/kaleidofin-home.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  resetForm: FormGroup;
  matchers = new ErrorStateMatcher();
  resetPasswordAcknowledged: boolean = false;
  resendCompleted: boolean = false;
  errors: string = "";

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly passwordService: PasswordService
  ) {
    this.resetForm = formBuilder.group({});
  }

  ngOnInit(): void {
    this.validation();
  }

  resendEmail() {
    let fetchData = async () => {
      try {
        this.reset();
      }
      catch (error) {
        console.log('Error While Resending Email', error);
      }
    }
    fetchData();
    this.resendCompleted = true;
  }

  moveToContacts() {
    this.router.navigate(["contact"]);
  }

  moveToLogin() {
    this.router.navigate(["/"]);
  }

  reset() {
    this.errors = "";
    const email = this.resetForm.get("email")?.value;
    try {
      this.passwordService
        .resetPasswordByEmail(email)
        .pipe(
          catchError((err) => {
            if (err) {
              if (err.status === 502) {
                this.errors = BASE_SERVER_ERROR_TXT || "";
              } else {
                this.errors = err?.error || "";
              }
            }
            return throwError(err);
          })
        )
        .subscribe((response) => {
          console.log("resetPasswordAcknowledged", response);
          this.resetPasswordAcknowledged = true;
        });
    } catch (e) {
      console.log("Error", e);
    }
  }

  validation() {
    this.resetForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }
}
