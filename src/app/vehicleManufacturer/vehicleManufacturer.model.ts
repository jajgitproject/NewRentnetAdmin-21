// @ts-nocheck
import { formatDate } from '@angular/common';
export class VehicleManufacturer {
   vehicleManufacturerID: number;
   userID:number;
   vehicleManufacturer: string;
   logo:string;
   activationStatus: boolean;
  

  constructor(vehicleManufacturer) {
    {
       this.vehicleManufacturerID = vehicleManufacturer.vehicleManufacturerID || -1;
       this.logo = vehicleManufacturer.logo || '';
       this.activationStatus = vehicleManufacturer.activationStatus || '';
       this.vehicleManufacturer=vehicleManufacturer.vehicleManufacturer || '';
     
    }
  }
  
}

