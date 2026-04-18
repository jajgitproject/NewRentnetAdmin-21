// @ts-nocheck
import { formatDate } from '@angular/common';


export class  PickUpDetailShow {
  pickupEntryMethod:string;
  pickUpDate:Date;
  pickUpTime:Date;
  pickUpKM:number;
  pickUpAddressString:string;
  
  
 constructor(pickUpDetailShow) {
   {
      this.pickupEntryMethod = pickUpDetailShow.pickupEntryMethod || '';
      this.pickUpDate = pickUpDetailShow.pickUpDate || '';
      this.pickUpTime = pickUpDetailShow.pickUpTime || '';
      this.pickUpKM = pickUpDetailShow.pickUpKM || '';
      this.pickUpAddressString = pickUpDetailShow.pickUpAddressString || '';
   }
 }
}
