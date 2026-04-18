// @ts-nocheck
import { formatDate } from '@angular/common';

export class DutySlipQualityCheckedByExecutiveDetails {
  dutyQualityCheckID: number;
  dutySlipID: number;
  allotmentID:number;
  driverID:number;
  driverName:string;
  inventoryID:number;
  registrationNumber:string;
  qCDate:Date;
  qCDateString:string;
  qCTime:Date;
  qCTimeString:string;
  selfieWithUniform:string;
  frontPhoto:string;
  interiorsWithAmenities:string;
  isolatedCabin:string;
  bodyTemperatureInDegreeCelcius:number;
  bodyTemperatureImage:string;
  selfDeclaration:boolean;
  driverRemark:string;
  activationStatus:boolean;
  
 constructor(DutySlipQualityCheckedByExecutiveDetails) {
   {
      this.dutyQualityCheckID = DutySlipQualityCheckedByExecutiveDetails.dutyQualityCheckID || -1;
      this.dutySlipID = DutySlipQualityCheckedByExecutiveDetails.dutySlipID || '';
      this.allotmentID = DutySlipQualityCheckedByExecutiveDetails.allotmentID || '';
      this.driverID = DutySlipQualityCheckedByExecutiveDetails.driverID || '';
      this.inventoryID = DutySlipQualityCheckedByExecutiveDetails.inventoryID || '';
      this.registrationNumber = DutySlipQualityCheckedByExecutiveDetails.registrationNumber || '';
      this.qCDateString = DutySlipQualityCheckedByExecutiveDetails.qCDateString || '';
      this.qCTimeString = DutySlipQualityCheckedByExecutiveDetails.qCTimeString || '';
      this.selfieWithUniform = DutySlipQualityCheckedByExecutiveDetails.selfieWithUniform || '';
      this.frontPhoto = DutySlipQualityCheckedByExecutiveDetails.frontPhoto || '';
      this.interiorsWithAmenities = DutySlipQualityCheckedByExecutiveDetails.interiorsWithAmenities || '';
      this.isolatedCabin = DutySlipQualityCheckedByExecutiveDetails.isolatedCabin || '';
      this.bodyTemperatureInDegreeCelcius = DutySlipQualityCheckedByExecutiveDetails.bodyTemperatureInDegreeCelcius || '';
      this.bodyTemperatureImage = DutySlipQualityCheckedByExecutiveDetails.bodyTemperatureImage || '';
      this.selfDeclaration = DutySlipQualityCheckedByExecutiveDetails.selfDeclaration || '';
      this.driverRemark = DutySlipQualityCheckedByExecutiveDetails.driverRemark || '';
      this.activationStatus = DutySlipQualityCheckedByExecutiveDetails.activationStatus || '';

      this.qCDate=new Date();
      this.qCTime=new Date();
   }
 }
}

export class AllotmentDetails{
 dutySlipID:number;
 allotmentID:number;
 reservationID:number;
 inventoryID:number;
 registrationNumber:string;
 driverID:number;
 driverName:string;

 constructor(allotmentDetails){
   {
     this.dutySlipID=allotmentDetails.dutySlipID || '';
     this.allotmentID=allotmentDetails.allotmentID || '';
     this.reservationID=allotmentDetails.reservationID || '';
     this.inventoryID=allotmentDetails.inventoryID || '';
     this.registrationNumber=allotmentDetails.registrationNumber || '';
     this.driverID=allotmentDetails.driverID || '';
     //this.DriverName=allotmentDetails.DriverName || '';
   }
 }
}

