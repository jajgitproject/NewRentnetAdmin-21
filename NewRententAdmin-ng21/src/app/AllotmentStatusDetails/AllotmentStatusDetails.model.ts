// @ts-nocheck
import { formatDate } from '@angular/common';
// export class AllotmentStatusDetails {
//   allotmentID: number;
//   reservationID: number;
//   driverID:number;
//   driverName:string;
//   registrationNumber: string;
//   driverSupplierPhone:string;

//   constructor(AllotmentStatusDetails) {
//     {
//        this.AllotmentStatusDetailsID = AllotmentStatusDetails.AllotmentStatusDetailsID || -1;
//        this.AllotmentStatusDetails = AllotmentStatusDetails.AllotmentStatusDetails || '';
//        this.registrationNumber = AllotmentStatusDetails.registrationNumber || '';
//        this.activationStatus = AllotmentStatusDetails.activationStatus || '';
       
//     }
//   }
  
// }

export class  AllotmentStatusDetails {
  allotmentID: number;
    reservationID: number;
  driverID: number;
  driverName: string;
  phone:string;
  
  vechile: string;
  driverSupplierEmail:string;
  driverSupplierPhone:string;
  
  inventoryID: number;
  registrationNumber: string;
  carSupplierID: number;
  carSupplierName: string;
  carSupplierEmail:string;
  carSupplierPhone:string;
  
 constructor(AllotmentStatusDetails) {
   {
      this.driverID = AllotmentStatusDetails.driverID || '';
      this.reservationID = AllotmentStatusDetails.reservationID || '';
      this.allotmentID = AllotmentStatusDetails.allotmentID || '';
      this.driverName = AllotmentStatusDetails.driverName || '';
      this.phone = AllotmentStatusDetails.phone || '';
      this.vechile = AllotmentStatusDetails.vechile || '';
      this.driverSupplierEmail = AllotmentStatusDetails.driverSupplierEmail || '';
      this.driverSupplierPhone = AllotmentStatusDetails.driverSupplierPhone || '';
      this.inventoryID = AllotmentStatusDetails.inventoryID || '';
      this.registrationNumber = AllotmentStatusDetails.registrationNumber || '';
      this.carSupplierID =AllotmentStatusDetails.carSupplierID || '';
      this.carSupplierName = AllotmentStatusDetails.carSupplierName || '';
      this.carSupplierEmail = AllotmentStatusDetails.carSupplierEmail || '';
      this.carSupplierPhone = AllotmentStatusDetails.carSupplierPhone || '';
   }
 }
}
