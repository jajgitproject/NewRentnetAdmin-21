// @ts-nocheck
import { formatDate } from '@angular/common';
export class GSTPercentage {
  gstPercentageID:number;
  igstPercentage:number;
  cgstPercentage:number;
  sgstPercentage:number;
  isDefault:boolean;
  activationStatus:boolean;
  userID:number;
  constructor(gstPercentage) {
    {
       this.gstPercentageID = gstPercentage.gstPercentageID || -1;
       this.igstPercentage = gstPercentage.igstPercentage || '';
       this.cgstPercentage = gstPercentage.cgstPercentage || '';
       this.sgstPercentage = gstPercentage.sgstPercentage || '';
       this.isDefault = gstPercentage.isDefault || '';
       this.activationStatus = gstPercentage.activationStatus || '';

    }
  }
  
}

