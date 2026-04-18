// @ts-nocheck
import { formatDate } from '@angular/common';
export class OrganizationalEntityDropDown {
 
   organizationalEntityID: number;
   organizationalEntityCityID: number;
   organizationalEntityName: string;
   organizationalEntityAddressString: string;
   employeeAttachedToLocationID:number;
   latitude: string;
   longitude: string;
   
  constructor(organizationalEntityDropDown) {
    {
       this.organizationalEntityID = organizationalEntityDropDown.organizationalEntityID || -1;
       this.organizationalEntityCityID = organizationalEntityDropDown.organizationalEntityCityID || '';
       this.organizationalEntityName = organizationalEntityDropDown.organizationalEntityName || '';
       this.organizationalEntityAddressString = organizationalEntityDropDown.organizationalEntityAddressString || '';
       this.latitude = organizationalEntityDropDown.latitude || '';
       this.longitude = organizationalEntityDropDown.longitude || '';
    }
  }
  
}

export class TransferedLocationDropDown {
 
  transferedLocationID: number;
  transferedLocation: string;

 constructor(transferedLocationDropDown) {
   {
      this.transferedLocationID = transferedLocationDropDown.transferedLocationID || -1;
      this.transferedLocation = transferedLocationDropDown.transferedLocation || '';
   }
 }
 
}

