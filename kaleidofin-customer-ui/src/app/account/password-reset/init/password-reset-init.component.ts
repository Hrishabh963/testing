import {
  Component,
  OnInit
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EMAIL_NOT_FOUND_TYPE } from "../../../shared";
import { PasswordResetInitService } from "./password-reset-init.service";

@Component({
  selector: "ig-password-reset-init",
  templateUrl: "./password-reset-init.component.html"
})
export class PasswordResetInitComponent implements OnInit {
  error!: string;
  resetAccount: any;
  success!: boolean;
  phoneNumber!: number;
  resetForm!: FormGroup;
  matcher = new ErrorStateMatcher();

  constructor(
    private readonly passwordResetInitService: PasswordResetInitService,
    public readonly snackBar: MatSnackBar,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.resetAccount = {};
    this.validation();
  }

  requestReset() {
    this.phoneNumber = this.resetForm.get("username")?.value;
    this.passwordResetInitService.save(this.phoneNumber).subscribe(
      () => {
        this.snackBar.open(
          `We have sent a reset link to the number you mentioned`,
          "",
          { duration: 5000 }
        );
      },
      response => {
        this.success = false;
        if (
          response.status === 400 &&
          response.error.type === EMAIL_NOT_FOUND_TYPE
        ) {
          this.snackBar.open(`Phone number not found`, "", { duration: 5000 });
        } else {
          this.snackBar.open(response.error, "", { duration: 5000 });
        }
      }
    );
  }

  validation() {
    this.resetForm = this.formBuilder.group({
      username: [
        "",
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(10),
          Validators.maxLength(10)
        ]
      ]
    });
  }
}
