import { Injectable } from "@angular/core";
import { PasswordValidation } from "./custom-form-validation.constants";
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class CustomFormValidatorsService {
  constructor() {}

  /**
   * Custom password validator that checks password strength based on dynamic rules.
   * Merges errors with existing errors instead of overriding them.
   *
   * @param rules - The password validation rules fetched from the backend.
   * @returns A ValidatorFn that checks password constraints and preserves existing errors.
   */
  passwordValidator(rules: PasswordValidation | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!rules) {
        return null;
      }

      const password: string = control.value;

      let existingErrors = control.errors ? { ...control.errors } : {};
      delete existingErrors["passwordError"];
      if(password?.length) {
        control.markAsTouched();
        delete existingErrors["required"];
      }
      if (!password) {
        return Object.keys(existingErrors).length > 0 ? existingErrors : null;
      }

      let errors: ValidationErrors = { ...existingErrors }; // Preserve non-password-related errors

      // Count occurrences of lowercase, uppercase characters and numeric character
      const lowercaseCount = (password?.match(/[a-z]/g) || [])?.length ?? 0;
      const uppercaseCount = (password?.match(/[A-Z]/g) || [])?.length ?? 0;
      const numericCount = (password?.match(/[0-9]/g) || [])?.length ?? 0;

      // Prioritized validation checks
      if (rules.minLength !== null && password.length < rules.minLength) {
        errors[
          "passwordError"
        ] = `Password must be at least ${rules.minLength} characters long.`;
      } else if (
        rules.maxLength !== null &&
        password.length > rules.maxLength
      ) {
        errors[
          "passwordError"
        ] = `Password must not exceed ${rules.maxLength} characters.`;
      } else if (rules.lowercase !== null && lowercaseCount === 0) {
        errors[
          "passwordError"
        ] = `Password must contain at least 1 lowercase letter(s).`;
      } else if (rules.uppercase !== null && uppercaseCount === 0) {
        errors[
          "passwordError"
        ] = `Password must contain at least 1 uppercase letter(s).`;
      } else if (rules.numeric !== null && numericCount === 0) {
        errors[
          "passwordError"
        ] = `Password must contain at least 1 numeric digit(s).`;
      } else if (
        rules.specialCharacters !== null &&
        rules.specialCharacters.length > 0
      ) {
        const escaped = rules.specialCharacters.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

        const allowedRegex = new RegExp(`[${escaped}]`);
        const disallowedRegex = new RegExp(`[^a-zA-Z0-9${escaped}]`);
      
        if (!allowedRegex.test(password)) {
          errors[
            "passwordError"
          ] = `Password must contain at least one of these special characters: ${rules.specialCharacters}`;
        } 
         if (disallowedRegex.test(password)) {

          errors[
            "passwordError"
          ] = `Password contains disallowed special characters. Only use: ${rules.specialCharacters}`;
        }
      }

      return Object.keys(errors).length > 0 ? errors : null; // Return errors only if any exist
    };
  }
}
