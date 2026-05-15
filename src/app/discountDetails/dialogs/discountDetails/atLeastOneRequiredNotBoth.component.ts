import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const atLeastOneRequiredNotBoth: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
  const discountPercentage = formGroup.get('discountPercentage')?.value;
  const fixedAmountDiscount = formGroup.get('fixedAmountDiscount')?.value;
  const hasDiscountPercentage = discountPercentage !== null && discountPercentage !== undefined && discountPercentage !== '';
  const hasFixedAmountDiscount = fixedAmountDiscount !== null && fixedAmountDiscount !== undefined && fixedAmountDiscount !== '';

  if (!hasDiscountPercentage && !hasFixedAmountDiscount) 
  {
    return { atLeastOneRequiredNotBoth: true };
  }
  if (hasDiscountPercentage && hasFixedAmountDiscount) 
  {
    return { notBothAllowed: true };
  }
  else
  {
    return null;
  }
};

