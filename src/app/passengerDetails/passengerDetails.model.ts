// @ts-nocheck
import { formatDate } from '@angular/common';
export class PassengerDetails {
   passengerDetailsID: number;
   firstName:string;
   lastName:string;
   mobile:string;
   email:string;
   status:string;
   gender:string;
   pickupDate:Date;
   pickupTime:Date;
   pickupSpot:string;
   pickupAddress:string;
   dropOffDate:Date;
   dropOffTime:Date;
   dropOffSpot:string;
   dropOffAddress:string;
   customerGroupID:number;
   customerPersonName:string;
userID:number
  constructor(passengerDetails) {
    {
       this.passengerDetailsID = passengerDetails.passengerDetailsID || -1;
       this.firstName = passengerDetails.firstName || '';
       this.lastName = passengerDetails.lastName || '';
       this.mobile = passengerDetails.mobile || '';
       this.email=passengerDetails.email || '';
       this.status = passengerDetails.status || '';
       this.gender = passengerDetails.gender || '';
       this.pickupDate = passengerDetails.pickupDate || '';
       this.pickupTime = passengerDetails.pickupTime || '';
       this.pickupSpot = passengerDetails.pickupSpot || '';
       this.pickupSpot = passengerDetails.pickupSpot || '';
       this.pickupAddress = passengerDetails.pickupAddress || '';
       this.dropOffDate = passengerDetails.dropOffDate || '';
       this.dropOffTime = passengerDetails.dropOffTime || '';
       this.dropOffSpot = passengerDetails.dropOffSpot || '';
       this.dropOffAddress = passengerDetails.dropOffAddress || '';
       //this.customerPersonName = passengerDetails.customerPersonName || '';

    }
  }
  
}

export class ReservationPassenger {
  reservationPassengerID: number;
  reservationID: number;
  passengerEmployeeID:number;
  passengerEmployee:string;
  isPrimaryPassenger:boolean;
  reservationPickupStopID:number;
  reservationPickupStop:string;
  reservationDropoffStopID:number;
  reservationDropoffStop:string;
  procCalledFrom:string;
  activationStatus: boolean;
  customerPersonName:string;
  primaryMobile:string;
  primaryEmail:string;
  customerName:string;
  gender:string;
  importance:string;
customerDepartment:string;
customerDesignation:string;
pickupAddress:string;
dropOffAddress:string;
  userID: number;
constructor(reservationPassenger) {
  {
     this.reservationPassengerID = reservationPassenger.reservationPassengerID || -1;
     this.reservationID = reservationPassenger.reservationID || '';
     this.passengerEmployeeID = reservationPassenger.passengerEmployeeID || '';
     this.isPrimaryPassenger = reservationPassenger.isPrimaryPassenger || '';
     this.reservationPickupStopID = reservationPassenger.reservationPickupStopID || '';
     this.reservationPickupStop = reservationPassenger.reservationPickupStop || '';
     this.reservationDropoffStopID = reservationPassenger.reservationDropoffStopID || '';
     this.reservationDropoffStop = reservationPassenger.reservationDropoffStop || '';
     this.procCalledFrom = reservationPassenger.procCalledFrom || '';
     this.activationStatus = reservationPassenger.activationStatus || '';
  }
}

}
