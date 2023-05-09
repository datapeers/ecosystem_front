import { AbstractControl, UntypedFormGroup } from "@angular/forms";

export const triggerControlValidators = (control: AbstractControl) => {
    control.markAsTouched();
    control.markAsDirty();
    if(control instanceof UntypedFormGroup && control.controls) {
        Object.values(control.controls).map((innerControl) => triggerControlValidators(innerControl));
    }
}