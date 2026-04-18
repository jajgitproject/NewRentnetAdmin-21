// @ts-nocheck
import { formatDate } from '@angular/common';
export class AdhocCarAndDriver {
   driverID: number;
   driverName: string;
   driverFatherName:string;
   driverEmail:string;
   driverPhone:string;
   driverOfficialIdentityNumber:string;
   rtoState:string;
   rtoStateID:number;  

   supplierID:number;
   supplierName:string;
   supplierEmail:string;
   supplierPhone:string;

   inventoryID:number;
   vehicleCategoryID:number;
   vehicleID:number;
   vehicle:string;
   vehicleCategory:string;
   registrationNumber:string;

   activationStatus:boolean;
   companyID:number;
   locationID:number;
   createdByEmployeeID:number;
   supplierTypeID:number;
   supplierType:string;
   supplierCreationRemark:string;
   ownedSupplier:string;
   countryCode:string;
   countryCodes:string;
   aadharAuthenticationToken:string;
   dateOfJoining:Date;
   drivingSinceDate:Date;
   companyName:string;
   reservationID:number;
   isVendorExisting:string;
   isDriverExisting:string;
   isCarExisting:string;
   locationName:string;
   

  constructor(adhocCarAndDriver) {
    {
       this.driverID = adhocCarAndDriver.driverID || null;
       this.driverName = adhocCarAndDriver.driverName || '';
       this.driverEmail = adhocCarAndDriver.driverEmail || '';
       this.driverPhone = adhocCarAndDriver.driverPhone || '';
       this.driverFatherName = adhocCarAndDriver.driverFatherName || '';
       this.driverOfficialIdentityNumber = adhocCarAndDriver.driverOfficialIdentityNumber || '';
       this.rtoStateID = adhocCarAndDriver.rtoStateID || null;
       this.rtoState = adhocCarAndDriver.rtoState || '';
      
       this.supplierID = adhocCarAndDriver.supplierID || null;
       this.supplierName = adhocCarAndDriver.supplierName || ''; 
       this.supplierEmail = adhocCarAndDriver.supplierEmail || '';
       this.supplierPhone = adhocCarAndDriver.supplierPhone || '';

       this.inventoryID = adhocCarAndDriver.inventoryID || null;
       this.vehicleCategoryID = adhocCarAndDriver.vehicleCategoryID || ''; 
       this.vehicleID = adhocCarAndDriver.vehicleID || '';
       this.vehicleCategory = adhocCarAndDriver.vehicleCategory || ''; 
       this.vehicle = adhocCarAndDriver.vehicle || '';
       this.registrationNumber = adhocCarAndDriver.registrationNumber || '';

       
       this.locationID=adhocCarAndDriver.locationID || '';
       this.companyID=adhocCarAndDriver.companyID || '';
       this.activationStatus = adhocCarAndDriver.activationStatus || '';
       this.supplierTypeID = adhocCarAndDriver.supplierTypeID || 0;
       this.supplierType = adhocCarAndDriver.supplierType || '';
       this.supplierCreationRemark =adhocCarAndDriver.supplierCreationRemark || '';
       this.ownedSupplier =adhocCarAndDriver.ownedSupplier || '';
       this.createdByEmployeeID = adhocCarAndDriver.createdByEmployeeID || '';
       this.countryCodes = adhocCarAndDriver.countryCodes || '';
       this.countryCode = adhocCarAndDriver.countryCode || '';

    }
  }
  
}
