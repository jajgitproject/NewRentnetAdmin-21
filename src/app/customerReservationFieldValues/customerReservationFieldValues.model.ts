// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerReservationFieldValues {
  customerReservationFieldValuesID: number;
  customerReservationFieldID: number;
  fieldValue: string;
  fieldName: string;
   activationStatus:boolean;
   userID:number;
  constructor(customerReservationFieldValues) {
    {
       this.customerReservationFieldValuesID = customerReservationFieldValues.customerReservationFieldValuesID || -1;
       this.customerReservationFieldID = customerReservationFieldValues.customerReservationFieldID || 0;
       this.fieldValue = customerReservationFieldValues.fieldValue || '';
       this.activationStatus = customerReservationFieldValues.activationStatus || '';

    }
  }
  
}

