// @ts-nocheck
import { formatDate } from '@angular/common';
export class BillToOtherDetails {
  reservationBillToOtherID: number;
  reservationID: string;
   activationStatus: string;
   payerName:string;
   payerAddress:string;
   payerCityID:number;
   city:number;
   pin:string;
   country:string;
   state:string;
   countryID:number;
   stateID:number;
   gstNumber:string;

  constructor(billToOtherDetails) {
    {
      this.reservationBillToOtherID = billToOtherDetails.reservationbillToOtherDetailsID || -1;
       this.reservationID = billToOtherDetails.reservationID || '';
       this.activationStatus = billToOtherDetails.activationStatus || '';
       this.payerName=billToOtherDetails.payerName ||''
       this.payerAddress=billToOtherDetails.payerAddress ||''
       this.pin = billToOtherDetails.pin ||'';
       this.payerCityID = billToOtherDetails.payerCityID ||'';
       this.gstNumber = billToOtherDetails.gstNumber ||'';
    }
  }
  
}

