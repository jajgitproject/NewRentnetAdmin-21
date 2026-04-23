// @ts-nocheck
import { formatDate } from '@angular/common';
export class Vehicle {
   vehicleID: number;
   userID:number;
   vehicle: string;
   vehicleCategoryID:number;
   vehicleCategory:string;
   vehicleImage:string;
   vehicleAltTag:string;
   acrisCodeValue:string;
   vehicleSittingCapacity:number;
   vehicleBaggageCapacity:number;
   vehicleManufacturerID:number;
   vehicleManufacturer:string;
   vehicleAcrissCode:string;
   oldRentNetCar_Type:string;
   activationStatus:boolean;
  constructor(vehicle) {
    {
       this.vehicleID = vehicle.vehicleID || -1;
       this.vehicle = vehicle.vehicle || '';
       this.vehicleCategoryID = vehicle.vehicleCategoryID || '';
       this.vehicleImage = vehicle.vehicleImage || '';
       this.vehicleAltTag = vehicle.vehicleAltTag || '';
       this.vehicleSittingCapacity = vehicle.vehicleSittingCapacity || '';
       this.vehicleBaggageCapacity = vehicle.vehicleBaggageCapacity || '';
       this.vehicleManufacturerID = vehicle.vehicleManufacturerID || '';
       this.vehicleAcrissCode = vehicle.vehicleAcrissCode || '';
       this.oldRentNetCar_Type = vehicle.oldRentNetCar_Type || '';
       this.activationStatus = vehicle.activationStatus || '';
    }
  }
  
}

