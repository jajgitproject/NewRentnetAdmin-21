// @ts-nocheck
import { formatDate } from '@angular/common';
export class VehicleManufacturerDropDown {
   vehicleManufacturerID: number;
   vehicleManufacturer: string;

  constructor(vehicleManufacturerDropDown) {
    {
       this.vehicleManufacturerID = vehicleManufacturerDropDown.vehicleManufacturerID || -1;
       this.vehicleManufacturer = vehicleManufacturerDropDown.vehicleManufacturer || '';
    }
  }
  
}

