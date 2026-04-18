// @ts-nocheck
import { formatDate } from '@angular/common';
export class VehicleInterStateTax {
   inventoryInterStateTaxID: number;
   inventoryID: number;
   registrationNumber:string;
   interStateTaxStartDate:Date;
   interStateTaxStartDateString:string;
   interStateTaxEndDate:Date;
   interStateTaxEndDateString:string;
   interStateTaxStateID:number;
   interStateTaxAmount:number;
   interStateTaxImage:string;
   activationStatus:boolean;
   state:string;
  constructor(vehicleInterStateTax) {
    {
       this.inventoryInterStateTaxID = vehicleInterStateTax.inventoryInterStateTaxID || -1;
       this.inventoryID = vehicleInterStateTax.inventoryID || '';
       this.registrationNumber = vehicleInterStateTax.registrationNumber || '';
       this.interStateTaxStartDateString = vehicleInterStateTax.interStateTaxStartDateString || '';
       this.interStateTaxEndDateString = vehicleInterStateTax.interStateTaxEndDateString || '';
       this.interStateTaxAmount = vehicleInterStateTax.interStateTaxAmount || '';
       this.interStateTaxStateID = vehicleInterStateTax.interStateTaxStateID || '';
       this.interStateTaxImage = vehicleInterStateTax.interStateTaxImage || '';
       this.activationStatus = vehicleInterStateTax.activationStatus || '';
       this.interStateTaxStartDate=new Date();
       this.interStateTaxEndDate=new Date();
    }
  }
  
}

