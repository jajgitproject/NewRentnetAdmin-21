// @ts-nocheck
import { formatDate } from '@angular/common';
export class AllotCarAndDriver {
   allotmentID: number;
   userID:number;
   reservationID: number;
   inventoryID: number;
   registrationNumber:string;
   vehicleID: number;
   vehicleName:string;
   vehicleCategoryID: number;
   vehicleCategoryName:string;
   inventoryOwnedSupplied:string;
   inventorySupplierID:number;
   inventorySupplierName:string;
   driverInventoryAssociationID:number;
   driverID:number;
   driverName:string;
   driverOwnedSupplier:string;
   driverSupplierID:number;
   driverSupplierName:string;
   dateOfAllotment:Date;
   timeofAllotment:Date;
   allotmentByEmployeeID:number;
   allotmentRemark:string;
   allotmentStatus:string;

   isDriverAcceptanceRequired:string;
   driverAcceptanceStatus:string;
   acceptanceNotificationSentToDriver:string;
   acceptanceNotificationSentToDriverDate:Date;
   acceptanceNotificationSentToDriverTime:Date;
   acceptanceNotificationSentToDriverRemark:string;
   driverAcceptanceDate:Date;
   driverAcceptanceRemark:string;
   driverAcceptanceTime:Date;
   driverAcceptanceEnteredByEmployeeID:number;
   allotmentType:number;
  constructor(allotCarAndDriver) {
    {
       this.allotmentID = allotCarAndDriver.allotmentID || -1;
       this.reservationID = allotCarAndDriver.reservationID || '';
       this.inventoryID = allotCarAndDriver.inventoryID || '';
       this.registrationNumber=allotCarAndDriver.registrationNumber || '';
       this.vehicleID = allotCarAndDriver.vehicleID || '';

       this.vehicleName = allotCarAndDriver.vehicleName || '';
       this.vehicleCategoryID = allotCarAndDriver.vehicleCategoryID || '';
       this.vehicleCategoryName=allotCarAndDriver.vehicleCategoryName || '';
       this.inventoryOwnedSupplied = allotCarAndDriver.inventoryOwnedSupplied || '';
       this.inventorySupplierID = allotCarAndDriver.inventorySupplierID || '';

       this.inventorySupplierName = allotCarAndDriver.inventorySupplierName || '';
       this.driverInventoryAssociationID=allotCarAndDriver.driverInventoryAssociationID || '';
       this.driverID = allotCarAndDriver.driverID || '';
       this.driverName = allotCarAndDriver.driverName || '';
       this.driverOwnedSupplier = allotCarAndDriver.driverOwnedSupplier || '';

       this.driverSupplierID=allotCarAndDriver.driverSupplierID || '';
       this.driverSupplierName = allotCarAndDriver.driverSupplierName || '';
       this.dateOfAllotment = allotCarAndDriver.dateOfAllotment || '';
       this.timeofAllotment = allotCarAndDriver.timeofAllotment || '';
       this.allotmentByEmployeeID = allotCarAndDriver.allotmentByEmployeeID || '';

       this.allotmentRemark=allotCarAndDriver.allotmentRemark || '';


       this.isDriverAcceptanceRequired=allotCarAndDriver.isDriverAcceptanceRequired || '';
       this.driverAcceptanceStatus = allotCarAndDriver.driverAcceptanceStatus || '';
       this.acceptanceNotificationSentToDriver = allotCarAndDriver.acceptanceNotificationSentToDriver || '';
       this.acceptanceNotificationSentToDriverDate = allotCarAndDriver.acceptanceNotificationSentToDriverDate || '';
       this.acceptanceNotificationSentToDriverTime = allotCarAndDriver.acceptanceNotificationSentToDriverTime || '';

       this.acceptanceNotificationSentToDriverRemark=allotCarAndDriver.acceptanceNotificationSentToDriverRemark || '';
       this.driverAcceptanceDate = allotCarAndDriver.driverAcceptanceDate || '';
       this.driverAcceptanceRemark = allotCarAndDriver.driverAcceptanceRemark || '';
       this.driverAcceptanceTime = allotCarAndDriver.driverAcceptanceTime || '';
       this.driverAcceptanceEnteredByEmployeeID = allotCarAndDriver.driverAcceptanceEnteredByEmployeeID || '';
       this.allotmentType = allotCarAndDriver.allotmentType || '';
    }

  }
  
}

