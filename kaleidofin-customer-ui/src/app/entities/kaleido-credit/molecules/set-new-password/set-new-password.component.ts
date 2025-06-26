import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { get } from "lodash";
import { PasswordResetFinishService, PasswordService } from "src/app/account";
import {
  ForgotPwdRequest,
  PwdChangeRequest,
} from "src/app/constants/login/password.constants";
import { CustomValidator } from "src/app/shared/validations/custom.validation";
import { getProperty } from "src/app/utils/app.utils";
import { CustomSuccessSnackBar } from "../custom-success-snackbar/custom-success-snackbar";
@Component({
  selector: "app-set-new-password",
  templateUrl: "./set-new-password.component.html",
  styleUrls: ["./set-new-password.component.scss"],
})
export class SetNewPasswordComponent implements OnInit {
  myForm: FormGroup;
  key: string = "";
  remainingRequirements: Array<string> = [];
  showPasswordError: boolean = false;
  @Output() dataEmitter: EventEmitter<any> = new EventEmitter<any>();

  formFields: Array<any> = [
    {
      inputType: "text",
      label: "Username or Email*",
      formControlName: "email",
      toolTipValid: false,
      placeholder: "Enter username or email",
    },
    {
      inputType: "password",
      label: "New Password*",
      formControlName: "newPassword",
      toolTipValid: true,
      placeholder: "Enter New Password",
      showGuidelines: true,
      showRequirements: true,
    },
    {
      inputType: "password",
      label: "Confirm New Password*",
      formControlName: "confirmPassword",
      toolTipValid: true,
      placeholder: "Enter New Password",
      showError: true,
      error: "Passwords do not match",
      showGuidelines: true,
    },
  ];

  changePasswordFields: Array<any> = [
    {
      inputType: "password",
      label: "Current Password*",
      formControlName: "currentPassword",
      toolTipValid: false,
      placeholder: "Enter Current Password",
      error: "You have entered incorrect password.",
      isCurrentPassword: true,
    },
    {
      inputType: "password",
      label: "New Password*",
      formControlName: "newPassword",
      toolTipValid: true,
      placeholder: "Enter New Password",
      showGuidelines: true,
      showRequirements: true,
    },
    {
      inputType: "password",
      label: "Confirm New Password*",
      formControlName: "confirmPassword",
      toolTipValid: true,
      placeholder: "Enter New Password Again",
      showError: true,
      error: "Passwords do not match",
      showGuidelines: true,
    },
  ];

  currentForm: any = {};

  passwordChange: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly validator: CustomValidator,
    private readonly resetFinishService: PasswordResetFinishService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly snackbar: MatSnackBar,
    private readonly passwordService: PasswordService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((param) => {
      this.key = getProperty(param, "key", null);
      this.passwordChange = get(param, "changePassword", false);
      if (this.passwordChange) {
        this.currentForm = this.changePasswordFields;
        this.myForm = this.fb.group(
          {
            currentPassword: ["", Validators.required],
            newPassword: ["", [Validators.required]],
            confirmPassword: ["", [Validators.required]],
          },
          {
            validators: Validators.compose([
              this.validator.matchPassword("newPassword", "confirmPassword"),
            ]),
          }
        );
      } else {
        this.currentForm = this.formFields;
        this.myForm = this.fb.group(
          {
            email: [
              "",
              Validators.required,
              this.validator.usernameOrEmailValidator(),
            ],
            confirmPassword: ["", [Validators.required]],
            newPassword: ["", [Validators.required]],
          },
          {
            validators: Validators.compose([
              this.validator.matchPassword("newPassword", "confirmPassword"),
            ]),
          }
        );
      }
    });
  }

  resetPasswordViaMail(): void {
    this.router.navigate(["/reset"]);
  }

  async onSubmit() {
    try {
      const response = await this.resetFinishService.createTokenByClienCreds();
      const accessToken: string = get(response, "access_token", "");

      if (this.passwordChange) {
        await this.handlePasswordChange(accessToken);
      } else {
        await this.handlePasswordReset(accessToken);
      }
    } catch (error) {
      console.error(error);
      this.showErrorSnackbar("Error in updating Password");
    }
  }

  private async handlePasswordChange(accessToken: string): Promise<void> {
    const tempUser: string = sessionStorage.getItem("tempUser");
    const payload: PwdChangeRequest = {
      username: tempUser ?? null,
      currentPwd: this.myForm?.value?.currentPassword ?? null,
      newPwd: this.myForm?.value?.newPassword ?? null,
    };

    this.passwordService.changePassword(payload, accessToken).subscribe(
      (res) => this.handlePasswordChangeResponse(res),
      (error) => this.showErrorSnackbar("Error in updating Password", error)
    );
  }

  private async handlePasswordReset(accessToken: string): Promise<void> {
    const payload: ForgotPwdRequest = {
      usernameOrEmailId: this.myForm?.value?.email ?? null,
      key: this.key,
      newPwd: this.myForm.value?.newPassword ?? null,
    };

    this.resetFinishService.resetPassword(payload, accessToken).subscribe(
      (res) => this.handlePasswordResetResponse(res),
      (error) => this.showErrorSnackbar("Error in updating Password", error)
    );
  }

  private handlePasswordChangeResponse(res: any): void {
    if (get(res, "success", false)) {
      this.snackbar.openFromComponent(CustomSuccessSnackBar, {
        data: { message: "New password set successfully" },
        duration: 3000,
      });
      this.router.navigate(["/"])
    } else {
      const failedRequirements: string[] = getProperty(
        res,
        "failedRequirements",
        []
      );
      this.handlePasswordError(failedRequirements);
    }
  }

  private handlePasswordResetResponse(res: any): void {
    if (get(res, "success", false)) {
      this.dataEmitter.emit("Password Changed Notification");
    } else {
      const failedRequirements: string[] = getProperty(
        res,
        "failedRequirements",
        []
      );
      this.handlePasswordError(failedRequirements);
    }
  }

  private showErrorSnackbar(message: string, error?: any): void {
    this.snackbar.open(message, "", {
      duration: 3000,
      politeness: "assertive",
    });
    if (error) console.error(error);
  }

  handlePasswordError(failedRequirements: string[]): void {
    this.showPasswordError = failedRequirements.includes(
      "incorrect credentials"
    );
    this.remainingRequirements = failedRequirements.filter(
      (requirement) => requirement !== "incorrect credentials"
    );
  }
}
