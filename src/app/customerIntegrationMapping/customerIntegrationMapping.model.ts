// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerIntegrationMapping {
   customerIntegrationMappingID: number;
   customerID: number;
   customerName:string;
   userID:number;
   tallyCode:string;
   activationStatus: boolean;

  constructor(customerIntegrationMapping) {
    {
       this.customerIntegrationMappingID = customerIntegrationMapping.customerIntegrationMappingID || -1;
       this.customerID = customerIntegrationMapping.customerID || '';
       this.customerName = customerIntegrationMapping.customerName || '';
       this.tallyCode = customerIntegrationMapping.tallyCode || '';
       this.activationStatus = customerIntegrationMapping.activationStatus || '';
    }
  }
  
}

export class CustomerIntegrationMappingForDropDown {
   customerID: number;
   customerName:string;
   tallyCustomerID:number;
   

  constructor(customerIntegrationMappingForDropDown) {
    {
       this.customerName = customerIntegrationMappingForDropDown.customerName || -1;
       this.customerID = customerIntegrationMappingForDropDown.customerID || '';
       this.tallyCustomerID = customerIntegrationMappingForDropDown.tallyCustomerID || '';
    }
  }
  
}

