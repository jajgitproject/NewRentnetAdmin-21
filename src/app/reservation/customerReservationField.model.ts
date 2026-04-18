// @ts-nocheck
export class CustomerReservationFields {
    customerReservationFieldID: number;
    customerID : number;
     activationStatus: Boolean;
     fieldName:string;
     fieldDataType:string;
     fieldControlType:string;
     formForField:string;
     isMandatory:Boolean;
    
    constructor(customerReservationFields) {
      {
         this.customerReservationFieldID = customerReservationFields.customerReservationFieldID || -1;
         this.customerID = customerReservationFields.customerID || '';
         this.fieldName = customerReservationFields.fieldName || '';
         this.fieldDataType = customerReservationFields.fieldDataType || '';
         this.fieldControlType = customerReservationFields.fieldControlType || '';
         this.formForField = customerReservationFields.formForField || '';
         this.isMandatory = customerReservationFields.isMandatory || '';
      
         this.activationStatus = customerReservationFields.activationStatus || '';
        
      }
    }
    
  }
