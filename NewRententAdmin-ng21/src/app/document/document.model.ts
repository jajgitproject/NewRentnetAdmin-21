// @ts-nocheck
import { formatDate } from '@angular/common';
export class Document {
   documentID: number;
   documentName: string;
   availableToGuest:boolean;
   mandatoryForSDGuestSoftRegistration:boolean;
   mandatoryForSDGuestRegistrationCompletion:boolean;
   availableToVendor:boolean;
   mandatoryForVendorSoftRegistration:boolean;
   mandatoryForVendorRegistrationCompletion:boolean;
   availableToDriver:boolean;
   mandatoryForDriverSoftRegistration:boolean;
   mandatoryForDriverRegistrationCompletion:boolean;
   documentType:string;
   startDate:Date;
   endDate:Date;
   startDateString:string;
   endDateString:string;
   activationStatus:boolean;
   userID: number;
   availableToInventory:boolean;
   mandatoryForInventorySoftRegistration:boolean;
   mandatoryForInventoryRegistrationCompletion:boolean;
  constructor(document) {
    {
       this.documentID = document.documentID || -1;
       this.documentName = document.documentName || '';
       this.availableToGuest = document.availableToGuest || '';
       this.mandatoryForSDGuestSoftRegistration = document.mandatoryForSDGuestSoftRegistration || '';
       this.mandatoryForSDGuestRegistrationCompletion = document.mandatoryForSDGuestRegistrationCompletion || '';
       this.availableToVendor = document.availableToVendor || '';
       this.mandatoryForVendorSoftRegistration = document.mandatoryForVendorSoftRegistration || '';
       this.mandatoryForVendorRegistrationCompletion = document.mandatoryForVendorRegistrationCompletion || '';
       this.availableToDriver = document.availableToDriver || '';
       this.mandatoryForDriverSoftRegistration = document.mandatoryForDriverSoftRegistration || '';
       this.mandatoryForDriverRegistrationCompletion = document.mandatoryForDriverRegistrationCompletion || '';
       this.documentType = document.documentType || '';
       this.startDateString = document.startDateString || '';
       this.endDateString = document.endDateString || '';
       this.activationStatus = document.activationStatus || '';
       this.availableToInventory = document.availableToInventory || '';
       this.mandatoryForInventorySoftRegistration = document.mandatoryForInventorySoftRegistration || '';
       this.mandatoryForInventoryRegistrationCompletion = document.mandatoryForInventoryRegistrationCompletion || '';
       this.startDate=new Date();
       this.endDate=new Date();
    }
  }
  
}

