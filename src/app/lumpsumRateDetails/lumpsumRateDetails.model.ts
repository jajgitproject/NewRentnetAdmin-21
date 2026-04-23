// @ts-nocheck
import { formatDate } from '@angular/common';
export class LumpsumRateDetails {
  reservationLumpsumRateID: number;
  reservationID:number;
   lumpsumRatePercentage:number;
   lumpsumRateApprovedByEmployeeID:number;
   attachment:string;
   activationStatus:boolean;
   lumpsumRateApprovedByEmployee:string;
   userID:number
  constructor(lumpsumRateDetails) {
    {
       this.reservationLumpsumRateID = lumpsumRateDetails.reservationLumpsumRateID || -1;
       this.reservationID = lumpsumRateDetails.reservationID || '';
       this.lumpsumRatePercentage = lumpsumRateDetails.lumpsumRatePercentage || '';
       this.lumpsumRateApprovedByEmployeeID=lumpsumRateDetails.lumpsumRateApprovedByEmployeeID || '';
       this.attachment = lumpsumRateDetails.attachment || '';
       this.activationStatus= lumpsumRateDetails.activationStatus||'';
    }
  }
  
}

