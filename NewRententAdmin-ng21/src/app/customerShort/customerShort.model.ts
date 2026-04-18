// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerShort {
  customerID: number;
  customerGroupID: number;
  customerName: string;
  customerGroup:string;
  customerCategoryID:number;
   corporateCompanyID:number;
   corporateCompany:string;
   countryForISDCodeID:number;
   contactNo:string;
   email:string;
   customerTypeID:number;
   customerCreatedByID:number;
   serviceLocationID:number;
   serviceLocation:string;
   customerCodeForAPIIntegration:string;
   customerType:string;
   customerCategory:string;
   treatAsNewCustomerTillDate:Date;
   treatAsNewCustomerTillDateString:string;
   customerCreationDate:Date;
   customerCreationDateString:string;
   geoPointName:string;
   country:string;
   organizationalEntityName:string;
   maximumAgeOfCarToBeSent:number;
   maximumAgeOfCarToBeSentRemark:string;
   activationStatus: boolean;
   companyID:number;
  constructor(customerShort) {
    {
       this.customerID = customerShort.customerID || -1;
       this.customerGroupID = customerShort.customerGroupID || 0;
       this.customerTypeID = customerShort.customerTypeID || '';
       this.customerType = customerShort.customerType || '';
       this.customerName = customerShort.customerName || '';
       this.customerCategory = customerShort.customerCategory || '';
       this.customerGroup = customerShort.customerGroup || '';
       this.customerCategoryID = customerShort.customerCategoryID || '';
       this.corporateCompanyID = customerShort.corporateCompanyID || 0;
       this.countryForISDCodeID = customerShort.countryForISDCodeID || '';
       this.customerCreatedByID = customerShort.customerID || 1;
       this.contactNo = customerShort.contactNo || '';
       this.email = customerShort.email || '';
       this.serviceLocationID  = customerShort.serviceLocationID  || 0;
       this.customerCodeForAPIIntegration  = customerShort.customerCodeForAPIIntegration  || '';
       this.activationStatus = customerShort.activationStatus || '';
       this.treatAsNewCustomerTillDateString = customerShort.treatAsNewCustomerTillDateString || '';
       this.customerCreationDateString = customerShort.customerCreationDateString || '';
       this.maximumAgeOfCarToBeSent = customerShort.maximumAgeOfCarToBeSent || '';
       this.maximumAgeOfCarToBeSentRemark = customerShort.maximumAgeOfCarToBeSentRemark || '';
       this.treatAsNewCustomerTillDate=new Date();
       this.customerCreationDate=new Date();
    }
  }
  
}

