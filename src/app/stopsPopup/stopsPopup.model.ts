// @ts-nocheck
import { formatDate } from '@angular/common';
export class StopsPopup {
   stopsPopupID: number;
   stopsPopup: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(stopsPopup) {
    {
       this.stopsPopupID = stopsPopup.stopsPopupID || -1;
       this.stopsPopup = stopsPopup.stopsPopup || '';
       this.activationStatus = stopsPopup.activationStatus || '';
       this.updatedBy=stopsPopup.updatedBy || 10;
       this.updateDateTime = stopsPopup.updateDateTime;
    }
  }
  
}

