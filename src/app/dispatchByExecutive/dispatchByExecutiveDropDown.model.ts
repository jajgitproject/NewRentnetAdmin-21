// @ts-nocheck
import { formatDate } from '@angular/common';
export class DispatchByExecutiveDropDown {
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
  constructor(dispatchByExecutiveDropDown) {
    {
       this.allotmentID = dispatchByExecutiveDropDown.allotmentID || '';
       this.locationOutEntryExecutiveID = dispatchByExecutiveDropDown.locationOutEntryExecutiveID || '';
       this.locationOutEntryMethod = dispatchByExecutiveDropDown.locationOutEntryMethod || '';
       this.locationOutKM = dispatchByExecutiveDropDown.locationOutKM || '';
       this.locationOutDate = dispatchByExecutiveDropDown.locationOutDate || '';
       this.locationOutTime = dispatchByExecutiveDropDown.locationOutTime || '';
       this.locationOutAddressString = dispatchByExecutiveDropDown.locationOutAddressString || '';
       this.locationOutLatitude = dispatchByExecutiveDropDown.locationOutLatitude || '';

       this.locationOutLongitude = dispatchByExecutiveDropDown.locationOutLongitude || '';
       this.manualDutySlipNumber = dispatchByExecutiveDropDown.manualDutySlipNumber || '';
       this.actualCarMovedFrom = dispatchByExecutiveDropDown.actualCarMovedFrom || '';
     
    }
  }
  
}

