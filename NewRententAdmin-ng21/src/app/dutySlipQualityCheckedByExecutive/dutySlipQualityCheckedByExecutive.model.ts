// @ts-nocheck
import { Time, formatDate } from '@angular/common';
export class DutySlipQualityCheckedByExecutive {
  dutyQualityCheckID: number;
  userID:number;
  qCCheckedByExecutiveID: number;
  dutySlipID:number;
  driverID:number;
  driverName:string;
  carRegNo:string;
  inventoryID:number;
  bodyTemperatureInDegreeCelcius:number;
  qCCheckedByExecutiveDate:Date;
  qCCheckedByExecutiveDateString:string;
  qCCheckedByExecutiveTime:Date;
  qCCheckedByExecutiveTimeString:string;
  verificationRemark: string;
  qCCheckedByExecutivePassed: boolean;
  driverRemark:string;
  selfDeclaration:boolean;
  activationStatus: boolean;
  bodyTemperatureImage:string;
  interiorsWithAmenities:string;
  frontPhoto:string;
  isolatedCabin:string;
  selfieWithUniform:string;
  qCDateString: string;
  qCTimeString: string;
  qcDate: Date;
  qcTime: Date;
  qcCheckedByExecutivePassed: boolean;
  qcCheckedByExecutiveRemark: any;

  constructor(dutySlipQualityCheckedByExecutive) {
    {
       this.dutyQualityCheckID = dutySlipQualityCheckedByExecutive.dutyQualityCheckID || -1;
       this.qCCheckedByExecutiveID = dutySlipQualityCheckedByExecutive.qCCheckedByExecutiveID || 0;
       this.bodyTemperatureInDegreeCelcius = dutySlipQualityCheckedByExecutive.bodyTemperatureInDegreeCelcius || '';
       this.driverID = dutySlipQualityCheckedByExecutive.driverID || '';
       this.dutySlipID = dutySlipQualityCheckedByExecutive.dutySlipID || '';
       this.inventoryID = dutySlipQualityCheckedByExecutive.inventoryID || '';
       this.driverName = dutySlipQualityCheckedByExecutive.driverName || '';
       this.carRegNo = dutySlipQualityCheckedByExecutive.carRegNo || '';
       this.qCDateString = dutySlipQualityCheckedByExecutive.qCDateString || '';
       this.qCTimeString = dutySlipQualityCheckedByExecutive.qCTimeString || '';
       this.verificationRemark = dutySlipQualityCheckedByExecutive.verificationRemark || '';
       this.driverRemark = dutySlipQualityCheckedByExecutive.driverRemark || '';
       this.qCCheckedByExecutivePassed = dutySlipQualityCheckedByExecutive.qCCheckedByExecutivePassed || '';
       this.bodyTemperatureImage = dutySlipQualityCheckedByExecutive.bodyTemperatureImage || '';
       this.interiorsWithAmenities = dutySlipQualityCheckedByExecutive.interiorsWithAmenities || '';
       this.frontPhoto = dutySlipQualityCheckedByExecutive.frontPhoto || '';
       this.isolatedCabin = dutySlipQualityCheckedByExecutive.isolatedCabin || '';
       this.selfieWithUniform = dutySlipQualityCheckedByExecutive.selfieWithUniform || '';
       this.selfDeclaration = dutySlipQualityCheckedByExecutive.selfDeclaration || '';
       this.activationStatus = dutySlipQualityCheckedByExecutive.activationStatus || '';
       this.qcDate=new Date();
       this.qcTime=new Date();
    }
  }
  
}
export class DutyAllotmentDetails{
  dutyQualityCheckID: number;
  dutySlipID:number;
  allotmentID:number;
  inventoryID:number;
  carRegNo:string;
  driverID:number;
  driverName:string;
  qcDate:Date;
  qCDateString:string;
  qcTime:Date;
  qCTimeString:string;
  bodyTemperatureInDegreeCelcius:number;
  selfieWithUniform:string;
  frontPhoto:string;
  interiorsWithAmenities:string;
  isolatedCabin:string;
  bodyTemperatureImage:string;
  selfDeclaration:boolean;
  driverRemark:string;
  activationStatus:boolean;
  dutySlipImage: string;

  constructor(allotmentDetails){
    {
      this.dutyQualityCheckID=allotmentDetails.dutyQualityCheckID || '';
      this.dutySlipID=allotmentDetails.dutySlipID || '';
      this.allotmentID=allotmentDetails.allotmentID || '';
      this.inventoryID=allotmentDetails.inventoryID || '';
      this.carRegNo=allotmentDetails.carRegNo || '';
      this.driverID=allotmentDetails.driverID || '';
      this.driverName=allotmentDetails.driverName || '';
      this.qCDateString=allotmentDetails.qCDateString || '';
      this.qCTimeString=allotmentDetails.qCTimeString || '';
      this.bodyTemperatureInDegreeCelcius=allotmentDetails.bodyTemperatureInDegreeCelcius || '';
      this.selfieWithUniform=allotmentDetails.selfieWithUniform || '';
      this.frontPhoto=allotmentDetails.frontPhoto || '';
      this.interiorsWithAmenities=allotmentDetails.interiorsWithAmenities || '';
      this.isolatedCabin=allotmentDetails.isolatedCabin || '';
      this.bodyTemperatureImage=allotmentDetails.bodyTemperatureImage || '';
      this.driverRemark=allotmentDetails.driverRemark || '';
      this.selfDeclaration = allotmentDetails.selfDeclaration || '';

      this.qcDate=new Date();
       this.qcTime=new Date();
    }
  }
}

