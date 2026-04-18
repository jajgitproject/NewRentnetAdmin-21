// @ts-nocheck
import { formatDate } from '@angular/common';
export class DispatchFetchDataDropDown {
   allotmentID: number;
   locationOutEntryExecutiveID: number;
   locationOutEntryMethod:string;
   locationOutKM:number;
   locationOutDate:Date;
   locationOutTime:Date;
   locationOutAddressString:string;
   locationOutLatitude:string;
   locationOutLongitude:string;
   manualDutySlipNumber:string;
   actualCarMovedFrom:string;
  constructor(dispatchFetchDataDropDown) {
    {
       this.allotmentID = dispatchFetchDataDropDown.allotmentID || '';
       this.locationOutEntryExecutiveID = dispatchFetchDataDropDown.locationOutEntryExecutiveID || '';
       this.locationOutEntryMethod = dispatchFetchDataDropDown.locationOutEntryMethod || '';
       this.locationOutKM = dispatchFetchDataDropDown.locationOutKM || '';
       this.locationOutDate = dispatchFetchDataDropDown.locationOutDate || '';
       this.locationOutTime = dispatchFetchDataDropDown.locationOutTime || '';
       this.locationOutAddressString = dispatchFetchDataDropDown.locationOutAddressString || '';
       this.locationOutLatitude = dispatchFetchDataDropDown.locationOutLatitude || '';

       this.locationOutLongitude = dispatchFetchDataDropDown.locationOutLongitude || '';
       this.manualDutySlipNumber = dispatchFetchDataDropDown.manualDutySlipNumber || '';
       this.actualCarMovedFrom = dispatchFetchDataDropDown.actualCarMovedFrom || '';
     
    }
  }
  
}

