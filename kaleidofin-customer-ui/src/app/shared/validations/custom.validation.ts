import { AbstractControl, ValidationErrors, Validators,ValidatorFn, FormControl } from '@angular/forms';
import * as _moment from 'moment';
// @ts-ignore
import { Injectable } from '@angular/core';

const moment = _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};

@Injectable({
  providedIn: "root",
})
export class CustomValidator {
  dateMinimum(minDate: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null) {
        return null;
      }
      const controlDate = moment(control.value);
      if (!controlDate.isValid()) {
        return null;
      }

      const validationDate = moment(minDate);

      console.log(control);
      return controlDate.isBefore(validationDate)
        ? null
        : {
            "date-minimum": {
              "date-minimum": validationDate,
              actuel: controlDate,
            },
          };
    };
  }

  dateMaximum(maxDate: string): Validators {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null) {
        return null;
      }

      const controlDate = moment(control.value);

      if (!controlDate.isValid()) {
        return null;
      }

      const validationDate = moment(maxDate);

      return controlDate.isAfter(validationDate)
        ? null
        : {
            "date-maximum": {
              "date-maximum": validationDate,
              actuel: controlDate,
            },
          };
    };
  }

  matchPassword(password: string, confirmPassword: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const passwordControl = control.get(password)?.value;
      const confirmPasswordControl = control.get(confirmPassword)?.value;
  
      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }
  
      return passwordControl === confirmPasswordControl ? null : { passwordMismatch: true };
    };
  }
  
  

  selectValidator(options: any) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || options === null || options === undefined) {
        return null;
      }
      const matched = options.filter(
        (option: { code: any }) => option.code === control.value
      );

      if (matched.length > 0) {
        return null;
      } else {
        return { selectValidator: true };
      }
    };
  }

  selectNameValidator(options: any) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || options === null || options === undefined) {
        return null;
      }
      const matched = options.filter(
        (option: { name: any }) => option.name === control.value
      );

      if (matched.length > 0) {
        return null;
      } else {
        return { selectNameValidator: true };
      }
    };
  }

  panNumberValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === "") {
        return null;
      }
      const panNumber: string = control.value;
      const panRegex = /^[A-Z]{3}P[A-Z]\d{4}[A-Z]$/;
      return panRegex.test(panNumber) ? null : { pattern: true };
    };
  }

  nameValidators() {
    return (control: AbstractControl): ValidationErrors | null => {
      const nameRegex = "^[a-zA-Z .']+$";
      if (control.value === null || control.value === "") {
        return null;
      }
      if (control?.value?.match(nameRegex)) {
        return null;
      }
      return { pattern: true };
    };
  }

  xssScriptValidators() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === "") {
        return null;
      }
      const nameRegex =
        "<(?=.*? .*?/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?</";
      if (control?.value?.match(nameRegex)) {
        return { pattern: true };
      }
      return null;
    };
  }

  whiteSpaceValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === "") {
        return null;
      }
      let str: any = control.value;
      if (str && str !== null) {
        str = str.trim();
      }
      if (str && str !== null && str.length == 0) {
        return { emptyString: true };
      }
      return str;
    };
  }

  matchBankAccount(controlName: string) {
    let confirmBankAccount: any;
    return (control: AbstractControl): ValidationErrors | null => {
      confirmBankAccount = control?.parent?.get("confirmBankAccount");
      if (control.value === null || control.value === "") {
        return null;
      }
      if (confirmBankAccount) {
        let accountValue =
          control?.parent?.get(controlName)?.value || undefined;
        if (accountValue != control.value) {
          if (controlName == "bankAccount") {
            return { noMatch: true };
          }
          confirmBankAccount.setErrors({ noMatch: true });
        } else {
          confirmBankAccount.setErrors(null);
          return null;
        }
      }
      return null;
    };
  }

  customerNameMatcher(customerName: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const NomineeName = control.value.replace(/[. ]+/g, "");
      const customerNameRep = customerName.replace(/[. ]+/g, "");
      if (customerNameRep.toLowerCase() == NomineeName.toLowerCase()) {
        return { customerNameMatch: true };
      } else {
        return null;
      }
    };
  }

  /**
 * Custom validator to check if the input is either a valid email or a valid username.
 * @returns A ValidatorFn which checks the value of the control.
 */

  usernameOrEmailValidator(): ValidatorFn {
    return(control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if(!value) {
        return null;
      }
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const usernamePattern = /^[\.a-zA-Z0-9_-]{1,50}$/;
  
      const isEmail = emailPattern.test(value);
      const isUsername = usernamePattern.test(value);
  
      if (!isEmail && !isUsername) {
        return { emailOrUsername: true };
      }
  
      return null;
    }
  }

  forbiddenNameMatcher(namelist: Array<string>) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const value = control.value.toUpperCase();
      if (namelist.indexOf(value) !== -1) {
        return { pattern: true };
      } else {
        return null;
      }
    };
  }

  isJson(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  emptyValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === "") {
        return { emptyValue: true };
      }
      return null;
    };
  }

  dateRangeValidator(
    startDateField: string,
    endDateField: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startDate = control.get(startDateField)?.value;
      const endDate = control.get(endDateField)?.value;

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const maxDuration = 91 * 24 * 60 * 60 * 1000;

        if (end < start) {
          return { dateRangeInvalid: true };
        }

        if (end.getTime() - start.getTime() > maxDuration) {
          return { dateExceedsThreeMonths: true };
        }
      }
      return null;
    };
  }

  regexValidator(customRegex: string): ValidatorFn {
    return (control: FormControl): ValidationErrors | null => {
      if (control.value.length > 0) {
        const regex = new RegExp(customRegex);
        const isValid = regex.test(control.value);
        return isValid ? null : { invalidPattern: true };
      }
      return null;
    };
  }
} 
