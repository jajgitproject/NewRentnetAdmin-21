// @ts-nocheck
import { formatDate } from '@angular/common';
export class InventoryInsurance {
   inventoryInsuranceID: number;
   inventoryID: number;
   insuranceStartDate:Date;
   insuranceStartDateString:string;
   insuranceEndDate:Date;
   insuranceEndDateString:string;
   insuranceImage:string;
   activationStatus:boolean;
   userID:number;
  constructor(inventoryInsurance) {
    {
       this.inventoryInsuranceID = inventoryInsurance.inventoryInsuranceID || -1;
       this.inventoryID = inventoryInsurance.inventoryID || '';
       this.insuranceStartDateString = inventoryInsurance.insuranceStartDateString || '';
       this.insuranceEndDateString = inventoryInsurance.insuranceEndDateString || '';
       this.insuranceImage = inventoryInsurance.insuranceImage || '';
       this.activationStatus = inventoryInsurance.activationStatus || '';
       this.insuranceStartDate=new Date();
       this.insuranceEndDate=new Date();
    }
  }
  
}

