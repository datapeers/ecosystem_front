import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class CustomValidators {
  constructor() {}

  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if the control value is empty return no error.
        return null;
      }

      // test the value of the control against the regexp supplied.
      const valid = regex.test(control.value);

      // if true, return no error, otherwise return the error object passed in the second parameter.
      return valid ? null : error;
    };
  }

  static MatchValidator(controlName: string, targetControlName: string): ValidatorFn {
    return (control: AbstractControl) => {
      const formControlValue: string = control.get(controlName).value;
      const targeFormtControlValue: string = control.get(targetControlName).value;
  
      // if the confirmPassword value is null or empty, don't return an error.
      if (!formControlValue?.length) {
        return null;
      }
  
      // compare the passwords and see if they match.
      if (targeFormtControlValue !== formControlValue) {
        control.get(controlName).setErrors({ mismatch: true });
      }
      return null;
    }
  }
}