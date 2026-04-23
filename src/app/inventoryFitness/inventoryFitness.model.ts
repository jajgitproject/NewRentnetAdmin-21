// @ts-nocheck
import { formatDate } from '@angular/common';
export class InventoryFitness {
    inventoryFitnessID: number;
    inventoryID:number;
    startDate:Date;
    startDateString:string;
    endDate:Date;
    endDateString:string;
    fitnessImage:string;
    activationStatus:boolean;
    userID:number;
  constructor(inventoryFitness) {
    {
       this.inventoryFitnessID = inventoryFitness.inventoryFitnessID || -1;
       this.inventoryID = inventoryFitness.inventoryID || '';
       this.startDateString = inventoryFitness.startDateString || '';
       this.endDateString = inventoryFitness.endDateString || '';
       this.fitnessImage = inventoryFitness.fitnessImage || '';
       this.activationStatus = inventoryFitness.activationStatus || '';
       this.startDate=new Date();
       this.endDate=new Date();
    }
  }
  
}

