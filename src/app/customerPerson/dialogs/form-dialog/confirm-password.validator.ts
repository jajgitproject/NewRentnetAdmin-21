// @ts-nocheck
import { AbstractControl, FormGroup } from "@angular/forms";
export function ConfirmPasswordValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      let control = formGroup.controls[controlName];
      let matchingControl = formGroup.controls[matchingControlName]
      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmPasswordValidator
      ) {
        return;
      }
      const password = control.value ?? '';
      const confirmPassword = matchingControl.value ?? '';
      if (!password && !confirmPassword) {
        matchingControl.setErrors(null);
        return;
      }
      if (password !== confirmPassword) {
        matchingControl.setErrors({ confirmPasswordValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
