// @ts-nocheck
import { formatDate } from '@angular/common';
export class carMasterMIS {
   inventoryID: number;
   vehicleCategoryID: number;
   vehicleCategory:string;
   geoPointName:string;
   color:string;
   fuelType:string;
   supplier:string;
   supplierName:string;
   company:string;
   vehicleID: number;
   registrationStateID:number;
   registrationCityID:number;
   registrationNumber:string;
   mobile1:string;
   registrationFromDate:Date;
   registrationFromDateString:string;
   registrationTillDate:Date;
   registrationTillDateString:string;
   locationHubID:number;
   locationHub:string;
   ownedSupplied:string;
   supplierID:number;
   colorID:number;
   registrationCity:string;
   fuelTypeID:number;
   mileage:number;
   engineNo:string;
   chassisNo:string;
   noOfAirbags:number;
   transmissionType:string;
   modelYear:number;
   isGPSAvailable:boolean;
   gpsimeiNo:string;
   purchaseDate:Date;
   purchaseDateString:string;
   companyID:number;
   inventoryCreatedBy:number;
   status:string;
   vehicle: string;
   organizationalEntityName:string;
  organizationalEntityID: any;
  userID:number;
  inventoryStatus:string;
  inventoryStatusReason:string;
  inventoryCreatedByName:string;
   //organizationalEntitySupplierID:number;
   //organizationalEntitySupplier:string;

  constructor(carMasterMIS) {
    {
       this.inventoryID = carMasterMIS.inventoryID || -1;
       this.vehicleCategoryID = carMasterMIS.vehicleCategoryID || '';
       this.vehicleID = carMasterMIS.vehicleID || '';
       this.registrationStateID = carMasterMIS.registrationStateID || 0,
       this.registrationCityID = carMasterMIS.registrationCityID || 0;
       this.registrationNumber = carMasterMIS.registrationNumber || '';
       this.registrationFromDateString = carMasterMIS.registrationFromDateString || '';
       this.registrationTillDateString = carMasterMIS.registrationTillDateString || '';
       this.locationHubID = carMasterMIS.locationHubID || '';
       this.ownedSupplied = carMasterMIS.ownedSupplied || '';
       this.supplierID = carMasterMIS.supplierID || '';
       this.colorID = carMasterMIS.colorID || '';
       this.fuelTypeID = carMasterMIS.fuelTypeID || '';
       this.mileage = carMasterMIS.mileage || '';
       this.engineNo = carMasterMIS.engineNo || '';
       this.chassisNo = carMasterMIS.chassisNo || '';
       this.noOfAirbags = carMasterMIS.noOfAirbags || '';
       this.transmissionType = carMasterMIS.transmissionType || '';
       this.modelYear = carMasterMIS.modelYear || '';
       this.isGPSAvailable = carMasterMIS.isGPSAvailable || '';
       this.gpsimeiNo = carMasterMIS.gpsimeiNo || '';
       this.purchaseDateString = carMasterMIS.purchaseDateString || '';
       this.companyID = carMasterMIS.companyID || '';
       this.inventoryCreatedBy = carMasterMIS.inventoryCreatedBy || '';
       this.status = carMasterMIS.status || '';
       this.vehicle = carMasterMIS.vehicle || '';
       this.registrationFromDate=new Date();
       this.registrationTillDate=new Date();
       //this.purchaseDate=new Date();
    }
  }
  
}

