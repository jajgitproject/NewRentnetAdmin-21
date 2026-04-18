// @ts-nocheck
import { formatDate } from '@angular/common';
export class BillToOther {
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
   countryID:string;
   stateID:string;
   cityID:string;
   gstNumber:string;
  constructor(billToOther) {
    {
       this.reservationBillToOtherID = billToOther.reservationBillToOtherID || -1;
       this.reservationID = billToOther.reservationID || '';
       this.activationStatus = billToOther.activationStatus || '';
       this.payerName=billToOther.payerName ||''
       this.payerAddress=billToOther.payerAddress ||''
       this.pin = billToOther.pin ||'';
       this.payerCityID = billToOther.payerCityID ||'';
       this.gstNumber = billToOther.gstNumber ||'';
    }
  }
  
}

