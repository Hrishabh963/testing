import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  CHANGE_USER_STATUS,
  CREATE_UPDATE_USER,
  FETCH_ALL_USERS,
  FETCH_UAM_USER,
  GET_USER_COUNT,
} from "src/app/shared/constants/Api.constants";
import {
  CreateUserRequestDto,
  UserCountDTO,
  UserDTO,
  UserSearchDTO,
  UserStatusUpdateDTO,
} from "./user-access-management.constants";
import { Observable, Subject } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CustomSuccessSnackBar } from "../../molecules/custom-success-snackbar/custom-success-snackbar";
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { get, isArray } from "lodash";

@Injectable({
  providedIn: "root",
})
export class UserAccessManagementService {
  private userUpdateSubject: Subject<void> = new Subject<void>();
  constructor(
    private readonly http: HttpClient,
    private readonly snackbar: MatSnackBar
  ) {}

  getUserUpdateListener(): Observable<void> {
    return this.userUpdateSubject.asObservable();
  }

  fetchUamUser(hrmsId: number | string, isSync: boolean = false, roles?: string[]) {
    if (isSync) {
      let params = new HttpParams().append("isSyncRequired", true);
      const encodedRoles = encodeURIComponent(roles?.join(",") ?? "");
      params = params.append("roles", encodedRoles);
      return this.http.get(`${FETCH_UAM_USER}/${hrmsId}`, { params });
    }
    return this.http.get(`${FETCH_UAM_USER}/${hrmsId}`);
  }

  createUpdateUser(
    user: CreateUserRequestDto,
    successText: string,
    callbackFunc: Function,
    isChangePassword = false
  ): void {
    this.http.post(CREATE_UPDATE_USER, user).subscribe({
      next: () => {
        this.snackbar.openFromComponent(CustomSuccessSnackBar, {
          duration: 2500,
          data: {
            message: successText || "Success",
          },
        });
        this.userUpdateSubject.next();
        callbackFunc();
      },
      error: (error) => {
        console.error(error);
        let errorMessage = get(
          error,
          "error.message",
          "An unexpected error occurred. Please try again."
        );
        const urlRegex = /http[s]?:\/\/\S+/g;
        if (urlRegex.test(errorMessage)) {
          errorMessage = "An unexpected error occurred. Please try again.";
        }
        this.snackbar.open(errorMessage, "Close", {
          duration: 4000,
        });

        if (!isChangePassword) {
          callbackFunc("cancelled");
        }
      },
    });
  }

  changeUserStatus(
    userId: number,
    payload: UserStatusUpdateDTO
  ): Observable<any> {
    let params = new HttpParams();
    Object.keys(payload).forEach((key) => {
      params = params.append(key, payload[key]);
    });
    return this.http.post(`${CHANGE_USER_STATUS}/${userId}`, null, {
      params,
      responseType: "text",
    });
  }

  fetchAllUsers(params: UserSearchDTO = null): Observable<any> {
    let queryParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (isArray(params[key])) {
          queryParams = queryParams.append(key, params[key]?.join(","));
        } else {
          queryParams = queryParams.append(key, params[key]);
        }
      });
    }
    return this.http.get<UserDTO[]>(FETCH_ALL_USERS, { params: queryParams });
  }

  passwordMatchValidator: ValidatorFn = (
    formGroup: AbstractControl
  ): ValidationErrors | null => {
    const passwordControl = formGroup.get("changePassword");
    const confirmPasswordControl = formGroup.get("confirmPassword");

    if (!passwordControl || !confirmPasswordControl) return null;

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    // Don't validate if one of the fields is empty
    if (!password || !confirmPassword) {
      return null;
    }

    let passwordErrors = passwordControl.errors || {};
    let confirmPasswordErrors = confirmPasswordControl.errors || {};

    if (password !== confirmPassword) {
      passwordErrors["passwordMismatch"] = true;
      confirmPasswordErrors["passwordMismatch"] = true;
    } else {
      delete passwordErrors["passwordMismatch"];
      delete confirmPasswordErrors["passwordMismatch"];
    }

    passwordControl.setErrors(
      Object.keys(passwordErrors).length ? passwordErrors : null
    );
    confirmPasswordControl.setErrors(
      Object.keys(confirmPasswordErrors).length ? confirmPasswordErrors : null
    );
    return password !== confirmPassword ? { passwordMismatch: true } : null;
  };

  fetchUserCount(lenderCode: string): Observable<UserCountDTO> {
    const params = new HttpParams().append("lenderCode", lenderCode);
    return this.http.get<UserCountDTO>(GET_USER_COUNT, { params });
  }
}
