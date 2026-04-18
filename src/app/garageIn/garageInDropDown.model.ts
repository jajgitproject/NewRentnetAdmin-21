// @ts-nocheck
import { formatDate } from '@angular/common';
export class GarageInDropDown {
   allotmentID: number;
   locationInEntryExecutiveID: number;
   locationInEntryMethod:string;
   locationInKM:number;
   locationInDate:Date;
   locationInTime:Date;
   locationInAddressString:string;
   locationInLatitude:string;
   locationInLongitude:string;
   manualDutySlipNumber:string;
   actualCarMovedFrom:string;
  constructor(garageInDropDown) {
    {
       this.allotmentID = garageInDropDown.allotmentID || '';
       this.locationInEntryExecutiveID = garageInDropDown.locationInEntryExecutiveID || '';
       this.locationInEntryMethod = garageInDropDown.locationInEntryMethod || '';
       this.locationInKM = garageInDropDown.locationInKM || '';
       this.locationInDate = garageInDropDown.locationInDate || '';
       this.locationInTime = garageInDropDown.locationInTime || '';
       this.locationInAddressString = garageInDropDown.locationInAddressString || '';
       this.locationInLatitude = garageInDropDown.locationInLatitude || '';

       this.locationInLongitude = garageInDropDown.locationInLongitude || '';
       this.manualDutySlipNumber = garageInDropDown.manualDutySlipNumber || '';
       this.actualCarMovedFrom = garageInDropDown.actualCarMovedFrom || '';
     
    }
  }
  
}

