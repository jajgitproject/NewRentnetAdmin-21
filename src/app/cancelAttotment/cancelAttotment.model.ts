// @ts-nocheck
import { formatDate } from '@angular/common';
export class CancelAttotment {
  allotmentID: number;
   dateOfCancellation: Date;
   timeOfCancellation:string;
   cancellationByEmployeeID:number;
   cancellationRemark: string;
   allotmentStatus: string;
  

  constructor(cancelAttotment) {
    {
       this.allotmentID = cancelAttotment.allotmentID || '';
       this.dateOfCancellation = cancelAttotment.DateOfCancellation || '';
       this.timeOfCancellation = cancelAttotment.timeOfCancellation || '';
       this.cancellationByEmployeeID = cancelAttotment.cancellationByEmployeeID || '';
       this.cancellationRemark = cancelAttotment.cancellationRemark || '';
       this.allotmentStatus = cancelAttotment.allotmentStatus || '';
    }
  }
  
}

