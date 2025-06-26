import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { getProperty } from "src/app/utils/app.utils";
import { UserAccessManagementService } from "../../services/user-access-management/user-access-management.service";
import {
  CreateUserRequestDto,
  StatusENUM,
  UserDTO,
  UserStatusUpdateDTO,
} from "../../services/user-access-management/user-access-management.constants";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { get } from "lodash";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CustomSuccessSnackBar } from "../custom-success-snackbar/custom-success-snackbar";
import { formatDate } from "@angular/common";
import { CustomFormValidatorsService } from "../../services/custom-form-validators/custom-form-validators.service";
import { AssociateLenderService } from "../../services/associate-lender/associate-lender.service";

@Component({
  selector: "app-uam-confirmation-popup",
  templateUrl: "./uam-confirmation-popup.component.html",
  styleUrls: ["./uam-confirmation-popup.component.scss"],
})
export class UamConfirmationPopupComponent implements OnInit {
  popupType: string = null;
  title: string = null;
  confirmationText: string = null;
  buttonText: string = null;
  userData: CreateUserRequestDto | UserDTO;
  successText: string = null;
  passwordFormGroup: FormGroup;
  failedRequirements: string[] = null;
  newStatus: StatusENUM;
  suspendedDays: FormControl;
  minDate: Date = new Date();
  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly dialogData: any,
    private readonly dialogRef: MatDialogRef<UamConfirmationPopupComponent>,
    private readonly uamService: UserAccessManagementService,
    private readonly fb: FormBuilder,
    private readonly snackbar: MatSnackBar,
    private readonly customFormValidation: CustomFormValidatorsService,
    private readonly associateLenderService: AssociateLenderService
  ) {}

  ngOnInit(): void {
    this.minDate.setDate(new Date().getDate() + 1);
    this.suspendedDays = this.fb.control("", [Validators.required]);
    this.passwordFormGroup = this.fb.group(
      {
        changePassword: [
          "",
          [
            Validators.required,
            this.customFormValidation.passwordValidator(
              this.associateLenderService.passwordRulesMap
            ),
          ],
        ],
        confirmPassword: ["", [Validators.required]],
      },
      { validators: this.uamService.passwordMatchValidator, updateOn: "change" }
    );
    this.popupType = getProperty(this.dialogData, "popup_type", null);
    this.title = getProperty(this.dialogData, "title", null);
    this.confirmationText = getProperty(
      this.dialogData,
      "confirmationText",
      null
    );
    this.buttonText = getProperty(this.dialogData, "buttonText", null);
    this.userData = getProperty(this.dialogData, "userData", null);
    this.successText = getProperty(this.dialogData, "successText", null);
    this.newStatus = getProperty(this.dialogData, "newStatus", null);
    this.suspendedDays.valueChanges.subscribe((value) => {
      if (value !== null) {
        const numericValue = value.replace(/[^0-9]/g, "");
        if (value !== numericValue) {
          this.suspendedDays.setValue(numericValue, { emitEvent: false });
        }
      }
    });
  }

  changePassword(): void {
    const userRequestDTO = this.updateUserRequestPayload(
      this.userData as UserDTO
    );
    userRequestDTO.password =
      this.passwordFormGroup.get("changePassword").value;
    this.uamService.createUpdateUser(
      userRequestDTO,
      this.successText,
      this.closeDialog.bind(this),
      true
    );
  }

  handleSuccessResponse(res: any): void {
    const isSuccess = get(res, "success", false);
    if (isSuccess) {
      this.passwordFormGroup.get("changePassword").setErrors(null);
      this.snackbar.openFromComponent(CustomSuccessSnackBar, {
        duration: 2000,
        data: {
          message: "Password changed successfully",
        },
      });
    } else {
      this.failedRequirements = get(res, "failedRequirements", null);
      this.passwordFormGroup.get("changePassword").setErrors({
        passwordRequirementFailed: true,
      });
    }
  }

  createUpdateUser(): void {
    this.uamService.createUpdateUser(
      this.userData as CreateUserRequestDto,
      this.successText,
      this.closeDialog.bind(this)
    );
  }

  closeDialog(message?: "cancelled" | null): void {
    this.dialogRef.close(message);
  }

  changeStatus(): void {
    const payload: UserStatusUpdateDTO = {
      status: this.newStatus,
    };
    if (this.suspendedDays?.value) {
        const reActivationDate = formatDate(this.suspendedDays?.value, "yyyy-MM-dd", "en-US");
        payload.reActivationDate = reActivationDate;
      }
    
    this.uamService.changeUserStatus(this.userData.id, payload).subscribe({
      next: () => {
        this.snackbar.openFromComponent(CustomSuccessSnackBar, {
          data: {
            message: this.successText,
          },
          duration: 3000,
        });
        this.userData.status = this.newStatus;
        this.dialogRef.close();
      },
      error: (err) => {
        let errorObject = err?.error;
        if (typeof errorObject === "string") {
          errorObject = JSON.parse(errorObject);
        }
        this.snackbar.open(
          errorObject?.message ?? "Error changing status",
          "Close",
          {
            duration: 3500,
          }
        );
        console.error(err);
        this.dialogRef.close();
      },
    });
  }

  updateUserRequestPayload(user: UserDTO): CreateUserRequestDto {
    return {
      username: user.login,
      firstname: user.firstName,
      lastname: user.lastName,
      mobileNumber: user.mobileNumber,
      email: user.email,
      langKey: user.langKey,
      roles: user.role,
      employeeId: user.externalId,
      partnerId: user.partnerId,
      status: user.status,
      id: user.id,
    };
  }
}
