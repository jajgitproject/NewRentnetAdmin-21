// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerMIS {

  customerID :number;
  customerGroupID  :number;
  companyID :number;
  customerDesignationID :number;
  serviceLocationID :number;
  customerCreatedByID :number;
  employeeID  :number;
  cityID:number;   
  customerCreationDate :Date;                              
  customerName :string;
  contactNo :string;
  email :string;
  address :string;
  motherLocation :string;
  customerGroup:string;
  companyName:string;
  customerPersonName :string;
  gender:string;
  PrimaryEmail:string;
  primaryMobile :string;
  customerDesignation:string;
  salesPerson :string;
  country:string;
  stateName:string;
  city:string;
  isAdmin:boolean;
  isBooker :boolean;
  isPassenger :boolean;
  isContactPerson :boolean;
  isItBaseAddress :boolean;
    
  constructor(customerMIS) {
    {

    this.customerID = customerMIS.customerID || '';
    this.customerGroupID = customerMIS.customerGroupID || '';
    this.companyID = customerMIS.companyID || '';
    this.customerDesignationID = customerMIS.customerDesignationID || '';
    this.serviceLocationID = customerMIS.serviceLocationID || '';
    this.customerCreatedByID = customerMIS.customerCreatedByID || '';
    this.employeeID = customerMIS.employeeID || '';
    this.cityID = customerMIS.cityID || '';

    this.customerCreationDate = customerMIS.customerCreationDate || '';

    this.customerName = customerMIS.customerName || '';
    this.contactNo = customerMIS.contactNo || '';
    this.email = customerMIS.email || '';
    this.address = customerMIS.address || '';
    this.motherLocation = customerMIS.motherLocation || '';
    this.customerGroup = customerMIS.customerGroup || '';
    this.companyName = customerMIS.companyName || '';
    this.customerPersonName = customerMIS.customerPersonName || '';
    this.gender = customerMIS.gender || '';
    this.PrimaryEmail = customerMIS.PrimaryEmail || '';
    this.primaryMobile = customerMIS.primaryMobile || '';
    this.customerDesignation = customerMIS.customerDesignation || '';
    this.salesPerson = customerMIS.salesPerson || '';
    this.country = customerMIS.country || '';
    this.stateName = customerMIS.stateName || '';
    this.city = customerMIS.city || '';

    this.isAdmin = customerMIS.isAdmin || '';
    this.isBooker = customerMIS.isBooker || '';
    this.isPassenger = customerMIS.isPassenger || '';
    this.isContactPerson = customerMIS.isContactPerson || '';
    this.isItBaseAddress = customerMIS.isItBaseAddress || '';
     
    }
  }
  
}


