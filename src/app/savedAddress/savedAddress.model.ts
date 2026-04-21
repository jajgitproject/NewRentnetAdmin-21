// @ts-nocheck
import { formatDate } from '@angular/common';
export class SavedAddress {
   customerID: number;
   employeeID: string;
   CustomerKeyAccountManagerID:number;
   serviceDescription:string;
   fromDate:string;
   endDate:string;
   attachmentStatus:string;

   activationStatus:boolean;
   firstName:string;
   lastName:string;
   mobile:string;
   email:string;
  constructor(savedAddress) {
    {
       this.customerID = savedAddress.customerID || '';
       this.employeeID = savedAddress.employeeID || '';
       this.serviceDescription = savedAddress.serviceDescription || '';
       this.fromDate = savedAddress.fromDate || '';
       this.endDate = savedAddress.endDate ||'';
       this.attachmentStatus = savedAddress.attachmentStatus || '';
       this.firstName =savedAddress.firstName ||'';
       this.lastName =savedAddress.lastName || '';
       this.mobile =savedAddress.mobile ||'';
       this.mobile =savedAddress.mobile ||'';
       this.activationStatus = savedAddress.activationStatus || '';
      
    }
  }
  
}

