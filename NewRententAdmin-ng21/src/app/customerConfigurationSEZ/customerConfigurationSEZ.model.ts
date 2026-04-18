// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerConfigurationSEZ {
  customerConfigurationSEZID: number;
  customerID: number;
  //corporateCompanyID:number;
  customerConfigurationSEZStartDate: Date;
  customerConfigurationSEZEndDate:Date;
  customerConfigurationSEZStartDateString:string;
  customerConfigurationSEZEndDateString:string;
   activationStatus:boolean;
  userID: number;
  constructor(customerConfigurationSEZ) {
    {
       this.customerConfigurationSEZID = customerConfigurationSEZ.customerConfigurationSEZID || -1;
       this.customerID = customerConfigurationSEZ.customerID || '';
      // this.corporateCompanyID = customerConfigurationSEZ.corporateCompanyID || '';
       this.customerConfigurationSEZStartDateString = customerConfigurationSEZ.customerConfigurationSEZStartDateString || '';
       this.customerConfigurationSEZEndDateString = customerConfigurationSEZ.customerConfigurationSEZEndDateString || '';
       this.customerConfigurationSEZStartDate=new Date();
       this.customerConfigurationSEZEndDate=new Date();
       this.activationStatus = customerConfigurationSEZ.activationStatus || '';
    }
  }
  
}

