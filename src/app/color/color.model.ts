// @ts-nocheck
import { formatDate } from '@angular/common';
export class Color {
   colorID: number;
   color: string;
   activationStatus: boolean;
   updatedBy:number;
   updateDateTime: Date;
   userID:number;
  constructor(color) {
    {
       this.colorID = color.colorID || -1;
       this.color = color.color || '';
       this.activationStatus = color.activationStatus || '';
       this.updatedBy=color.updatedBy || 10;
       this.updateDateTime = color.updateDateTime;
    }
  }
  
}

