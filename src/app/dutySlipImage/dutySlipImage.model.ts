// @ts-nocheck
import { formatDate } from '@angular/common';
export class DutySlipImage {
   
   dutySlipID: number;
   userID:number;
   allotmentID:number;
  dutySlipImage:string;
   
  constructor(dutySlipImage) {
    {
      
       this.dutySlipID = dutySlipImage.dutySlipID || '';
       this.allotmentID = dutySlipImage.allotmentID || '';
       
       this.dutySlipImage = dutySlipImage.dutySlipImage || '';
    }
  }
}

