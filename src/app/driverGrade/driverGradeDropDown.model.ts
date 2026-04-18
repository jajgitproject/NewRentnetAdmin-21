// @ts-nocheck
import { formatDate } from '@angular/common';
export class DriverGradeDropDown {
   driverGradeID: number;
   driverGradeName: string;

  constructor(driverGradeDropDown) {
    {
       this.driverGradeID = driverGradeDropDown.driverGradeID || -1;
       this.driverGradeName = driverGradeDropDown.driverGradeName || '';
    }
  }
  
}

