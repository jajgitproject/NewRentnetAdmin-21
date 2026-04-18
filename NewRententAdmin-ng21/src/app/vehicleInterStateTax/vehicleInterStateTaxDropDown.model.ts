// @ts-nocheck
import { formatDate } from '@angular/common';
export class VehicleInterStateTaxDropDown {
 
   vehicleInterStateTaxID: number;
   vehicleInterStateTax: string;

  constructor(vehicleInterStateTaxDropDown) {
    {
       this.vehicleInterStateTaxID = vehicleInterStateTaxDropDown.vehicleInterStateTaxID || -1;
       this.vehicleInterStateTax = vehicleInterStateTaxDropDown.vehicleInterStateTax || '';
    }
  }
  
}

