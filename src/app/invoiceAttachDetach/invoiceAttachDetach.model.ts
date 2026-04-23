// @ts-nocheck
import { formatDate } from '@angular/common';
export class InvoiceAttachDetachModel {
  dutySlipID:number;
  reservationID:number;  
  verifyDuty:string;  
  goodForBilling:string;
  invoiceID:number;
  invoiceNumber:string;
  pickUpDate:Date;
  dropOffDate:Date;
  vehicleID:number;
  vehicle:string;
  geoPointID:number;
  geoPointName:string;
  packageTypeID:number;
  packageType:string;
  packageID:number;
  package:string;  
  reservationBillingInstruction:string;
  applicableGST:boolean;
  gstPercentage:number;
  totalAmountAfterGST:number;
  discountPercentage:number;
  discount:number;
  branchID:number;
  branchName:string;
  checked:boolean;
}

export class InvoiceDutyAttachmentModel {
  invoiceID:number;  
  invoiceType:string;
  listOfDuties: number[];  
  userID:number;
  action:string;
}


