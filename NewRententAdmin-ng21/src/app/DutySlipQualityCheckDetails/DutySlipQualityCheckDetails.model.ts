// @ts-nocheck
import { formatDate } from '@angular/common';

export class DutySlipQualityCheckDetails {
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
  
 constructor(dutySlipQualityCheckDetails) {
   {
      this.dutyQualityCheckID = dutySlipQualityCheckDetails.dutyQualityCheckID || -1;
      this.dutySlipID = dutySlipQualityCheckDetails.dutySlipID || '';
      this.allotmentID = dutySlipQualityCheckDetails.allotmentID || '';
      this.driverID = dutySlipQualityCheckDetails.driverID || '';
      this.inventoryID = dutySlipQualityCheckDetails.inventoryID || '';
      this.registrationNumber = dutySlipQualityCheckDetails.registrationNumber || '';
      this.qCDateString = dutySlipQualityCheckDetails.qCDateString || '';
      this.qCTimeString = dutySlipQualityCheckDetails.qCTimeString || '';
      this.selfieWithUniform = dutySlipQualityCheckDetails.selfieWithUniform || '';
      this.frontPhoto = dutySlipQualityCheckDetails.frontPhoto || '';
      this.interiorsWithAmenities = dutySlipQualityCheckDetails.interiorsWithAmenities || '';
      this.isolatedCabin = dutySlipQualityCheckDetails.isolatedCabin || '';
      this.bodyTemperatureInDegreeCelcius = dutySlipQualityCheckDetails.bodyTemperatureInDegreeCelcius || '';
      this.bodyTemperatureImage = dutySlipQualityCheckDetails.bodyTemperatureImage || '';
      this.selfDeclaration = dutySlipQualityCheckDetails.selfDeclaration || '';
      this.driverRemark = dutySlipQualityCheckDetails.driverRemark || '';
      this.activationStatus = dutySlipQualityCheckDetails.activationStatus || '';

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

