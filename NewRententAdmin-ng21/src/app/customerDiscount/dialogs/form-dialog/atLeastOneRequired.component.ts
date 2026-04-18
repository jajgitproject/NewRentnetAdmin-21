// @ts-nocheck
import { ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';

export const atLeastOneRequired: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
  const pkg = formGroup.get('isAllowedOnPackageRate')?.value;
  const ext = formGroup.get('isAllowedOnExtras')?.value;

  return pkg || ext ? null : { atLeastOneRequired: true };
};

