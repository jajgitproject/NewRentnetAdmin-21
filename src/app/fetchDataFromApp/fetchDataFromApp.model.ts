// @ts-nocheck
import { formatDate } from '@angular/common';
export class FetchDataFromApp {
  pickupDate: Date;
  pickupDateDateString:string;
  pickupTime:Date;
  pickupTimeString:string;
  pickupAddressString: string;
  pickupKM:number;
  reservationID:number;
  pickupLongitude:string
  pickupLatitude: string;
  customerPerson: any;
  
  constructor(fetchDataFromApp) {
    {
       this.pickupDateDateString= fetchDataFromApp.pickupDateDateString || '';
       this.pickupTimeString = fetchDataFromApp.pickupTimeString || '';
       this.pickupAddressString = fetchDataFromApp.pickupAddressString || '';
       this.pickupKM = fetchDataFromApp.pickupKM|| '';
       this.reservationID = fetchDataFromApp.reservationID|| '';
       this.pickupLongitude = fetchDataFromApp.pickupLongitude || '';
       this.pickupLatitude = fetchDataFromApp.pickupLatitude || '';
       this.pickupDate=new Date();
       this.pickupTime=new Date();
    }
  }
  
}

