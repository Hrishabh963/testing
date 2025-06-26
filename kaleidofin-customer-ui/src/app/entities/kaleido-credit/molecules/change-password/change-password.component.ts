import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { get } from "lodash";
import { PasswordService } from "src/app/account";
import { PwdChangeRequest } from "src/app/constants/login/password.constants";
import { UserInfo } from "src/app/core/auth/UserInfo.constant";
import { CustomValidator } from "src/app/shared/validations/custom.validation";
import { getProperty } from "src/app/utils/app.utils";
import { CustomSuccessSnackBar } from "../custom-success-snackbar/custom-success-snackbar";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  myForm: FormGroup;
  showError: boolean = false;
  @Input() userInfo: UserInfo = {};
  remainingRequirements: Array<string> = [];
  constructor(
    private readonly fb: FormBuilder,
    private readonly validators: CustomValidator,
    private readonly passwordService: PasswordService,
    private readonly snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.myForm = this.fb.group(
      {
        password: ["", Validators.required],
        confirmPassword: ["", [Validators.required]],
        newPassword: ["", [Validators.required]],
      },
      {
        validators: Validators.compose([
          this.validators.matchPassword("newPassword", "confirmPassword"),
        ]),
      }
    );
  }

  clearInput(): void {
    this.myForm.reset();
  }

  changePassword(): void {
    const username: string = this.userInfo.login ?? null;
    const payload: PwdChangeRequest = {
      username,
      currentPwd: this.myForm?.value?.password ?? null,
      newPwd: this.myForm?.value?.newPassword ?? null,
    };
    this.passwordService.changePassword(payload).subscribe(
      (res) => {
        const failedRequirements: Array<string> = getProperty(res, "failedRequirements", []);
        this.showError = !get(res, "success", false) && failedRequirements.includes("incorrect credentials");
        this.remainingRequirements = failedRequirements.filter(
          (requirement) => requirement !== "incorrect credentials"
        );
        if(!this.showError && failedRequirements.length === 0) {
          this.snackbar.openFromComponent(CustomSuccessSnackBar, {
            data: {
              message : "New password set successfully",
              type: "success"
            },
            duration: 3500
          })
        }
      },
      (error) => console.error(error)
    );
    
  }
}
