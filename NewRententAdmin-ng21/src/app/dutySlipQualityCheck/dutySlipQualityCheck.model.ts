// @ts-nocheck
import { formatDate } from '@angular/common';
export class DutySlipQualityCheck {
   dutyQualityCheckID: number;
   userID:number;
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
   bodyTemperatureInDegreeCelcius:number | null;
   bodyTemperatureImage:string;
   selfDeclaration:boolean;
   driverRemark:string;
   activationStatus:boolean;
   
  constructor(dutySlipQualityCheck) {
    {
       this.dutyQualityCheckID = dutySlipQualityCheck.dutyQualityCheckID || -1;
       this.dutySlipID = dutySlipQualityCheck.dutySlipID || '';
       this.allotmentID = dutySlipQualityCheck.allotmentID || '';
       this.driverID = dutySlipQualityCheck.driverID || '';
       this.inventoryID = dutySlipQualityCheck.inventoryID || '';
       this.registrationNumber = dutySlipQualityCheck.registrationNumber || '';
       this.qCDateString = dutySlipQualityCheck.qCDateString || '';
       this.qCTimeString = dutySlipQualityCheck.qCTimeString || '';
       this.selfieWithUniform = dutySlipQualityCheck.selfieWithUniform || '';
       this.frontPhoto = dutySlipQualityCheck.frontPhoto || '';
       this.interiorsWithAmenities = dutySlipQualityCheck.interiorsWithAmenities || '';
       this.isolatedCabin = dutySlipQualityCheck.isolatedCabin || '';
       this.bodyTemperatureInDegreeCelcius = dutySlipQualityCheck.bodyTemperatureInDegreeCelcius || '';
       this.bodyTemperatureImage = dutySlipQualityCheck.bodyTemperatureImage || '';
       this.selfDeclaration = dutySlipQualityCheck.selfDeclaration || '';
       this.driverRemark = dutySlipQualityCheck.driverRemark || '';
       this.activationStatus = dutySlipQualityCheck.activationStatus || '';

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
  qcDate:Date;

  constructor(allotmentDetails){
    {
      this.dutySlipID=allotmentDetails.dutySlipID || '';
      this.allotmentID=allotmentDetails.allotmentID || '';
      this.reservationID=allotmentDetails.reservationID || '';
      this.inventoryID=allotmentDetails.inventoryID || '';
      this.registrationNumber=allotmentDetails.registrationNumber || '';
      this.driverID=allotmentDetails.driverID || '';
      this.qcDate=allotmentDetails.qcDate || '';
    }
  }
}

export class DutyAmenitieModel{
  dutyAmenitieID:number;
  amenitieID:number;
  userID:number;
  amenitie:string;
  dutySlipID:number;
  amenitieRemark:number;
  amenitieImage:string;
  activationStatus:boolean;
  amenitieVerified:string;

  constructor(dutyAmenitie){
    {
      this.dutyAmenitieID=dutyAmenitie.dutyAmenitieID || -1;
      this.amenitieID=dutyAmenitie.amenitieID || '';
      this.userID=dutyAmenitie.userID || '';
      this.amenitie=dutyAmenitie.amenitie || '';
      this.dutySlipID=dutyAmenitie.dutySlipID || '';
      this.amenitieRemark=dutyAmenitie.amenitieRemark || '';
      this.amenitieImage=dutyAmenitie.amenitieImage || '';
      this.activationStatus=dutyAmenitie.activationStatus || '';
      this.amenitieVerified=dutyAmenitie.amenitieVerified || '';
    }
  }
}

// export class DutySlipDetials{
//   dutySlipID:number;
//   allotmentID:number;
//   reservationID:number;

//   constructor(dutySlipDetials){
//     {
//       this.dutySlipID=dutySlipDetials.dutySlipID || '';
//       this.allotmentID=dutySlipDetials.allotmentID || '';
//       this.reservationID=dutySlipDetials.reservationID || '';
//     }
//   }
// }
