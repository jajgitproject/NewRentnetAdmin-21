// @ts-nocheck
import { formatDate } from '@angular/common';
export class SACModel {
   sacid: number;
   userID:number;
   sacNumber: string;
   isDefault: boolean;
   activationStatus: boolean;

  constructor(sacModel) {
    {
      this.sacid = sacModel.sacid || -1;
      this.sacNumber = sacModel.sacNumber || '';
      this.isDefault = sacModel.isDefault || '';
      this.activationStatus = sacModel.activationStatus || '';
    }
  }
  
}

