// @ts-nocheck
import { formatDate } from '@angular/common';
export class InventoryFitnessDropDown {
 
    organizationalEntityID: number;
    inventoryFitness: string;

  constructor(inventoryFitnessDropDown) {
    {
       this.organizationalEntityID = inventoryFitnessDropDown.organizationalEntityID || -1;
       this.inventoryFitness = inventoryFitnessDropDown.inventoryFitness || '';
    }
  }
  
}

