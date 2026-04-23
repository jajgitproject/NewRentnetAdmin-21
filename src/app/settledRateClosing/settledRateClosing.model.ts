// @ts-nocheck
import { formatDate } from '@angular/common';
export class SettledRateClosing {
  reservationSettledRateID: number;
  reservationID: number;
  cityID: number;
  city: string;
  vehicleCategoryID: number;
  vehicleCategory: string;
  packageID: number;
  package: string;
  packageTypeID: number;
  packageType: string;
  baseFare: number ;
  packageKM: number;
  packageHour: number;
  extraKMRate: number ;
  extraHourRate: number ;
  nightCharges :number ;
  nightChargeStartTime: Date ;
  nightChargeStartTimeString: string ;
  nightChargeEndTime :Date ;
  nightChargeEndTimeString :string ;
  driverAllowance: number ;
  billingFrom: string ;
  billingTo: string ;
  parkingCharges: boolean;
  tollCharges: boolean;
  interstateCharges: boolean;
  airportFee: boolean;
  activationStatus: boolean;
  userID:number
  constructor(settledRateClosing) {
    {
       this.reservationSettledRateID = settledRateClosing.reservationSettledRateID || -1;
       this.reservationID = settledRateClosing.reservationID || '';
       this.cityID = settledRateClosing.cityID || '';
       this.city=settledRateClosing.city || '';
       this.vehicleCategoryID = settledRateClosing.vehicleCategoryID || '';
       this.vehicleCategory = settledRateClosing.vehicleCategory || '';
       this.packageID = settledRateClosing.packageID || '';
       this.package=settledRateClosing.package || '';
       this.packageTypeID = settledRateClosing.packageTypeID || '';
       this.packageType = settledRateClosing.packageType || '';
       this.baseFare = settledRateClosing.baseFare || '';
       this.packageKM = settledRateClosing.packageKM || '';
       this.packageHour=settledRateClosing.packageHour || '';
       this.extraKMRate = settledRateClosing.extraKMRate || '';
       this.extraHourRate = settledRateClosing.extraHourRate || '';
       this.nightCharges = settledRateClosing.nightCharges || '';
       this.nightChargeStartTimeString=settledRateClosing.nightChargeStartTimeString || '';
       this.nightChargeEndTimeString = settledRateClosing.nightChargeEndTimeString || '';
       this.driverAllowance = settledRateClosing.driverAllowance || '';
       this.billingFrom = settledRateClosing.billingFrom || '';
       this.billingTo=settledRateClosing.billingTo || '';
       this.parkingCharges = settledRateClosing.parkingCharges || '';
       this.tollCharges = settledRateClosing.tollCharges || '';
       this.interstateCharges = settledRateClosing.interstateCharges || '';
       this.airportFee=settledRateClosing.airportFee || '';
       this.activationStatus = settledRateClosing.activationStatus || '';
    }
  }
  
}
