// @ts-nocheck
import { formatDate } from '@angular/common';
export class DriverInventoryAssociationDropDown {
    inventoryID:number;
    driverID:number;
    vehicleID:number;
    supplierID:number;
    registrationNumber:string;
    vehicle:string;
    driverName:string;
    driverPhone:string;
    supplierName:string;
    constructor(driverInventoryAssociationDropDown) {
        {
           this.inventoryID = driverInventoryAssociationDropDown.inventoryID || '';
           this.driverID = driverInventoryAssociationDropDown.driverID || '';
           this.vehicleID = driverInventoryAssociationDropDown.vehicleID || '';
           this.supplierID = driverInventoryAssociationDropDown.supplierID || '';
           this.driverName = driverInventoryAssociationDropDown.driverName || '';
           this.driverPhone = driverInventoryAssociationDropDown.driverPhone || '';
           this.registrationNumber = driverInventoryAssociationDropDown.registrationNumber || '';          
           this.vehicle = driverInventoryAssociationDropDown.vehicle || '';
           this.supplierName = driverInventoryAssociationDropDown.supplierName || '';
        }
      }
}
