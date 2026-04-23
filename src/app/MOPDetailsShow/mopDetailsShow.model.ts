// @ts-nocheck
import { formatDate } from '@angular/common';
export class MOPModel {
  reservationID:number;
  modeOfPaymentID: number;
  modeOfPayment:string;
  modeOfPaymentChangeReason:string;
  activationStatus:boolean
  userID:number
  previousModeOfPaymentID:number;
  constructor(mopModel) {
    {
       this.modeOfPaymentID = mopModel.modeOfPaymentID || null;
       this.modeOfPayment = mopModel.modeOfPayment || '';
       this.modeOfPaymentChangeReason = mopModel.modeOfPaymentChangeReason || '';
       this.previousModeOfPaymentID = mopModel.previousModeOfPaymentID || null;
        
    }
  }
  
}

