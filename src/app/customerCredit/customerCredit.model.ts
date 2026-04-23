// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerCredit {
  customerCreditID: number;
  customerContractMappingID : number;
  creditPeriodInDays : number;
  creditLimitAmount:string;
  customerCreditStartDate :Date;
  customerCreditEndDate :Date;
  customerCreditStartDateString:string;
  customerCreditEndDateString:string;
   activationStatus: Boolean;
  userID: number;
  

  constructor(customerCredit) {
    {
       this.customerCreditID = customerCredit.customerCreditID || -1;
       this.customerContractMappingID = customerCredit.customerContractMappingID || '';
       this.creditPeriodInDays = customerCredit.creditPeriodInDays || '';
       this.creditLimitAmount = customerCredit.creditLimitAmount || '';    
       this.customerCreditStartDateString = customerCredit.customerCreditStartDateString || '';
       this.customerCreditEndDateString = customerCredit.customerCreditEndDateString || '';
       this.activationStatus = customerCredit.activationStatus || '';
       this.customerCreditStartDate=new Date();
       this.customerCreditEndDate=new Date();
    }
  }
  
}

