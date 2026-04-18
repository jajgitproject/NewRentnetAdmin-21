// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerSpecificFields {
   customerSpecificFieldsID: number;
   field1:string;
   field2:string;
   field3:string;
   field4:string;
   userID:number;

  constructor(customerSpecificFields) {
    {
       this.customerSpecificFieldsID = customerSpecificFields.customerSpecificFieldsID || -1;
       this.field1 = customerSpecificFields.field1 || '';
       this.field2 = customerSpecificFields.field2 || '';
       this.field3=customerSpecificFields.field3 || '';
       this.field4 = customerSpecificFields.field4 || '';
    }
  }
  
}

