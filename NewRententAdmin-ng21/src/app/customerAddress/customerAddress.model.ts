// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerAddress {
  customerAddressID: number;
  customerID: number;
  isItBaseAddress:boolean;
  cityID: number;
  pin :string;
  completeAddress:string;
  landMark:string;
  addressStringForMap:string;
  geoLocation:string;
  activationStatus:boolean;
  latitude:string;
  longitude:string;
  stateID:number;
  countryID:number;
  country:string;
  state:string;
  city:string;
  userID:number;

  
  constructor(customerAddress) {
    {
       this.customerAddressID = customerAddress.customerAddressID || -1;
       this.customerID = customerAddress.customerID || '';
       this.isItBaseAddress = customerAddress.isItBaseAddress || '';
       this.cityID = customerAddress.cityID || '';
       this.pin = customerAddress.pin || '';
       this.completeAddress = customerAddress.completeAddress || '';
       this.landMark = customerAddress.landMark || '';
       this.addressStringForMap = customerAddress.addressStringForMap || '';
       this.geoLocation = customerAddress.geoLocation || '';
       this.latitude = customerAddress.latitude || '';
       this.longitude = customerAddress.longitude || '';
       this.activationStatus = customerAddress.activationStatus || '';
    }
  }
  
}

