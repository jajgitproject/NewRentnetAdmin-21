// @ts-nocheck
import { formatDate } from '@angular/common';
export class DriverInventoryAssociation {
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
  userID:number
  driverPhone:string;
  supplierName:string;
  inventory:string;
  supplier:string;

  constructor(driverInventoryAssociation) {
    {
       this.driverInventoryAssociationID = driverInventoryAssociation.driverInventoryAssociationID || -1;
       this.driverID = driverInventoryAssociation.driverID || '';
       this.driverName = driverInventoryAssociation.driverName || '';
       this.inventoryID = driverInventoryAssociation.inventoryID || '';
       this.inventoryName = driverInventoryAssociation.inventoryName || '';
       this.driverInventoryAssociationStartDateString = driverInventoryAssociation.driverInventoryAssociationStartDateString || '';
       this.driverInventoryAssociationEndDateString = driverInventoryAssociation.driverInventoryAssociationEndDateString || '';
       this.activationStatus = driverInventoryAssociation.activationStatus || true;
       this.vehicleID = driverInventoryAssociation.vehicleID || 0;
       this.vehicleCategoryID = driverInventoryAssociation.vehicleCategoryID || 0;
       this.inventory = driverInventoryAssociation.inventory || '';
       this.driverInventoryAssociationStartDate=new Date();
      //  this.driverInventoryAssociationEndDate=new Date();
       this.supplier=driverInventoryAssociation.supplier || '';
    }
  }
  
}
export class DriverDropDownForAllotment {
 
   driverID: number;
   driverName: string;
   mobile1:string;
   supplier:string;
   supplierType:string;
   ownedSupplier:string;

  constructor(driverDropDown) {
    {
       this.driverID = driverDropDown.driverID || -1;
       this.driverName = driverDropDown.driverName || '';
    }
  }
}

