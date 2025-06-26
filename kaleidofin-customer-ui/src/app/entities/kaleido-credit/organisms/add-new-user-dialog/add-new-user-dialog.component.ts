import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import {
  HrmsUser,
  UserDTO,
  CreateUserRequestDto,
  StatusENUM,
} from "../../services/user-access-management/user-access-management.constants";
import { UserAccessManagementService } from "../../services/user-access-management/user-access-management.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { UamConfirmationPopupComponent } from "../../molecules/uam-confirmation-popup/uam-confirmation-popup.component";
import { get } from "lodash";
import { getProperty } from "src/app/utils/app.utils";
import { CustomFormValidatorsService } from "../../services/custom-form-validators/custom-form-validators.service";
import { AssociateLenderService } from "../../services/associate-lender/associate-lender.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CustomSnackbarComponent } from "../../molecules/custom-snackbar/custom-snackbar.component";
@Component({
    selector: "app-add-new-user-dialog",
    templateUrl: "./add-new-user-dialog.component.html",
    styleUrls: ["./add-new-user-dialog.component.scss"],
    standalone: false
})

export class AddNewUserDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly dialogData,
    private readonly dialogRef: MatDialogRef<AddNewUserDialogComponent>,
    private readonly userAccessManagementService: UserAccessManagementService,
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly customFormValidationService: CustomFormValidatorsService,
    private readonly associateLenderService: AssociateLenderService,
    private readonly snackbar: MatSnackBar
  ) {}

  currentUser: any;
  userFetchSuccess: boolean = false;
  selectedRoles: string[] = [];
  passwordForm: FormGroup;
  createNewUser: boolean = false;
  userDetailsMap: Record<string, any>[] = [];
  hrmsInput: FormControl;
  roleTypeOptions: Record<string, any>[] = [];
  errorMessage: string;
  isSyncing: boolean = false;
  isSyncSuccess: boolean = false;

  ngOnInit(): void {
    this.hrmsInput = this.fb.control("", [Validators.required]);
    this.passwordForm = this.fb.group(
       {
        changePassword: [
          "",
          [
            Validators.required,
            this.customFormValidationService.passwordValidator(
              this.associateLenderService.passwordRulesMap
            ),
          ],
        ],
        confirmPassword: ["", [Validators.required]],
      },
      {
        validators: this.userAccessManagementService.passwordMatchValidator
      }
    );
    this.createNewUser = get(this.dialogData, "createNewUser", false);
    this.currentUser = getProperty(this.dialogData, "userData", {});
    this.userDetailsMap = getProperty(this.dialogData, "userDetailsMap", {});
    this.selectedRoles = (this.currentUser as UserDTO)?.role ?? [];
    this.roleTypeOptions = getProperty(this.dialogData, "roleTypeOptions", []);
  }

  fetchUser(): void {
    this.userAccessManagementService
      .fetchUamUser(this.hrmsInput.value)
      .subscribe({
        next: (data: HrmsUser) => {
          this.currentUser = data;
          this.userFetchSuccess = true;
          this.hrmsInput.setErrors(null);
          this.hrmsInput.disable();
        },
        error: (error) => {
          this.errorMessage = getProperty(
            error,
            "error.message",
            "HRMS ID not found, Please enter a valid HRMS ID"
          );
          this.hrmsInput.setErrors({ invalidId: true });
        },
      });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  updateSelectedRoles(roles: string[]): void {
    this.selectedRoles = roles;
    (this.currentUser as UserDTO).role = roles;
  }

  submit(): void {
    const confirmationText = `Are you sure you want to add ${
      this.currentUser.firstName
    } ${this.currentUser.lastName} as ${this.selectedRoles.toLocaleString()}?`;
    this.dialog.open(UamConfirmationPopupComponent, {
      disableClose: true,
      data: {
        popup_type: "CREATE_UPDATE_USER",
        confirmationText,
        buttonText: "Yes, Add",
        userData: this.createUserRequestPayload(this.currentUser as HrmsUser),
        successText: "User Added Successfully",
      },
    });
    this.dialogRef.close();
  }

  syncWithHrms(): void {
    this.isSyncing = true;
    this.isSyncSuccess = false;
    const hrmsId = (this.currentUser as UserDTO)?.externalId ?? '';
    setTimeout(()=> {
      this.userAccessManagementService.fetchUamUser(hrmsId, true, this.selectedRoles).subscribe(
        {
          next: (res: HrmsUser)=> {
            this.isSyncing = false;
            this.isSyncSuccess = true;
            const status: string = this.currentUser?.status ?? "ACTIVE";
            this.currentUser = {...this.currentUser, ...res, status};
            this.snackbar.openFromComponent(CustomSnackbarComponent, {
              data: {
                message: 'Successfully updated',
                type: 'success',
              },
              panelClass: "custom-snackbar",
              duration: 3000
            })
          },
          error : (error)=> {
            const errorMessage = getProperty(error?.error, "message", null) ?? 'Sync failed. Please retry after sometime';
            this.isSyncing = false;
            this.snackbar.openFromComponent(CustomSnackbarComponent, {
              data: {
                message: errorMessage,
                type: 'error',
              },
              panelClass: "custom-snackbar",
              duration: 3000,
            });
          }
        }
      );
    }, 1500)
  }

  update(): void {
    const confirmationText = `Are you sure you want to update the details?`;
    this.dialog.open(UamConfirmationPopupComponent, {
      disableClose: true,
      data: {
        popup_type: "CREATE_UPDATE_USER",
        confirmationText,
        buttonText: "Yes, Update",
        userData: this.updateUserRequestPayload(this.currentUser as UserDTO),
        successText: "User Updated Successfully",
      },
    });
    this.dialogRef.close();
  }

  createUserRequestPayload(user: HrmsUser): CreateUserRequestDto {
    return {
      username: user.empLdapUserId,
      firstname: user.firstName,
      middleName: user.middleName,
      lastname: user.lastName,
      email: user.emailId,
      roles: this.selectedRoles,
      status: "ACTIVE",
      requestUUID: user.requestUUID,
      mobileNumber: user.mobileNumber,
      password: this.passwordForm.get("changePassword").value,
      employeeId: user.employeeId,
    };
  }

  updateUserRequestPayload(user: UserDTO): CreateUserRequestDto {
    return {
      username: user.login,
      firstname: user.firstName,
      lastname: user.lastName,
      mobileNumber: user.mobileNumber,
      email: user.email,
      langKey: user.langKey,
      roles: this.selectedRoles,
      employeeId: user.externalId,
      partnerId: user.partnerId,
      status: user.status,
      id: user.id,
    };
  }
}
