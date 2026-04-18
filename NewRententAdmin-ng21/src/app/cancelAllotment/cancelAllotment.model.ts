// @ts-nocheck
import { formatDate } from '@angular/common';
export class CancelAllotment {
  allotmentID: number;
   dateOfCancellation: Date;
   timeOfCancellation:string;
   cancellationByEmployeeID:number;
   cancellationRemark: string;
   allotmentStatus: string;
   userID:number;
  

  constructor(cancelAllotment) {
    {
       this.allotmentID = cancelAllotment.allotmentID || '';
       this.dateOfCancellation = cancelAllotment.DateOfCancellation || '';
       this.timeOfCancellation = cancelAllotment.timeOfCancellation || '';
       this.cancellationByEmployeeID = cancelAllotment.cancellationByEmployeeID || '';
       this.cancellationRemark = cancelAllotment.cancellationRemark || '';
       this.allotmentStatus = cancelAllotment.allotmentStatus || '';
    }
  }
  
}

