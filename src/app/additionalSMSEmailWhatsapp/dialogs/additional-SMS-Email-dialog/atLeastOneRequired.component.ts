// @ts-nocheck
import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const atLeastOneRequired: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
  const email = formGroup.get('emailID')?.value;
  const mobileNumber = formGroup.get('mobileNumber')?.value;

  if (email || mobileNumber) 
  {
    return null;
  }
  else
  {
    return { atLeastOneRequired: true };
  }
};

