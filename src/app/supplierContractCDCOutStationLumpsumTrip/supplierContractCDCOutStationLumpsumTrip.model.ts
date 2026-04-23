// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierContractCDCOutStationLumpsumTrip {
   supplierContractCDCOutStationLumpsumTripID: number;
   userID:number;
   supplierContractID: number;
   vehicleCategoryID:number;
   cityTierID:number;
   packageID:number;
   billFromTo:string;
   packageKM:number;
   packageDays:number;
   packageHrs:number;
   packageRate:number;
   extraKMRate:number;
   tollChargeable:boolean;
   parkingChargeable:boolean;
   interStateTaxChargeable:boolean;
   nightChargeable:boolean;
   vehicleCategory:string;
  cityTier:string;
  package:string;
   nightChargesStartTime:Date;
   nightChargesStartTimeString:string;
   nightChargesEndTime:Date;
   nightChargesEndTimeString:string;
   nightCharge:number;
   graceMinutesForNightCharge:number;
   graceMinutesNightCharge:number;
   driverAllowance:number;
   activationStatus:boolean;

  constructor(supplierContractCDCOutStationLumpsumTrip) {
    {
       this.supplierContractCDCOutStationLumpsumTripID = supplierContractCDCOutStationLumpsumTrip.supplierContractCDCOutStationLumpsumTripID || -1;
       this.supplierContractID = supplierContractCDCOutStationLumpsumTrip.supplierContractID || '';
       this.vehicleCategoryID = supplierContractCDCOutStationLumpsumTrip.vehicleCategoryID || '';
       this.cityTierID = supplierContractCDCOutStationLumpsumTrip.cityTierID || '';
       this.packageID = supplierContractCDCOutStationLumpsumTrip.packageID || '';
       this.billFromTo = supplierContractCDCOutStationLumpsumTrip.billFromTo || '';
       this.packageKM = supplierContractCDCOutStationLumpsumTrip.packageKM || '';
       this.packageDays = supplierContractCDCOutStationLumpsumTrip.packageDays || '';
       this.packageHrs = supplierContractCDCOutStationLumpsumTrip.packageHrs || '';
       this.packageRate = supplierContractCDCOutStationLumpsumTrip.packageRate || '';
       this.extraKMRate = supplierContractCDCOutStationLumpsumTrip.extraKMRate || '';
       this.tollChargeable = supplierContractCDCOutStationLumpsumTrip.tollChargeable || '';
       this.parkingChargeable = supplierContractCDCOutStationLumpsumTrip.parkingChargeable || '';
       this.interStateTaxChargeable = supplierContractCDCOutStationLumpsumTrip.interStateTaxChargeable || '';
       this.nightChargeable = supplierContractCDCOutStationLumpsumTrip.nightChargeable || '';
       this.nightChargesStartTimeString = supplierContractCDCOutStationLumpsumTrip.nightChargesStartTimeString || '';
       this.nightChargesEndTimeString = supplierContractCDCOutStationLumpsumTrip.nightChargesEndTimeString || '';
       this.nightCharge = supplierContractCDCOutStationLumpsumTrip.nightCharge || '';
       this.graceMinutesForNightCharge = supplierContractCDCOutStationLumpsumTrip.graceMinutesForNightCharge || '';
       this.graceMinutesNightCharge = supplierContractCDCOutStationLumpsumTrip.graceMinutesNightCharge || '';
       this.driverAllowance = supplierContractCDCOutStationLumpsumTrip.driverAllowance || '';
       this.activationStatus = supplierContractCDCOutStationLumpsumTrip.activationStatus || '';
       this.nightChargesStartTime = new Date();
       this.nightChargesEndTime = new Date();
    }
  }
  
}

