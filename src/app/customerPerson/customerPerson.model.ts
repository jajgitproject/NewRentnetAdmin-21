// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerPerson {
  customerPersonID:number;
  customerGroupID:number;
  customerID:number;
  customerName:string;
  salutationID:number;
  customerPersonName:string;
  gender:string;
  importance:string;
  primaryEmail:string;
  billingEmail:string;
  primaryMobile:string;
  secondaryMobile1:string;
  secondaryMobile2:string;
  isContactPerson:boolean;
  isBooker:boolean;
  isPassenger:boolean;
  isAdmin:boolean;
  maskMobileNumber:boolean;
  isPostPickUpCallAllowed:boolean;
  sendSMSWhatsApp:boolean;
  sendEmail:boolean;
  customerDesignationID:number;
  customerDepartmentID:number;
  preferAppBasedDriver:boolean;
  activationStatus:boolean;
  salutation:string;
  confirmPassword:string;
  password:string;
  customerDesignation:number;
  customerDepartment:number;
 employeeCode:string;
 costCenter:string;
 countryCode:string;
 countryCodes:string;
 mobileCode:string;
 loyalGuest:boolean;
 userID:number;
 isDefaultForIntegrationRequest:boolean;
  oldRentNetID:number;
  allowLoginToCDP:boolean;
  allowLoginToCustomerApp:boolean;
  constructor(customerPerson) {
    {
       this.customerPersonID = customerPerson.customerPersonID || -1;
       this.customerPersonName = customerPerson.customerPersonName || '';
       this.customerGroupID = customerPerson.customerGroupID || '';
      this.oldRentNetID = (customerPerson.oldRentNetID && customerPerson.oldRentNetID !== 0) ? Number(customerPerson.oldRentNetID) : null;
       this.customerID = customerPerson.customerID || '';
       this.salutationID = customerPerson.salutationID || '';
       this.gender = customerPerson.gender || '';
       this.importance = customerPerson.importance || '';
       this.primaryEmail = customerPerson.primaryEmail || '';
       this.billingEmail = customerPerson.billingEmail || '';
       this.primaryMobile = customerPerson.primaryMobile || '';
       this.secondaryMobile1 = customerPerson.secondaryMobile1 || '';
       this.secondaryMobile2 = customerPerson.secondaryMobile2 || '';
       this.isContactPerson = customerPerson.isContactPerson ?? null;
       this.isBooker = customerPerson.isBooker ?? null;
       this.isPassenger = customerPerson.isPassenger ?? null;
       this.isAdmin = customerPerson.isAdmin ?? null;
       this.maskMobileNumber = customerPerson.maskMobileNumber ?? null;
       this.isPostPickUpCallAllowed = customerPerson.isPostPickUpCallAllowed ?? false;
       this.sendSMSWhatsApp = customerPerson.sendSMSWhatsApp ?? null;
       this.sendEmail = customerPerson.sendEmail ?? null;
       this.customerDesignationID = customerPerson.customerDesignationID || 0;
       this.employeeCode = customerPerson.employeeCode || '';
       this.costCenter = customerPerson.costCenter || '';
       this.customerDepartment=customerPerson.customerDepartment || '';
       this.customerDesignation = customerPerson.customerDesignation|| '';
       this.customerDepartmentID = customerPerson.customerDepartmentID || 0;
       this.preferAppBasedDriver = customerPerson.preferAppBasedDriver ?? null;
       this.activationStatus = customerPerson.activationStatus ?? null;
       this.loyalGuest = customerPerson.loyalGuest ?? null;
       this.isDefaultForIntegrationRequest = customerPerson.isDefaultForIntegrationRequest ?? null;
        this.allowLoginToCDP = customerPerson.allowLoginToCDP ?? null;
        this.allowLoginToCustomerApp = customerPerson.allowLoginToCustomerApp ?? null;
    }
  }
  
}
export interface MobileEmailModel {
  isDuplicate: boolean;
  primaryMobile?: string;
  primaryEmail?: string;
  customerGroupID?: number;
}


