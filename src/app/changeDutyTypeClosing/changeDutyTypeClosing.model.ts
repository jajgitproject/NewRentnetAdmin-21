// @ts-nocheck
import { formatDate } from '@angular/common';
export class ChangeDutyTypeClosingModel {
  reservationID:number;
  packageTypeID: number;
  packageType:string;
  package:string;
  packageID:number;
  userID:number
  constructor(changeDutyTypeClosingModel) {
    {
       this.packageTypeID = changeDutyTypeClosingModel.packageTypeID || 0;
       this.packageType = changeDutyTypeClosingModel.packageType || '';
       this.package = changeDutyTypeClosingModel.package || '';
       this.packageID = changeDutyTypeClosingModel.packageID || 0;
       this.reservationID = changeDutyTypeClosingModel.reservationID || 0;
             
    }
  }
  
}

