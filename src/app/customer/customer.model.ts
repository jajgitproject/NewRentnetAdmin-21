// @ts-nocheck
import { formatDate } from '@angular/common';
export class Customer {
  customerID: number;
  customerGroupID: number;
  customerName: string;
  customerGroup:string;
  customerCategoryID:number;
  companyID:number;
   companyName:string;
   corporateCompanyID:number;
   corporateCompany:string;
   treatAsNewCustomerTillDate:Date;
   treatAsNewCustomerTillDateString:string;
   customerCreationDate:Date;
   customerCreationDateString:string;
   countryForISDCodeID:number;
   contactNo:string;
   email:string;
   customerTypeID:number;
   customerCreatedByID:number;
   serviceLocationID:number;
   serviceLocation:string;
   maximumAgeOfCarToBeSent:number;
   maximumAgeOfCarToBeSentRemark:string;
   customerCodeForAPIIntegration:string;
   customerType:string;
   customerCategory:string;
   geoPointName:string;
   country:string;
   organizationalEntityName:string;
   activationStatus: boolean;
   corporateCompanyName:string;
   latLonRequired:boolean;
   locationCollectionInterval:number;
   locationUploadInterval:number;
   countryCode:string;
   newCustomer:boolean;
   contactPerson:string;
    tallyCustomerID:number;
   locationOutIntervalInMinutes:number;
      customerPriority:boolean;
   customerSector:string;
    dutySlipType:string;
    printRunningDetailOnDutySlip:boolean;  
    showRateOnDutySlip:boolean;
      showOTPOnDutySlip:boolean;
      panNo:string;
      gstCustomerType:string;
      segment:string;
      businessType:string;
      businessServices:string;
      businessTypeID:number;
  constructor(customer) {
    {
       this.customerID = customer.customerID || -1;
       this.customerGroupID = customer.customerGroupID || '';
       this.customerTypeID = customer.customerTypeID || '';
       this.customerType = customer.customerType || '';
       this.customerName = customer.customerName || '';
       this.customerCategory = customer.customerCategory || '';
       this.newCustomer = customer.newCustomer || '';
       this.customerGroup = customer.customerGroup || '';
       this.customerCategoryID = customer.customerCategoryID || '';
       this.corporateCompanyID = customer.corporateCompanyID || 0;
       this.treatAsNewCustomerTillDateString = customer.treatAsNewCustomerTillDateString || '';
       this.customerCreationDateString = customer.customerCreationDateString || '';
       this.countryForISDCodeID = customer.countryForISDCodeID || '';
       this.contactNo = customer.contactNo || '';
          this.businessTypeID = customer.businessTypeID || '';
       this.email = customer.email || '';
       this.customerCreatedByID = customer.customerCreatedByID || 0;
        this.tallyCustomerID = customer.tallyCustomerID || '';
       this.serviceLocationID  = customer.serviceLocationID  || 0;
       this.maximumAgeOfCarToBeSent = customer.maximumAgeOfCarToBeSent || 0;
       this.maximumAgeOfCarToBeSentRemark = customer.maximumAgeOfCarToBeSentRemark || '';
       this.latLonRequired = customer.latLonRequired ?? false;
       this.locationCollectionInterval = customer.locationCollectionInterval || 0;
       this.locationUploadInterval = customer.locationUploadInterval || 0;
       this.activationStatus = customer.activationStatus ?? true;
       this.customerPriority = customer.customerPriority ?? false;
       this.dutySlipType = customer.dutySlipType || 'GeneralDutySlipWithoutMap';
       this.printRunningDetailOnDutySlip = customer.printRunningDetailOnDutySlip ?? false;
       this.showRateOnDutySlip = customer.showRateOnDutySlip ?? false;
       this.showOTPOnDutySlip = customer.showOTPOnDutySlip ?? false;
       this.customerSector = customer.customerSector || '';
       this.contactPerson = customer.contactPerson || '';
       this.locationOutIntervalInMinutes =customer.locationOutIntervalInMinutes || 0;
       //this.treatAsNewCustomerTillDate=new Date();
       this.customerCreationDate=new Date();
       this.panNo = customer.panNo || '';
       this.gstCustomerType = customer.gstCustomerType || '';
       this.segment = customer.segment || '';
       this.businessType = customer.businessType || '';
       this.businessServices = customer.businessServices || '';
    }
  }
  
}

export class CustomerNameModel{
  customerName: string;
  isDuplicate: boolean;
}
