// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerForSalesManagerModel {
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
  checked:boolean;
  
  constructor(customerForSalesManagerModel) {
    {
      this.customerID = customerForSalesManagerModel.customerID || -1;
      this.customerGroupID = customerForSalesManagerModel.customerGroupID || '';
      this.customerTypeID = customerForSalesManagerModel.customerTypeID || '';
      this.customerType = customerForSalesManagerModel.customerType || '';
      this.customerName = customerForSalesManagerModel.customerName || '';
      this.customerCategory = customerForSalesManagerModel.customerCategory || '';
      this.newCustomer = customerForSalesManagerModel.newCustomer || '';
      this.customerGroup = customerForSalesManagerModel.customerGroup || '';
      this.customerCategoryID = customerForSalesManagerModel.customerCategoryID || '';
      this.corporateCompanyID = customerForSalesManagerModel.corporateCompanyID || 0;
      this.treatAsNewCustomerTillDateString = customerForSalesManagerModel.treatAsNewCustomerTillDateString || '';
      this.customerCreationDateString = customerForSalesManagerModel.customerCreationDateString || '';
      this.countryForISDCodeID = customerForSalesManagerModel.countryForISDCodeID || '';
      this.contactNo = customerForSalesManagerModel.contactNo || '';
      this.email = customerForSalesManagerModel.email || '';
      this.customerCreatedByID = customerForSalesManagerModel.customerCreatedByID || 0;
      this.tallyCustomerID = customerForSalesManagerModel.tallyCustomerID || '';
      this.serviceLocationID  = customerForSalesManagerModel.serviceLocationID  || 0;
      this.maximumAgeOfCarToBeSent = customerForSalesManagerModel.maximumAgeOfCarToBeSent || '';
      this.maximumAgeOfCarToBeSentRemark = customerForSalesManagerModel.maximumAgeOfCarToBeSentRemark || '';
      this.latLonRequired = customerForSalesManagerModel.latLonRequired || '';
      this.locationCollectionInterval = customerForSalesManagerModel.locationCollectionInterval || '';
      this.locationUploadInterval = customerForSalesManagerModel.locationUploadInterval || '';
      this.activationStatus = customerForSalesManagerModel.activationStatus || '';
      this.contactPerson = customerForSalesManagerModel.contactPerson || '';
      this.locationOutIntervalInMinutes =customerForSalesManagerModel.locationOutIntervalInMinutes || 0;
      //this.treatAsNewCustomerTillDate=new Date();
      this.customerCreationDate=new Date();
    }
  }  
}


export class CustomerNameModel{
  customerName: string;
  isDuplicate: boolean;
}


export class CustomerCustomerGroupDropDown { 
  customerID: number;
  customerName: string;
  customerGroupID: number;
  customerGroup: string;
  customerTypeID: number;
  customerType: string;

  constructor(customerCustomerGroupDropDown) {
    {
      this.customerID = customerCustomerGroupDropDown.customerID || '';
      this.customerName = customerCustomerGroupDropDown.customerName || '';
      this.customerGroupID = customerCustomerGroupDropDown.customerGroupID || '';
      this.customerGroup = customerCustomerGroupDropDown.customerGroup || '';
      this.customerTypeID = customerCustomerGroupDropDown.customerTypeID || '';
      this.customerType = customerCustomerGroupDropDown.customerType || '';
    }
  }  
}



export class CustomerDropDown { 
  customerID: number;
  customerName: string;

  constructor(customerDropDown) {
    {
      this.customerID = customerDropDown.customerID || -1;
      this.customerName = customerDropDown.customerName || '';
    }
  }
}

export class CustomerSalesManagerModel {
  customerSalesManagerID: number;
  customerID : number;
  employeeID : number;
  serviceDescription:string;
  attachmentStatus:string;
  fromDate :Date;
  endDate :Date;
  employee:string;
  endDateString:string;
  fromDateString:string;
  activationStatus: Boolean;
  employeeName:string;
  userID: number;
  listOfCustomerID:number[];
}
