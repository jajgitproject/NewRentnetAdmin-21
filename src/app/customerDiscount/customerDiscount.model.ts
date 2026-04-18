// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerDiscount {
  customerDiscountID:number;
  customerContractMappingID:number;
  discountPercentage:number;
  isAllowedOnPackageRate:boolean;
  isAllowedOnExtras:boolean;
  discountPercentageStartDate:Date;
  discountPercentageStartDateString:string;
  discountPercentageEndDate:Date;
  discountPercentageEndDateString:string;
  activationStatus:boolean;
  userID: number;

  constructor(customerDiscount) {
    {
       this.customerDiscountID = customerDiscount.customerDiscountID || -1;
       this.customerContractMappingID = customerDiscount.customerContractMappingID || '';
       this.discountPercentage = customerDiscount.discountPercentage || '';
       this.isAllowedOnPackageRate = customerDiscount.isAllowedOnPackageRate || '';
       this.isAllowedOnExtras = customerDiscount.isAllowedOnExtras || '';
       this.discountPercentageStartDateString = customerDiscount.discountPercentageStartDateString || '';
       this.discountPercentageEndDateString = customerDiscount.discountPercentageEndDateString || '';
       this.activationStatus = customerDiscount.activationStatus || '';

       this.discountPercentageStartDate = new Date();
       this.discountPercentageEndDate = new Date();
    }
  }
  
}

