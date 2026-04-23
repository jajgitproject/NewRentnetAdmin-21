// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerAppBasedVehicleCategory {
  customerAppVehicleCategoryMappingID: number;
  customerID: number;
  vehicleCategoryID: number;
  customerName:string;
  activationStatus:boolean;
  vehicleCategory:string;
  userID: number;
  constructor(customerAppBasedVehicleCategory) {
    {
       this.customerAppVehicleCategoryMappingID = customerAppBasedVehicleCategory.customerAppVehicleCategoryMappingID || -1;
       this.customerID = customerAppBasedVehicleCategory.customerID || '';
       this.customerName = customerAppBasedVehicleCategory.customerName || '';
       this.vehicleCategory = customerAppBasedVehicleCategory.vehicleCategory || '';
       this.activationStatus = customerAppBasedVehicleCategory.activationStatus || '';
    }
  }
  
}

