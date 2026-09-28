// @ts-nocheck
import { formatDate } from '@angular/common';
export class SACModel {
   sacid: number;
   userID:number;
   sacNumber: string;
   dynamicGLcode: string;
   dynamicGLName: string;
   isDefault: boolean;
   activationStatus: boolean;

  constructor(sacModel) {
    {
      this.sacid = sacModel.sacid || -1;
      this.sacNumber = sacModel.sacNumber || '';
      this.dynamicGLcode = sacModel.dynamicGLcode || '';
      this.dynamicGLName = sacModel.dynamicGLName || '';
      this.isDefault = sacModel.isDefault || '';
      this.activationStatus = sacModel.activationStatus || '';
    }
  }
  
}

