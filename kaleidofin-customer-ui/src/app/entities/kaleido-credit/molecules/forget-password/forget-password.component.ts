import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { get } from "lodash";
import { PasswordResetFinishService } from "src/app/account";
import { ForgotPwdRequest } from "src/app/constants/login/password.constants";
import { CustomValidator } from "src/app/shared/validations/custom.validation";

@Component({
  selector: "app-forget-password",
  templateUrl: "./forget-password.component.html",
  styleUrls: ["./forget-password.component.scss"],
})
export class ForgetPasswordComponent implements OnInit {
  myForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly validators: CustomValidator,
    private readonly resetFinishService: PasswordResetFinishService
  ) {}

  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();

  triggeredReset: boolean = false;

  ngOnInit(): void {
    this.myForm = this.fb.group({
      email: [
        "",
        [Validators.required, this.validators.usernameOrEmailValidator()],
      ],
    });
  }

  async initiateResetPassword() {
    const emailOrUsername: string = this.myForm?.value?.email ?? null;
    const payload: ForgotPwdRequest = { usernameOrEmailId: emailOrUsername };
    let response = await this.resetFinishService
      .createTokenByClienCreds()
      .catch((err) => console.error(err));
    let access_token = get(response, "access_token", "");
    this.resetFinishService.resetPassword(payload, access_token).subscribe(
      () => {
        this.triggeredReset = true;
      },
      () => {}
    );
  }
}
