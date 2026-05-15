// @ts-nocheck
import { formatDate } from '@angular/common';
export class DiscountDetails {
  reservationDiscountID: number;
  reservationID:number;
  allotmentID:number;
  discountPercentage:number;
  isAllowedOnPackageRate:boolean;
  isAllowedOnExtras:boolean;
  discountApprovedByEmployeeID:number;
  attachment:string;
  discountApprovedByEmployee:string;
  activationStatus:boolean;
  userID: number;
  fixedAmountDiscount:number;
  constructor(discountDetails) {
    {
       this.reservationDiscountID = discountDetails.reservationDiscountID || -1;
       this.reservationID = discountDetails.reservationID || '';
       this.allotmentID = discountDetails.allotmentID || '';
       this.discountPercentage = discountDetails.discountPercentage || '';
       this.isAllowedOnPackageRate = discountDetails.isAllowedOnPackageRate || '';
       this.isAllowedOnExtras = discountDetails.isAllowedOnExtras || '';
       this.discountApprovedByEmployeeID = discountDetails.discountApprovedByEmployeeID || '';
       this.attachment = discountDetails.attachment || '';
       this.fixedAmountDiscount = discountDetails.fixedAmountDiscount || '';
    }
  }
  
}

