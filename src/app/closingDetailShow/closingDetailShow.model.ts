// @ts-nocheck
import { formatDate } from '@angular/common';
 export class ClosingDetailShowModel{
    locationInKM:number;
    locationInEntryMethod:string;
    locationInDate:Date;
    locationInTime:Date;

    locationOutKM:number;
    locationOutEntryMethod:string;
    locationOutDate:Date;
    locationOutTime:Date;

    dropOffKM:number;
    dropOffDate:Date;
    dropOffTime:Date;
    dropOffEntryMethod:string;

    pickUpDate:Date;
    pickUpTime:Date;
    pickUpKM:number;
    pickupEntryMethod:string;

    constructor(closingDetailShowModel) {
        {
          this.locationInKM = closingDetailShowModel.locationInKM || '';
          this.locationInEntryMethod = closingDetailShowModel.locationInEntryMethod || '';
          this.locationInDate=new Date();
          this.locationInTime=new Date();

          this.locationOutKM = closingDetailShowModel.locationOutKM || '';
          this.locationOutEntryMethod=closingDetailShowModel.locationOutEntryMethod || '';
          this.locationOutDate = closingDetailShowModel.locationOutDate || '';
          this.locationOutTime=closingDetailShowModel.locationOutTime || '';
          //this.locationOutDate=new Date();
          //this.locationOutTime=new Date();

          this.dropOffKM = closingDetailShowModel.dropOffKM || '';
          this.dropOffEntryMethod = closingDetailShowModel.dropOffEntryMethod || '';
          this.dropOffDate=new Date();
          this.dropOffTime=new Date();

          this.pickUpKM=closingDetailShowModel.pickUpKM || '';
          this.pickupEntryMethod = closingDetailShowModel.pickupEntryMethod || '';
          this.pickUpDate=new Date();
          this.pickUpTime=new Date();
        }
      }
 }

