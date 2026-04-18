// @ts-nocheck
import { formatDate } from '@angular/common';


export class  LocationInDetailShow {
  locationInEntryMethod:string;
  locationInDate:Date;
  locationInTime:Date;
  locationInKM:number;
  locationInAddressString:string;
  
  
 constructor(locationInDetailShow) {
   {
      this.locationInEntryMethod = locationInDetailShow.locationInEntryMethod || '';
      this.locationInDate = locationInDetailShow.locationInDate || '';
      this.locationInTime = locationInDetailShow.locationInTime || '';
      this.locationInKM = locationInDetailShow.locationInKM || '';
      this.locationInAddressString = locationInDetailShow.locationInAddressString || '';
   }
 }
}
