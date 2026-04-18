// @ts-nocheck
import { formatDate } from '@angular/common';
import { LatLng } from 'ngx-google-places-autocomplete/objects/latLng';
export class ViewKAM {
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
  constructor(viewKAM) {
    {
       this.customerID = viewKAM.customerID || '';
       this.employeeID = viewKAM.employeeID || '';
       this.serviceDescription = viewKAM.serviceDescription || '';
       this.fromDate = viewKAM.fromDate || '';
       this.endDate = viewKAM.endDate ||'';
       this.attachmentStatus = viewKAM.attachmentStatus || '';
       this.firstName =viewKAM.firstName ||'';
       this.lastName =viewKAM.lastName || '';
       this.mobile =viewKAM.mobile ||'';
       this.mobile =viewKAM.mobile ||'';
       this.activationStatus = viewKAM.activationStatus || '';
      
    }
  }
  
}


export class CustomerNameModel {
  customerName: number;
  isDuplicate:boolean;
 constructor(customerNameModel) {
   {
      this.customerName = customerNameModel.customerName || '';
      this.isDuplicate = customerNameModel.isDuplicate || '';
     
   }
 }
 
}
