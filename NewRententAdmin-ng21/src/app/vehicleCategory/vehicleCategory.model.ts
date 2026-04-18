// @ts-nocheck
import { formatDate } from '@angular/common';
export class VehicleCategory {
   vehicleCategoryID: number;
   userID:number;
   vehicleCategory: string;
   vehicleCategoryLevel: number;
   previousVehicleCategoryID: number;
   previousCategory:string;
   nextVehicleCategoryID: number;
   nextCategory:string;
   vehicleCategoryImage:string;
   instructedByID:number;
   createdByID:number;
   instructedBy:string;
   createdBy:string;
   employee:string;
   activationStatus: boolean;
   supportingDoc :string;
description:string;

  constructor(vehicleCategory) {
    {
       this.vehicleCategoryID = vehicleCategory.vehicleCategoryID || -1;
       this.vehicleCategory = vehicleCategory.vehicleCategory || '';
       this.vehicleCategoryLevel = vehicleCategory.vehicleCategoryLevel || '';
       this.previousVehicleCategoryID = vehicleCategory.previousVehicleCategoryID || 0;
       this.previousCategory = vehicleCategory.previousCategory || '';
       this.nextVehicleCategoryID = vehicleCategory.nextVehicleCategoryID || 0;
       this.nextCategory = vehicleCategory.nextCategory || '';
       this.vehicleCategoryImage = vehicleCategory.image || '';
       this.activationStatus = vehicleCategory.activationStatus || '';
       this.instructedByID = vehicleCategory.instructedByID || 0;
       this.createdByID = vehicleCategory.createdByID || '';
       this.supportingDoc = vehicleCategory.supportingDoc || '';
       this.description = vehicleCategory.description || '';
    }
  }
  
}

