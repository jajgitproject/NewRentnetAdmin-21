// @ts-nocheck
import { formatDate } from '@angular/common';
export class TripDetails {
   tripDetailsID: number;
   tripDetails: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(tripDetails) {
    {
       this.tripDetailsID = tripDetails.tripDetailsID || -1;
       this.tripDetails = tripDetails.tripDetails || '';
       this.activationStatus = tripDetails.activationStatus || '';
       this.updatedBy=tripDetails.updatedBy || 10;
       this.updateDateTime = tripDetails.updateDateTime;
    }
  }
  
}

