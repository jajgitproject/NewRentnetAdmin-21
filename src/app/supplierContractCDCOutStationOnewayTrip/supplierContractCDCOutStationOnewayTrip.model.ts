// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierContractCDCOutStationOnewayTrip {
   supplierContractCDCOutStationOnewayTripID: number;
   userID:number;
   supplierContractID: number;
   vehicleCategoryID:number;
   cityTierID:number;
   packageID:number;
   billFromTo:string;
   geoLocationFromID: number;
	 geoLocationToID: number;
   packageKM:number;
   packageRate:number;
   extraKMRate:number;
   tollChargeable:boolean;
   parkingChargeable:boolean;
   interStateTaxChargeable:boolean;
   nightChargeable:boolean;
   nightChargesStartTime:Date;
   nightChargesStartTimeString:string;
   nightChargesEndTime:Date;
   nightChargesEndTimeString:string;
   nightCharge:number;
   graceMinutesForNightCharge:number;
   graceMinutesNightCharge:number;
   driverAllowance:number;
   activationStatus:boolean;
   vehicleCategory:string;
   cityTier:string;
  package:string;

  constructor(supplierContractCDCOutStationOnewayTrip) {
    {
       this.supplierContractCDCOutStationOnewayTripID = supplierContractCDCOutStationOnewayTrip.supplierContractCDCOutStationOnewayTripID || -1;
       this.supplierContractID = supplierContractCDCOutStationOnewayTrip.supplierContractID || '';
       this.vehicleCategoryID = supplierContractCDCOutStationOnewayTrip.vehicleCategoryID || '';
       this.cityTierID = supplierContractCDCOutStationOnewayTrip.cityTierID || '';
       this.packageID = supplierContractCDCOutStationOnewayTrip.packageID || '';
       this.billFromTo = supplierContractCDCOutStationOnewayTrip.billFromTo || '';
       this.packageKM = supplierContractCDCOutStationOnewayTrip.packageKM || '';
       this.geoLocationFromID = supplierContractCDCOutStationOnewayTrip.geoLocationFromID || '';
       this.geoLocationToID = supplierContractCDCOutStationOnewayTrip.geoLocationToID || '';
       this.packageRate = supplierContractCDCOutStationOnewayTrip.packageRate || '';
       this.extraKMRate = supplierContractCDCOutStationOnewayTrip.extraKMRate || '';
       this.tollChargeable = supplierContractCDCOutStationOnewayTrip.tollChargeable || '';
       this.parkingChargeable = supplierContractCDCOutStationOnewayTrip.parkingChargeable || '';
       this.interStateTaxChargeable = supplierContractCDCOutStationOnewayTrip.interStateTaxChargeable || '';
       this.nightChargeable = supplierContractCDCOutStationOnewayTrip.nightChargeable || '';
       this.nightChargesStartTimeString = supplierContractCDCOutStationOnewayTrip.nightChargesStartTimeString || '';
       this.nightChargesEndTimeString = supplierContractCDCOutStationOnewayTrip.nightChargesEndTimeString || '';
       this.nightCharge = supplierContractCDCOutStationOnewayTrip.nightCharge || '';
       this.graceMinutesForNightCharge = supplierContractCDCOutStationOnewayTrip.graceMinutesForNightCharge || '';
       this.graceMinutesNightCharge = supplierContractCDCOutStationOnewayTrip.graceMinutesNightCharge || '';
       this.driverAllowance = supplierContractCDCOutStationOnewayTrip.driverAllowance || '';
       this.activationStatus = supplierContractCDCOutStationOnewayTrip.activationStatus || '';
       this.nightChargesStartTime = new Date();
       this.nightChargesEndTime = new Date();
    }
  }
  
}

