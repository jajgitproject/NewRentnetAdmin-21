// @ts-nocheck
import { formatDate } from '@angular/common';
export class KAMDetailsClosing {
   reservationKAMID: number;
   reservationID:number;
   kamEmployeeID:number;
   kamEmployee:string;
   firstName:string;
   lastName:string;
   mobile:string;
   email:string;
   activationStatus:boolean;
  constructor(kamDetailsClosing) {
    {
       this.reservationKAMID = kamDetailsClosing.reservationKAMID || -1;
       this.reservationID = kamDetailsClosing.reservationID || '';
       this.kamEmployeeID = kamDetailsClosing.kamEmployeeID || '';
       this.kamEmployee=kamDetailsClosing.kamEmployee || '';
       this.activationStatus = kamDetailsClosing.activationStatus || '';
   
    }
  }
  
}
