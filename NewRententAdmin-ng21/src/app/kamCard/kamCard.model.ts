// @ts-nocheck
import { formatDate } from '@angular/common';
export class KamCard {
   reservationKAMID: number;
   reservationID:number;
   kamEmployeeID:number;
   kamEmployee:string;
   firstName:string;
   lastName:string;
   mobile:string;
   email:string;
   activationStatus:boolean;
   userID:number
  constructor(kamCard) {
    {
       this.reservationKAMID = kamCard.reservationKAMID || -1;
       this.reservationID = kamCard.reservationID || '';
       this.kamEmployeeID = kamCard.kamEmployeeID || '';
       this.kamEmployee=kamCard.kamEmployee || '';
       this.activationStatus = kamCard.activationStatus || '';
    }
  }
  
}

