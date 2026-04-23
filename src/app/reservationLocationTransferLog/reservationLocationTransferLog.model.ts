// @ts-nocheck
import { formatDate } from '@angular/common';
export class ReservationLocationTransferLogModel {
  reservationLocationTransferLogID:number;
  reservationID:number;
  userID:number;
  transferedFromLocationID:number;
  transferedFromLocationName:string;
  transferedToLocationID:number;
  transferedToLocationName:string;
  transferedByEmployeeID:number;
  transferedByEmployeeName:string;
  transferDateString:string;
  transferDate:Date;
  transferTimeString:string;
  transferTime:Date;
  transferRemark:string
  activationStatus:boolean;
  constructor(reservationLocationTransferLogModel) {
    {
      this.reservationLocationTransferLogID = reservationLocationTransferLogModel.reservationLocationTransferLogID || -1;
      this.reservationID = reservationLocationTransferLogModel.reservationID || '';
      this.userID = reservationLocationTransferLogModel.userID || '';
      this.transferedFromLocationID = reservationLocationTransferLogModel.transferedFromLocationID || '';
      this.transferedToLocationID = reservationLocationTransferLogModel.transferedToLocationID || '';
      this.transferedByEmployeeID = reservationLocationTransferLogModel.transferedByEmployeeID || '';
      this.transferDate = reservationLocationTransferLogModel.transferDate || '';
      this.transferDate = reservationLocationTransferLogModel.transferDate || '';
      this.transferRemark = reservationLocationTransferLogModel.transferRemark || '';
      // this.transferDateString = reservationLocationTransferLogModel.transferDateString || '';
      // this.transferTimeString = reservationLocationTransferLogModel.transferTimeString || '';
      this.activationStatus = reservationLocationTransferLogModel.activationStatus || '';
      this.transferDate = new Date();
      this.transferTime = new Date();
        
    }
  }
  
}

