// @ts-nocheck
import { formatDate } from '@angular/common';
export class SettledRateDetails {
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
  userID:number;
  nextDayCharging:string;
  constructor(settledRateDetails) {
    {
       this.reservationSettledRateID = settledRateDetails.reservationSettledRateID || -1;
       this.reservationID = settledRateDetails.reservationID || '';
       this.cityID = settledRateDetails.cityID || '';
       this.city=settledRateDetails.city || '';
       this.vehicleCategoryID = settledRateDetails.vehicleCategoryID || '';
       this.vehicleCategory = settledRateDetails.vehicleCategory || '';
       this.packageID = settledRateDetails.packageID || '';
       this.package=settledRateDetails.package || '';
       this.packageTypeID = settledRateDetails.packageTypeID || '';
       this.packageType = settledRateDetails.packageType || '';
       this.baseFare = settledRateDetails.baseFare || '';
       this.packageKM = settledRateDetails.packageKM || '';
       this.packageHour=settledRateDetails.packageHour || '';
       this.extraKMRate = settledRateDetails.extraKMRate || '';
       this.extraHourRate = settledRateDetails.extraHourRate || '';
       this.nightCharges = settledRateDetails.nightCharges || '';
       this.nightChargeStartTimeString=settledRateDetails.nightChargeStartTimeString || '';
       this.nightChargeEndTimeString = settledRateDetails.nightChargeEndTimeString || '';
       this.driverAllowance = settledRateDetails.driverAllowance || '';
       this.billingFrom = settledRateDetails.billingFrom || '';
       this.billingTo=settledRateDetails.billingTo || '';
       this.parkingCharges = settledRateDetails.parkingCharges || '';
       this.tollCharges = settledRateDetails.tollCharges || '';
       this.interstateCharges = settledRateDetails.interstateCharges || '';
       this.airportFee=settledRateDetails.airportFee || '';
       this.activationStatus = settledRateDetails.activationStatus || '';
       this.nextDayCharging = settledRateDetails.nextDayCharging || '';
    }
  }
  
}


export class BookingDataModel {
  customerID: number;
  cityID: number;
  city: string;
  vehicleCategoryID: number;
  vehicleCategory: string;
  packageTypeID: number;
  packageType: string;
  packageID: number;
  package: string;
  pickupDate:Date;
  constructor(bookingDataModel) {
    {
       this.customerID = bookingDataModel.customerID || '';
       this.cityID = bookingDataModel.cityID || '';
       this.city=bookingDataModel.city || '';
       this.vehicleCategoryID = bookingDataModel.vehicleCategoryID || '';
       this.vehicleCategory = bookingDataModel.vehicleCategory || '';
       this.packageID = bookingDataModel.packageID || '';
       this.package=bookingDataModel.package || '';
       this.packageTypeID = bookingDataModel.packageTypeID || '';
       this.packageType = bookingDataModel.packageType || '';
       this.pickupDate = bookingDataModel.pickupDate || '';       
    }
  }
  
}

export class CDCDataModel
{
  baseFare: number ;
  packageKM: number;
  packageHour: number;
  extraKMRate: number ;
  extraHourRate: number ;
  nightCharges :number ;
  nightChargeStartTime: Date ;
  nightChargeEndTime :Date ;
  driverAllowance: number ;
  billingFrom: string ;
  billingTo: string ;
  parkingCharges: boolean;
  tollCharges: boolean;
  interstateCharges: boolean;
  airportFee: boolean;
  billFromTo:string;
  constructor(cdcDataModel){
    {
      this.baseFare = cdcDataModel.baseFare || '';
       this.packageKM = cdcDataModel.packageKM || '';
       this.packageHour=cdcDataModel.packageHour || '';
       this.extraKMRate = cdcDataModel.extraKMRate || '';
       this.extraHourRate = cdcDataModel.extraHourRate || '';
       this.nightCharges = cdcDataModel.nightCharges || '';
       this.nightChargeStartTime=cdcDataModel.nightChargeStartTime || '';
       this.nightChargeEndTime = cdcDataModel.nightChargeEndTime || '';
       this.driverAllowance = cdcDataModel.driverAllowance || '';
       this.billingFrom = cdcDataModel.billingFrom || '';
       this.billingTo=cdcDataModel.billingTo || '';
       this.parkingCharges = cdcDataModel.parkingCharges || '';
       this.tollCharges = cdcDataModel.tollCharges || '';
       this.interstateCharges = cdcDataModel.interstateCharges || '';
       this.airportFee=cdcDataModel.airportFee || '';
       this.billFromTo = cdcDataModel.billFromTo || '';
    }
  }
}
