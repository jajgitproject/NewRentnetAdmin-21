// @ts-nocheck
import { formatDate } from '@angular/common';
export class MigrationBookingRequest {
  integrationRequestID:number;
  integrationRequestGroupID?: number;
  customerTravelRequestNumber :string;
  customerID : number;
  customerName : string;
  requestDate : Date;
  requestTime : Date;
  pickupDate : Date;
  pickupTime : Date;
  dropOffDate : Date;
  dropOffTime : Date;
  requestStatus : string;
  reservationCreatedBy :string;
  reservationID : number;
  reservationGroupID?: number;
  checkedByEcoEmployeeID : number;
  checkedByEco : boolean;
  reservationCreatedOn : Date;
  
  constructor(migrationBookingRequest) {
    {
       this.integrationRequestID = migrationBookingRequest.integrationRequestID || '';
       this.integrationRequestGroupID = migrationBookingRequest.integrationRequestGroupID || '';
       this.customerTravelRequestNumber = migrationBookingRequest.customerTravelRequestNumber || '';
       this.customerID  = migrationBookingRequest.customerID || '';
       this.customerName = migrationBookingRequest.customerName || '';
       this.requestDate = migrationBookingRequest.requestDate || '';
       this.requestTime = migrationBookingRequest.requestTime || '';
       this.pickupDate = migrationBookingRequest.pickupDate || '';
       this.pickupTime = migrationBookingRequest.pickupTime || '';
       this.dropOffDate  = migrationBookingRequest.dropOffDate || '';
       this.dropOffTime= migrationBookingRequest.dropOffTime || '';
       this.requestStatus = migrationBookingRequest.requestStatus || '';
       this.reservationCreatedBy = migrationBookingRequest.reservationCreatedBy || '';
       this.reservationID = migrationBookingRequest.reservationID || '';
       this.reservationGroupID = migrationBookingRequest.reservationGroupID || '';
       this.checkedByEcoEmployeeID = migrationBookingRequest.checkedByEcoEmployeeID || '';
       this.checkedByEco = migrationBookingRequest.checkedByEco || '';
        this.reservationCreatedOn = migrationBookingRequest.reservationCreatedOn || '';

       
    }
  }
  
}

