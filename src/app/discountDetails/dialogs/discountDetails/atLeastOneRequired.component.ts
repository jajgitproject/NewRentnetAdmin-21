// @ts-nocheck
import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const atLeastOneRequired: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
  const PackageRate = formGroup.get('isAllowedOnPackageRate')?.value;
  const Extras = formGroup.get('isAllowedOnExtras')?.value;

  if (PackageRate || Extras) 
  {
    return null;
  }
  else
  {
    return { atLeastOneRequired: true };
  }
};

