// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerSpecificFields {
  customerReservationFieldID:number;
  fieldName:string;
  fieldValue:string;
  userID:number

 constructor(customerSpecificFields) {
   {
      this.customerReservationFieldID = customerSpecificFields.customerReservationFieldID || '';
      this.fieldValue = customerSpecificFields.fieldValue || '';
   }
 }
 
}

export class CustomerSpecificDetails {
   reservationID:number;
   customerID:number;
   customerSpecificFieldList:CustomerSpecificFields[];
  userID: number;

  constructor(customerSpecificDetails) {
    {
       this.reservationID = customerSpecificDetails.reservationID || '';
       this.customerID = customerSpecificDetails.customerID || '';
       this.customerSpecificFieldList = customerSpecificDetails.customerSpecificFieldList || '';
    }
  }
  
}

export class CustomerSpecificDetailsData {
  reservationDetailsList: CustomerSpecificDetails[];
  
  constructor(customerSpecificDetailsData) {
    this.reservationDetailsList = customerSpecificDetailsData.reservationDetailsList || '';
    
  }
}

export class CustomerExtraFieldList{
  customerReservationFieldID:string;
  fieldName:string;
  fieldValue:string;
  reservationID:number;

  constructor(customerExtraFieldList) {
    this.customerReservationFieldID = customerExtraFieldList.customerReservationFieldID || '';
    this.fieldName = customerExtraFieldList.fieldName || '';
    this.fieldValue = customerExtraFieldList.fieldValue || '';
    this.reservationID = customerExtraFieldList.reservationID || '';
  }
}

