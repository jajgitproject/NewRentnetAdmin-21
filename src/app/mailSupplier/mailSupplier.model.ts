// @ts-nocheck
import { formatDate } from '@angular/common';

export class MailToSupplier {
  reservationID: number;
  reservationGroupID: number;
  passengerName: string;
  passengerMobile: string;
  pickupDate: Date;
  pickupTime: Date;
  vehicle: string;
  dutyType: string;
  pickupAddress: string;
  pickupAddressDetails: string;
  subDetails:string;
  dropOffAddress : string;
  dropOffAddressDetails: string;
  dropOffSubDetails: string;
  specialInstruction: string; 
  supplierEmail: string; 

  constructor(mailToSupplier: any) {
    this.reservationID = mailToSupplier.reservationID || '';
    this.reservationGroupID = mailToSupplier.reservationGroupID || '';
    this.passengerName = mailToSupplier.passengerName || '';
    this.passengerMobile = mailToSupplier.passengerMobile || '';
    this.pickupDate = mailToSupplier.pickupDate || ''; 
    this.pickupTime = mailToSupplier.pickupTime || '';
    this.vehicle = mailToSupplier.vehicle || '';
    this.dutyType = mailToSupplier.dutyType || '';
    this.pickupAddress = mailToSupplier.pickupAddress || '';
    this.pickupAddressDetails = mailToSupplier.pickupAddressDetails || '';
    this.subDetails = mailToSupplier.subDetails || '';
    this.dropOffAddress = mailToSupplier.dropOffAddress || '';
    this.dropOffAddressDetails = mailToSupplier.dropOffAddressDetails || '';
    this.dropOffSubDetails = mailToSupplier.dropOffSubDetails || '';
    this.specialInstruction = mailToSupplier.specialInstruction || '';
    this.supplierEmail = mailToSupplier.supplierEmail || '';
  }
}

export class MailSupplier {
  reservationID : number;
  supplierEmail : string; 
  cc : string;
  userID : number;

  constructor(mailToSupplier: any) {
    this.reservationID = mailToSupplier.reservationID || '';
    this.supplierEmail = mailToSupplier.supplierEmail || '';
    this.cc = mailToSupplier.cc || '';
    this.userID = mailToSupplier.userID || '';
    
  }
}
