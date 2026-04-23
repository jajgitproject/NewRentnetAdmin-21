// @ts-nocheck
import { formatDate } from '@angular/common';
export class SearchDriverByLocation {
   driverInventoryAssociationID: number;
   driverID: number;
   driverName:string;
   inventoryID:number;
   inventoryName:string;
   driverInventoryAssociationStartDate:Date;
   driverInventoryAssociationStartDateString:string;
   driverInventoryAssociationEndDate:Date;
   driverInventoryAssociationEndDateString:string;
   driverInventoryAssociationStatus:boolean;
   activationStatus: boolean;
   vehicleID:number;
   vehicle:string;
   ownedSupplied:string;
   phone:string;
   driverOwnedSupplier:string;
   vehicleCategoryID:number;
   vehicleCategory:string;
   driverSupplierID:number;
   driverSupplierName:string;
   inventorySupplierID:number;
   inventorySupplierName:string;
   feedbackPoints:string;
  allotmentID: number;
  dateOfAllotment: any;
   bookingCount:number;
   date:string;
   time:string;
   locationString:string;
   latitude:string;
   longitude:string;
  constructor(searchDriverByLocation) {
    {
      this.locationString = searchDriverByLocation.locationString || '';
      this.latitude = searchDriverByLocation.latitude || '';
      this.longitude = searchDriverByLocation.longitude || '';
      this.phone = searchDriverByLocation.phone || '';
       this.driverInventoryAssociationID = searchDriverByLocation.driverInventoryAssociationID || -1;
       this.driverID = searchDriverByLocation.driverID || '';
       this.driverName = searchDriverByLocation.driverName || '';
       this.inventoryID = searchDriverByLocation.inventoryID || '';
       this.inventoryName = searchDriverByLocation.inventoryName || '';
       this.driverInventoryAssociationStartDateString = searchDriverByLocation.driverInventoryAssociationStartDateString || '';
       this.driverInventoryAssociationEndDateString = searchDriverByLocation.driverInventoryAssociationEndDateString || '';
       this.activationStatus = searchDriverByLocation.activationStatus || '';
       this.vehicleID = searchDriverByLocation.vehicleID || 0;
       this.vehicleCategoryID = searchDriverByLocation.vehicleCategoryID || 0;

       this.driverInventoryAssociationStartDate=new Date();
       this.driverInventoryAssociationEndDate=new Date();
    }
  }
  
}

