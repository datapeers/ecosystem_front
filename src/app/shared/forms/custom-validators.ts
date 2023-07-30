import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

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

  static MatchValidator(
    controlName: string,
    targetControlName: string
  ): ValidatorFn {
    return (control: AbstractControl) => {
      const formControlValue: string = control.get(controlName).value;
      const targeFormtControlValue: string =
        control.get(targetControlName).value;

      // if the confirmPassword value is null or empty, don't return an error.
      if (!formControlValue?.length) {
        return null;
      }

      // compare the passwords and see if they match.
      if (targeFormtControlValue !== formControlValue) {
        control.get(controlName).setErrors({ mismatch: true });
      }
      return null;
    };
  }

  static dateRangeValidator(
    startDateControlName: string,
    endDateControlName: string
  ): ValidatorFn {
    return (control: AbstractControl) => {
      // Get the start and end date controls from the form group
      const startDate = control.get(startDateControlName);
      const endDate = control.get(endDateControlName);
      // Check if both controls exist and the start date is after the end date
      if (startDate && endDate && startDate.value > endDate.value) {
        // Return an object with a 'dateRange' key set to true, indicating the validation has failed
        return { dateRange: true };
      }

      // Return null if the validation has passed
      return null;
    };
  }

  static avoidMatchValidator(
    firstControl: string,
    secondControl: string
  ): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const controlOne = control.get(firstControl)?.value;
      const controlTwo = control.get(secondControl)?.value;
      if (!controlOne || !controlTwo) return null;
      // Comprobar si controlOne y controlTwo son iguales
      if (controlOne === controlTwo) {
        return { avoidMatchValidator: true };
      }
      return null; // La validación pasó
    };
  }
}
