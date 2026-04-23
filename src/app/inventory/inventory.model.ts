// @ts-nocheck
import { formatDate } from '@angular/common';
export class Inventory {
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
  businessDivision:string;
   //organizationalEntityOwnership:string;
   //organizationalEntitySupplierID:number;
   //organizationalEntitySupplier:string;

  constructor(inventory) {
    {
       this.inventoryID = inventory.inventoryID || -1;
       this.vehicleCategoryID = inventory.vehicleCategoryID || '';
       this.vehicleID = inventory.vehicleID || '';
       this.registrationStateID = inventory.registrationStateID || 0,
       this.registrationCityID = inventory.registrationCityID || 0;
       this.registrationNumber = inventory.registrationNumber || '';
       this.registrationFromDateString = inventory.registrationFromDateString || '';
       this.registrationTillDateString = inventory.registrationTillDateString || '';
       this.locationHubID = inventory.locationHubID || '';
       this.ownedSupplied = inventory.ownedSupplied || '';
       this.supplierID = inventory.supplierID || '';
       this.colorID = inventory.colorID || '';
       this.fuelTypeID = inventory.fuelTypeID || '';
       this.mileage = inventory.mileage || '';
       this.engineNo = inventory.engineNo || '';
       this.chassisNo = inventory.chassisNo || '';
       this.noOfAirbags = inventory.noOfAirbags || '';
       this.transmissionType = inventory.transmissionType || '';
       this.modelYear = inventory.modelYear || '';
       this.isGPSAvailable = inventory.isGPSAvailable || '';
       this.gpsimeiNo = inventory.gpsimeiNo || '';
       this.purchaseDateString = inventory.purchaseDateString || '';
       this.companyID = inventory.companyID || '';
       this.inventoryCreatedBy = inventory.inventoryCreatedBy || '';
       this.status = inventory.status || '';
       this.vehicle = inventory.vehicle || '';
       this.registrationFromDate=new Date();
       this.registrationTillDate=new Date();
       //this.purchaseDate=new Date();
       this.businessDivision = inventory.businessDivision || '';
    }
  }
  
}

