// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerPersonAddress {
  customerPersonAddressID :number;
  customerPersonID :number;
  isFavourite :boolean;
  cityID :number;
  address :string;
  pin :string;
  landMark :string;
  addressStringForMap :string;
  latLong :string;
  addressType :string;
  addressName :string;
  activationStatus :boolean;
  latitude:string;
  longitude:string;
  stateID:number;
  countryID:number;
  country:string;
  state:string;
  city:string;
  userID:number;

  constructor(customerPersonAddress) {
    {
       this.customerPersonAddressID = customerPersonAddress.customerPersonAddressID || -1;
       this.customerPersonID = customerPersonAddress.customerPersonID || '';
       this.isFavourite = customerPersonAddress.isFavourite || '';
       this.cityID = customerPersonAddress.cityID || '';
       this.address = customerPersonAddress.address || '';
       this.pin = customerPersonAddress.pin || '';
       this.landMark = customerPersonAddress.landMark || '';
       this.addressStringForMap = customerPersonAddress.addressStringForMap || '';
       this.latLong = customerPersonAddress.latLong || '';
       this.addressType = customerPersonAddress.addressType || '';
       this.addressName = customerPersonAddress.addressName || '';
       this.activationStatus = customerPersonAddress.activationStatus || '';
    }
  }
  
}

