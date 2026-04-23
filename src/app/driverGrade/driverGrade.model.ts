// @ts-nocheck
import { formatDate } from '@angular/common';
export class DriverGrade {
   driverGradeID: number;
   driverGradeName: string;
   nextGradeID:number;
   previousGradeID:number;
   previousGrade:string;
   nextGrade:string;
   activationStatus: boolean;
   userID:number;

  constructor(driverGrade) {
    {
       this.driverGradeID = driverGrade.driverGradeID || -1;
       this.driverGradeName = driverGrade.driverGradeName || '';
       this.nextGradeID = driverGrade.nextGradeID || '';
       this.previousGradeID = driverGrade.previousGradeID || '';
       this.previousGrade = driverGrade.previousGrade || '';
       this.nextGrade = driverGrade.nextGrade || '';
       this.activationStatus = driverGrade.activationStatus || '';
    }
  }
  
}

