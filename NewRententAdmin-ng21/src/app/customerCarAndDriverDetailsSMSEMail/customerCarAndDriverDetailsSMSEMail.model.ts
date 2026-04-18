// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerCarAndDriverDetailsSMSEMail {
  customerCarAndDriverDetailsSMSEMailID: number;
  customerID: number;
  email:string;
  mobile:string;
   activationStatus:boolean;
  userID: number;
  constructor(customerCarAndDriverDetailsSMSEMail) {
    {
       this.customerCarAndDriverDetailsSMSEMailID = customerCarAndDriverDetailsSMSEMail.customerCarAndDriverDetailsSMSEMailID || -1;
       this.customerID = customerCarAndDriverDetailsSMSEMail.customerID || '';
       this.email = customerCarAndDriverDetailsSMSEMail.email || '';
       this.mobile = customerCarAndDriverDetailsSMSEMail.mobile || '';
       this.activationStatus = customerCarAndDriverDetailsSMSEMail.activationStatus || '';
    }
  }
  
}

