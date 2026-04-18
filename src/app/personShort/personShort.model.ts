// @ts-nocheck
import { formatDate } from '@angular/common';
export class PersonShort {
  customerPersonID:number;
  customerGroupID:number;
  salutationID:number;
  customerPersonName:string;
  gender:string;
  importance:string;
  primaryEmail:string;
  billingEmail:string;
  customerID:number;
  primaryMobile:string;
  secondaryMobile1:string;
  secondaryMobile2:string;
  isContactPerson:boolean;
  isBooker:boolean;
  isPassenger:boolean;
  maskMobileNumber:boolean;
  sendSMSWhatsApp:boolean;
  sendEmail:boolean;
  customerDesignationID:number;
  customerDesingationName:string;
  customerDepartmentID:number;
  preferAppBasedDriver:boolean;
  activationStatus:boolean;
  salutation:string;
  customerName: string;
  customerDesignation:string;
  customerDepartment:string;
  customerGroup:string;
  constructor(personShort) {
    {
       this.customerPersonID = personShort.customerPersonID || -1;
       this.customerPersonName = personShort.customerPersonName || '';
       this.customerGroupID = personShort.customerGroupID || '';
       this.customerID = personShort.customerID || '';
       this.salutationID = personShort.salutationID || '';
       this.gender = personShort.gender || '';
       this.importance = personShort.importance || '';
       this.primaryEmail = personShort.primaryEmail || '';
       this.billingEmail = personShort.billingEmail || '';
       this.primaryMobile = personShort.primaryMobile || '';
       this.secondaryMobile1 = personShort.secondaryMobile1 || '';
       this.secondaryMobile2 = personShort.secondaryMobile2 || '';
       this.isContactPerson = personShort.isContactPerson || '';
       this.isBooker = personShort.isBooker || '';
       this.isPassenger = personShort.isPassenger || '';
       this.maskMobileNumber = personShort.maskMobileNumber || '';
       this.sendSMSWhatsApp = personShort.sendSMSWhatsApp || '';
       this.sendEmail = personShort.sendEmail || '';
       this.customerDesignationID = personShort.customerDesignationID || '';
       this.customerDesingationName = personShort.customerDesingationName || '';
       this.customerDepartmentID = personShort.customerDepartmentID || '';
       this.preferAppBasedDriver = personShort.preferAppBasedDriver || '';
       this.activationStatus = personShort.activationStatus || '';
    }
  }
  
}

