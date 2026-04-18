// @ts-nocheck
import { formatDate } from '@angular/common';
export class AdditionalKmsDetails {
  dutySlipID: number;
  dutySlipForBillingID:number;
  additionalKMs:number;
  additionalMinutes:number;
  
  constructor(additionalKmsDetails) {
    {
       this.dutySlipForBillingID = additionalKmsDetails.DutySlipForBillingID || -1;
       
       this.dutySlipID = additionalKmsDetails.dutySlipID || '';
       this.additionalKMs = additionalKmsDetails.additionalKMs || '';
       this.additionalMinutes = additionalKmsDetails.additionalMinutes || '';
       
       //this.customerPersonName = additionalKmsDetails.customerPersonName || '';

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
